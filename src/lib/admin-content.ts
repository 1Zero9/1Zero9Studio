import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
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
    return { frontmatter: parsed || {}, content: (content || "").trim() };
  } catch {
    return { frontmatter: {}, content: raw };
  }
}

export function stringifyMdxFile(frontmatter: Record<string, unknown>, content: string): string {
  const yamlString = yaml.stringify(frontmatter).trim();
  return `---\n${yamlString}\n---\n\n${content.trim()}\n`;
}

export async function getAllAdminProjects(): Promise<AdminProject[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projectDirs = entries.filter((e) => e.isDirectory() && e.name !== "_template");

    const projects: AdminProject[] = [];

    for (const dir of projectDirs) {
      const slug = dir.name;
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      try {
        const raw = await fs.readFile(mdxPath, "utf-8");
        const { frontmatter, content } = parseMdxFile(raw);

        // Check if thumbnail exists or is configured
        const cover = frontmatter.cover as string | undefined;
        const hasThumbnail = Boolean(cover);

        projects.push({
          slug,
          frontmatter: frontmatter as unknown as AdminProject["frontmatter"],
          content,
          hasThumbnail,
        });
      } catch (err) {
        console.error(`Error reading project ${slug}:`, err);
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
    const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
    const raw = await fs.readFile(mdxPath, "utf-8");
    const { frontmatter, content } = parseMdxFile(raw);
    return {
      slug,
      frontmatter: frontmatter as unknown as AdminProject["frontmatter"],
      content,
      hasThumbnail: Boolean(frontmatter.cover),
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
  await fs.mkdir(dirPath, { recursive: true });

  const mdxPath = path.join(dirPath, "index.mdx");

  // If content is not provided, try to preserve existing content or use default
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

  await fs.writeFile(mdxPath, mdxString, "utf-8");

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
