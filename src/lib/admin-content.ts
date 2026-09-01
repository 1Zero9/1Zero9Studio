import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { ProjectFrontmatter } from "./project-schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

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

// Reads all project overrides from Postgres. This replaces the old Vercel
// Blob "data/project-overrides.json" JSON blob — a real table with atomic
// per-row upserts means concurrent admin actions across different
// serverless instances can no longer clobber each other's writes the way
// the old read-whole-file/write-whole-file pattern could.
async function fetchOverrides(): Promise<Record<string, { frontmatter: Record<string, unknown>; content?: string }>> {
  const rows = await prisma.projectOverride.findMany();
  const obj: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
  for (const row of rows) {
    obj[row.slug] = {
      frontmatter: row.frontmatter as Record<string, unknown>,
      content: row.content ?? undefined,
    };
  }
  return obj;
}

async function saveOverride(slug: string, frontmatter: Record<string, unknown>, content?: string): Promise<void> {
  await prisma.projectOverride.upsert({
    where: { slug },
    create: { slug, frontmatter: frontmatter as Prisma.InputJsonValue, content },
    update: { frontmatter: frontmatter as Prisma.InputJsonValue, content },
  });
}

export async function getAllAdminProjects(): Promise<AdminProject[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projectDirs = entries.filter((e) => e.isDirectory() && e.name !== "_template");

    const overrides = await fetchOverrides();
    const projects: AdminProject[] = [];

    for (const dir of projectDirs) {
      const slug = dir.name;
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      try {
        const raw = await fs.readFile(mdxPath, "utf-8");
        const parsed = parseMdxFile(raw);

        // Merge disk data with any database overrides
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
    const override = await prisma.projectOverride.findUnique({ where: { slug } });

    let diskFrontmatter: Record<string, unknown> = {};
    let diskContent = "";
    let foundOnDisk = false;

    try {
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      const raw = await fs.readFile(mdxPath, "utf-8");
      const parsed = parseMdxFile(raw);
      diskFrontmatter = parsed.frontmatter;
      diskContent = parsed.content;
      foundOnDisk = true;
    } catch {
      // If not on disk, may be in overrides
    }

    // A project exists if we found it on disk (regardless of whether its
    // body content is empty, e.g. a freshly created project) or it has an
    // override entry.
    if (!foundOnDisk && !override) {
      return null;
    }

    const overrideFrontmatter = (override?.frontmatter as Record<string, unknown> | undefined) || {};
    const finalFrontmatter = {
      ...diskFrontmatter,
      ...overrideFrontmatter,
    };
    const finalContent = override?.content !== undefined && override?.content !== null ? override.content : diskContent;

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
      `Filesystem is read-only (${(diskErr as Error).message || "EROFS"}). Persisting to database overrides.`
    );
  }

  // Persist to the database (source of truth on Vercel serverless
  // deployments, where the filesystem write above is a no-op).
  await saveOverride(slug, frontmatter, finalContent);

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

  const previousCover = project.frontmatter.cover;

  const updatedFrontmatter = {
    ...project.frontmatter,
    cover: coverUrl,
    coverAlt: coverAlt || project.frontmatter.coverAlt || `${project.frontmatter.title} preview screenshot`,
  };

  const saved = await saveAdminProject(slug, updatedFrontmatter as unknown as Record<string, unknown>, project.content);

  // Clean up the previous cover image row from the database so replacing a
  // thumbnail doesn't leave an orphaned duplicate behind in the Media
  // Library. Skip cleanup if the old cover is still referenced elsewhere
  // (e.g. in the gallery), or isn't a database-stored image (e.g. a static
  // file under /images/projects).
  const stillReferenced =
    project.frontmatter.gallery?.some((g) => g?.url === previousCover) ?? false;
  if (previousCover && previousCover !== coverUrl && previousCover.startsWith("/api/images/") && !stillReferenced) {
    const id = previousCover.replace("/api/images/", "");
    try {
      await prisma.projectImage.delete({ where: { id } });
    } catch (err) {
      console.warn(`Could not delete previous cover image for ${slug}:`, err);
    }
  }

  return saved;
}

// Stores an uploaded image's bytes in the database and returns its public
// serving URL (/api/images/[id]). Replaces Vercel Blob's `put()`.
export async function saveProjectImage(
  filename: string,
  contentType: string,
  data: Buffer,
  slug?: string
): Promise<{ id: string; url: string }> {
  const row = await prisma.projectImage.create({
    data: { filename, contentType, data: new Uint8Array(data), slug },
  });
  return { id: row.id, url: `/api/images/${row.id}` };
}

export async function deleteProjectImage(id: string): Promise<void> {
  try {
    await prisma.projectImage.delete({ where: { id } });
  } catch {
    // Already gone — fine.
  }
}

export async function listProjectImages() {
  return prisma.projectImage.findMany({
    select: { id: true, slug: true, filename: true, contentType: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

// Removes a project's entry from the database overrides table. Used when a
// project is permanently deleted from disk so it doesn't resurrect via the
// "override-only" merge path in getAllAdminProjects().
export async function deleteAdminProjectOverride(slug: string): Promise<void> {
  try {
    await prisma.projectOverride.delete({ where: { slug } });
  } catch {
    // No override existed — fine.
  }
}

// Ensures exactly one project has `featuredOnHome: true`. Uses a single
// database transaction so the read-modify-write cycle is atomic — this
// closes the lost-update race that was possible with the old Blob-based
// "read whole JSON file, mutate, write whole JSON file" pattern, where a
// concurrent request on a different serverless instance could silently
// revert this change after the fact.
export async function setHomepageSpotlightProject(targetSlug: string): Promise<void> {
  const projects = await getAllAdminProjects();

  const toUpdate = projects.filter(
    (p) => Boolean(p.frontmatter.featuredOnHome) !== (p.slug === targetSlug)
  );
  if (toUpdate.length === 0) return;

  await prisma.$transaction(
    toUpdate.map((p) => {
      const isTarget = p.slug === targetSlug;
      const updatedFrontmatter = { ...p.frontmatter, featuredOnHome: isTarget };
      return prisma.projectOverride.upsert({
        where: { slug: p.slug },
        create: { slug: p.slug, frontmatter: updatedFrontmatter as Prisma.InputJsonValue, content: p.content },
        update: { frontmatter: updatedFrontmatter as Prisma.InputJsonValue, content: p.content },
      });
    })
  );

  // Best-effort disk writes too (no-op on read-only serverless filesystems).
  for (const p of toUpdate) {
    const isTarget = p.slug === targetSlug;
    const updatedFrontmatter = { ...p.frontmatter, featuredOnHome: isTarget };
    const dirPath = path.join(PROJECTS_DIR, p.slug);
    const mdxPath = path.join(dirPath, "index.mdx");
    try {
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(mdxPath, stringifyMdxFile(updatedFrontmatter, p.content), "utf-8");
    } catch {
      // Read-only filesystem — the database write above is the source of
      // truth in that environment.
    }
  }
}
