import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects, listProjectImages, saveProjectImage, deleteProjectImage } from "@/lib/admin-content";
import fs from "fs/promises";
import path from "path";

const PUBLIC_PROJECTS_IMG_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "projects"
);

export interface LibraryImageItem {
  url: string;
  name: string;
  type: "database" | "local" | "project-cover";
  size?: number;
  uploadedAt?: string;
  sourceProject?: string;
  isUnused?: boolean;
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const imagesMap = new Map<string, LibraryImageItem>();

    // Build the set of image URLs actively referenced by a project (as a
    // cover or gallery image) so we can flag everything else as unused —
    // e.g. stale uploads left behind by earlier thumbnail replacements, or
    // imports that were never actually saved.
    const usedUrls = new Set<string>();
    const allProjects = await getAllAdminProjects();
    try {
      for (const p of allProjects) {
        const cover = p.frontmatter.cover;
        if (cover) usedUrls.add(cover);
        for (const g of p.frontmatter.gallery || []) {
          if (g?.url) usedUrls.add(g.url);
        }
      }
    } catch {
      // If this fails, isUnused just won't be computed — non-fatal.
    }

    // 1. Database-stored images (uploaded via the admin panel)
    try {
      const rows = await listProjectImages();
      for (const row of rows) {
        const url = `/api/images/${row.id}`;
        imagesMap.set(url, {
          url,
          name: row.filename,
          type: "database",
          uploadedAt: row.createdAt.toISOString(),
          sourceProject: row.slug || undefined,
          isUnused: usedUrls.size > 0 && !usedUrls.has(url),
        });
      }
    } catch (dbErr) {
      console.warn("Could not list database images:", dbErr);
    }

    // 2. Local static images bundled in the repo
    try {
      const files = await fs.readdir(PUBLIC_PROJECTS_IMG_DIR);
      for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg|webp|svg|gif|avif)$/i)) {
          const url = `/images/projects/${file}`;
          if (!imagesMap.has(url)) {
            imagesMap.set(url, {
              url,
              name: file,
              type: "local",
              isUnused: usedUrls.size > 0 && !usedUrls.has(url),
            });
          }
        }
      }
    } catch {
      // Directory may not exist in read-only serverless environment
    }

    // 3. Include any covers currently defined across all projects
    for (const p of allProjects) {
      const cover = p.frontmatter.cover;
      if (cover && !cover.startsWith("data:") && !imagesMap.has(cover)) {
        imagesMap.set(cover, {
          url: cover,
          name: `${p.frontmatter.title || p.slug} Cover`,
          type: cover.startsWith("/api/images/") ? "database" : "project-cover",
          sourceProject: p.frontmatter.title || p.slug,
        });
      }
    }

    const images = Array.from(imagesMap.values());

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to load media library",
      },
      { status: 500 }
    );
  }
}

// Upload a new image directly into the Media Library
export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const { url } = await saveProjectImage(
      file.name || "upload.png",
      file.type || "application/octet-stream",
      Buffer.from(arrayBuffer)
    );

    return NextResponse.json({
      success: true,
      url,
      name: file.name || "upload.png",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}

// Delete an image from the database. Local static files (bundled in the
// repo under /public/images/projects) can't be deleted at runtime — the
// serverless filesystem is read-only — so those are reported as already
// gone without erroring.
export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (url.startsWith("/api/images/")) {
      const id = url.replace("/api/images/", "");
      await deleteProjectImage(id);
    }

    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
