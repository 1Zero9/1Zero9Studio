import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  getAllAdminProjects,
  getAdminProjectBySlug,
  saveAdminProject,
  setHomepageSpotlightProject,
} from "@/lib/admin-content";
import fs from "fs/promises";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

import { resolveCoverUrl } from "@/lib/content";

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await getAllAdminProjects();
    const mappedProjects = projects.map((p) => ({
      ...p,
      frontmatter: {
        ...p.frontmatter,
        cover: resolveCoverUrl(p.frontmatter.cover),
      },
    }));
    return NextResponse.json({ projects: mappedProjects });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, frontmatter, content } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const defaultFrontmatter = {
      title: frontmatter?.title || cleanSlug,
      summary: frontmatter?.summary || "Project summary description",
      date: frontmatter?.date || new Date().toISOString().split("T")[0],
      kind: frontmatter?.kind || "app",
      status: frontmatter?.status || "live",
      section: frontmatter?.section || "portfolio",
      accent: frontmatter?.accent || "#3B82F6",
      tags: frontmatter?.tags || ["Engineering", "Web App"],
      techStack: frontmatter?.techStack || ["Next.js", "TypeScript"],
      featured: frontmatter?.featured ?? false,
      featuredOnHome: frontmatter?.featuredOnHome ?? false,
      draft: frontmatter?.draft ?? false,
      readingTime: frontmatter?.readingTime || 3,
      ...frontmatter,
    };

    // Remove empty cover if coverAlt is missing to satisfy zod
    if (!defaultFrontmatter.cover) {
      delete (defaultFrontmatter as Record<string, unknown>).cover;
      delete (defaultFrontmatter as Record<string, unknown>).coverAlt;
    } else if (!defaultFrontmatter.coverAlt) {
      defaultFrontmatter.coverAlt = `${defaultFrontmatter.title} screenshot`;
    }

    const saved = await saveAdminProject(cleanSlug, defaultFrontmatter, content);
    if (defaultFrontmatter.featuredOnHome) {
      await setHomepageSpotlightProject(cleanSlug);
    }

    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/labs");
    revalidatePath(`/projects/${cleanSlug}`);

    return NextResponse.json({ project: saved, success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, frontmatter, content, action } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // 1. Dedicated action to set homepage spotlight
    if (action === "set-homepage-spotlight") {
      await setHomepageSpotlightProject(slug);
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath("/labs");
      revalidatePath(`/projects/${slug}`);
      return NextResponse.json({ success: true, message: `Homepage spotlight set to ${slug}` });
    }

    const existing = await getAdminProjectBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const mergedFrontmatter = {
      ...existing.frontmatter,
      ...frontmatter,
    };

    if (mergedFrontmatter.featuredOnHome) {
      await setHomepageSpotlightProject(slug);
    }

    // Handle coverAlt requirement if cover is set
    if (mergedFrontmatter.cover && !mergedFrontmatter.coverAlt) {
      mergedFrontmatter.coverAlt = `${mergedFrontmatter.title || slug} preview`;
    } else if (!mergedFrontmatter.cover) {
      delete mergedFrontmatter.cover;
      delete mergedFrontmatter.coverAlt;
    }

    const saved = await saveAdminProject(slug, mergedFrontmatter, content);

    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/labs");
    revalidatePath(`/projects/${slug}`);

    return NextResponse.json({ project: saved, success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const projectDir = path.join(PROJECTS_DIR, slug);
    try {
      await fs.rm(projectDir, { recursive: true, force: true });
    } catch {
      // In read-only serverless environment, mark project hidden in overrides
      await saveAdminProject(slug, { section: "hidden", draft: true });
    }

    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/labs");
    revalidatePath(`/projects/${slug}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
