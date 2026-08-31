import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  getAllAdminProjects,
  getAdminProjectBySlug,
  saveAdminProject,
} from "@/lib/admin-content";
import fs from "fs/promises";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await getAllAdminProjects();
    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch projects" },
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

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const defaultFrontmatter = {
      title: frontmatter?.title || cleanSlug,
      summary: frontmatter?.summary || "Project summary and overview.",
      date: frontmatter?.date || new Date().toISOString().slice(0, 10),
      status: frontmatter?.status || "in-progress",
      section: frontmatter?.section || (frontmatter?.status === "in-progress" ? "labs" : "portfolio"),
      kind: frontmatter?.kind || "app",
      accent: frontmatter?.accent || "#3b82f6",
      featured: frontmatter?.featured ?? false,
      draft: frontmatter?.draft ?? false,
      tags: frontmatter?.tags || ["web"],
      techStack: frontmatter?.techStack || ["Next.js", "TypeScript", "Tailwind CSS"],
      highlights: frontmatter?.highlights || [],
      links: frontmatter?.links || [],
      url: frontmatter?.url || "",
      repo: frontmatter?.repo || "",
      cover: frontmatter?.cover || "",
      coverAlt: frontmatter?.coverAlt || "",
      wipProgress: frontmatter?.wipProgress || "",
    };

    // Remove empty cover if coverAlt is missing to satisfy zod
    if (!defaultFrontmatter.cover) {
      delete defaultFrontmatter.cover;
      delete defaultFrontmatter.coverAlt;
    } else if (!defaultFrontmatter.coverAlt) {
      defaultFrontmatter.coverAlt = `${defaultFrontmatter.title} screenshot`;
    }

    const saved = await saveAdminProject(cleanSlug, defaultFrontmatter, content);
    return NextResponse.json({ project: saved, success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create project" },
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
    const { slug, frontmatter, content } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = await getAdminProjectBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const mergedFrontmatter = {
      ...existing.frontmatter,
      ...frontmatter,
    };

    // Handle coverAlt requirement if cover is set
    if (mergedFrontmatter.cover && !mergedFrontmatter.coverAlt) {
      mergedFrontmatter.coverAlt = `${mergedFrontmatter.title || slug} preview`;
    } else if (!mergedFrontmatter.cover) {
      delete mergedFrontmatter.cover;
      delete mergedFrontmatter.coverAlt;
    }

    const saved = await saveAdminProject(slug, mergedFrontmatter, content);
    return NextResponse.json({ project: saved, success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update project" },
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
    await fs.rm(projectDir, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
