import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
import { put, list } from "@vercel/blob";
import { ProjectFrontmatter } from "./project-schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const OVERRIDES_BLOB_PATH = "data/project-overrides.json";

export interface AdminProject {
  slug: string;
  frontmatter: Partial<ProjectFrontmatter> & {
    title: string;
    summary: string;
    date: string;
    section?: "portfolio" | "labs" | "hidden";
    featuredOnHome?: boolean;
  };
  content: string;
  hasThumbnail: boolean;
}

// In-memory fallback cache for serverless environments when disk is read-only
const memoryOverrides = new Map<string, { frontmatter: Record<string, unknown>; content?: string }>();

export function parseMdxFile(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }
  const [, yamlBlock, content] = match;
  try {
    const parsed = yaml.parse(yamlBlock || "");
    return { frontmatter: (parsed as Record<string, unknown>) || {}, content: (content || "").trim() };
  } catch {
    return { frontmatter: {}, content: raw };
  }
}

export function stringifyMdxFile(frontmatter: Record<string, unknown>, content: string): string {
  const yamlString = yaml.stringify(frontmatter).trim();
  return `---\n${yamlString}\n---\n\n${content.trim()}\n`;
}

function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) return process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

  for (const [key, value] of Object.entries(process.env)) {
    if (
      value &&
      (key.endsWith("_READ_WRITE_TOKEN") ||
        key.includes("BLOB_READ_WRITE_TOKEN") ||
        key.includes("BLOB_TOKEN") ||
        key.toLowerCase().includes("studio_blob"))
    ) {
      return value;
    }
  }
  return undefined;
}

// Helper to fetch blob overrides if BLOB token is configured
async function fetchBlobOverrides(): Promise<Record<string, { frontmatter: Record<string, unknown>; content?: string }>> {
  const blobToken = getBlobToken();
  if (!blobToken) {
    const obj: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
    for (const [k, v] of memoryOverrides.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  try {
    const { blobs } = await list({ prefix: OVERRIDES_BLOB_PATH, token: blobToken });
    const overrideBlob = blobs.find((b) => b.pathname === OVERRIDES_BLOB_PATH);
    if (overrideBlob?.url) {
      const res = await fetch(overrideBlob.url, { cache: "no-store" });
      if (res.ok) {
        return (await res.json()) || {};
      }
    }
  } catch (err) {
    console.warn("Could not load blob overrides:", err);
  }

  const obj: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
  for (const [k, v] of memoryOverrides.entries()) {
    obj[k] = v;
  }
  return obj;
}

// Helper to persist blob overrides
async function saveBlobOverrides(overrides: Record<string, { frontmatter: Record<string, unknown>; content?: string }>): Promise<void> {
  // Always update memory cache
  for (const [k, v] of Object.entries(overrides)) {
    memoryOverrides.set(k, v);
  }

  const blobToken = getBlobToken();
  if (blobToken) {
    try {
      await put(OVERRIDES_BLOB_PATH, JSON.stringify(overrides, null, 2), {
        access: "public",
        addRandomSuffix: false,
        token: blobToken,
      });
    } catch (err) {
      console.error("Failed to save overrides to Vercel Blob:", err);
    }
  }
}

export async function getAllAdminProjects(): Promise<AdminProject[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projectDirs = entries.filter((e) => e.isDirectory() && e.name !== "_template");

    const overrides = await fetchBlobOverrides();
    const projects: AdminProject[] = [];

    for (const dir of projectDirs) {
      const slug = dir.name;
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      try {
        const raw = await fs.readFile(mdxPath, "utf-8");
        const parsed = parseMdxFile(raw);

        // Merge disk data with any serverless blob overrides
        const override = overrides[slug];
        const finalFrontmatter = {
          ...parsed.frontmatter,
          ...(override?.frontmatter || {}),
        };
        const finalContent = override?.content !== undefined ? override.content : parsed.content;

        const cover = finalFrontmatter.cover as string | undefined;
        const hasThumbnail = Boolean(cover);

        projects.push({
          slug,
          frontmatter: finalFrontmatter as unknown as AdminProject["frontmatter"],
          content: finalContent,
          hasThumbnail,
        });
      } catch (err) {
        console.error(`Error reading project ${slug}:`, err);
      }
    }

    // Check for any newly added custom projects that only exist in overrides
    for (const [slug, override] of Object.entries(overrides)) {
      if (!projects.some((p) => p.slug === slug)) {
        projects.push({
          slug,
          frontmatter: override.frontmatter as unknown as AdminProject["frontmatter"],
          content: override.content || "",
          hasThumbnail: Boolean(override.frontmatter.cover),
        });
      }
    }

    // Sort by order or date
    return projects.sort((a, b) => {
      if (a.frontmatter.order !== undefined && b.frontmatter.order !== undefined) {
        return (a.frontmatter.order as number) - (b.frontmatter.order as number);
      }
      return ((b.frontmatter.date as string) || "").localeCompare((a.frontmatter.date as string) || "");
    });
  } catch (err) {
    console.error("Error reading projects directory:", err);
    return [];
  }
}

export async function getAdminProjectBySlug(slug: string): Promise<AdminProject | null> {
  try {
    const overrides = await fetchBlobOverrides();
    const override = overrides[slug];

    let diskFrontmatter: Record<string, unknown> = {};
    let diskContent = "";

    try {
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      const raw = await fs.readFile(mdxPath, "utf-8");
      const parsed = parseMdxFile(raw);
      diskFrontmatter = parsed.frontmatter;
      diskContent = parsed.content;
    } catch {
      // If not on disk, may be in overrides
    }

    if (!diskContent && !override) {
      return null;
    }

    const finalFrontmatter = {
      ...diskFrontmatter,
      ...(override?.frontmatter || {}),
    };
    const finalContent = override?.content !== undefined ? override.content : diskContent;

    return {
      slug,
      frontmatter: finalFrontmatter as unknown as AdminProject["frontmatter"],
      content: finalContent,
      hasThumbnail: Boolean(finalFrontmatter.cover),
    };
  } catch {
    return null;
  }
}

export async function saveAdminProject(
  slug: string,
  frontmatter: Record<string, unknown>,
  content?: string
): Promise<AdminProject> {
  const dirPath = path.join(PROJECTS_DIR, slug);
  const mdxPath = path.join(dirPath, "index.mdx");

  let existingContent = "";
  try {
    const raw = await fs.readFile(mdxPath, "utf-8");
    const parsed = parseMdxFile(raw);
    existingContent = parsed.content;
  } catch {
    existingContent = `## Overview\n\n${(frontmatter.summary as string) || ""}\n\n## Highlights\n\n- Built with modern web architecture\n- Designed for performance and clean user experience\n`;
  }

  const finalContent = content !== undefined ? content : existingContent;
  const mdxString = stringifyMdxFile(frontmatter, finalContent);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(mdxPath, mdxString, "utf-8");
  } catch (diskErr: unknown) {
    console.warn(
      `Filesystem is read-only (${(diskErr as Error).message || "EROFS"}). Persisting to cloud storage overrides.`
    );
  }

  // Persist to Blob overrides (so changes persist on Vercel serverless deployments)
  const overrides = await fetchBlobOverrides();
  overrides[slug] = {
    frontmatter,
    content: finalContent,
  };
  await saveBlobOverrides(overrides);

  return {
    slug,
    frontmatter: frontmatter as unknown as AdminProject["frontmatter"],
    content: finalContent,
    hasThumbnail: Boolean(frontmatter.cover),
  };
}

export async function updateProjectThumbnail(
  slug: string,
  coverUrl: string,
  coverAlt?: string
): Promise<AdminProject | null> {
  const project = await getAdminProjectBySlug(slug);
  if (!project) return null;

  const updatedFrontmatter = {
    ...project.frontmatter,
    cover: coverUrl,
    coverAlt: coverAlt || project.frontmatter.coverAlt || `${project.frontmatter.title} preview screenshot`,
  };

  return await saveAdminProject(slug, updatedFrontmatter as unknown as Record<string, unknown>, project.content);
}

export async function setHomepageSpotlightProject(targetSlug: string): Promise<void> {
  const projects = await getAllAdminProjects();
  for (const p of projects) {
    const isTarget = p.slug === targetSlug;
    if (Boolean(p.frontmatter.featuredOnHome) !== isTarget) {
      const updatedFrontmatter = {
        ...p.frontmatter,
        featuredOnHome: isTarget,
      };
      await saveAdminProject(p.slug, updatedFrontmatter as unknown as Record<string, unknown>, p.content);
    }
  }
}
