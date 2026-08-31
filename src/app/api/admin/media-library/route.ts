import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects, getBlobToken } from "@/lib/admin-content";
import { resolveCoverUrl } from "@/lib/content";
import { list } from "@vercel/blob";
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
  type: "vercel-blob" | "local" | "project-cover";
  size?: number;
  uploadedAt?: string;
  sourceProject?: string;
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const imagesMap = new Map<string, LibraryImageItem>();

    // 1. Fetch images from Vercel Blob if token is available
    const blobToken = getBlobToken();
    if (blobToken) {
      try {
        const { blobs } = await list({ token: blobToken });
        for (const blob of blobs) {
          // Only image files
          if (
            blob.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|avif)$/i) ||
            blob.pathname.startsWith("projects/")
          ) {
            const resolvedUrl = resolveCoverUrl(blob.url) || blob.url;
            imagesMap.set(resolvedUrl, {
              url: resolvedUrl,
              name: path.basename(blob.pathname),
              type: "vercel-blob",
              size: blob.size,
              uploadedAt: blob.uploadedAt ? new Date(blob.uploadedAt).toISOString() : undefined,
            });
          }
        }
      } catch (blobErr) {
        console.warn("Could not list Vercel blobs:", blobErr);
      }
    }

    // 2. Fetch images from local public/images/projects directory
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
            });
          }
        }
      }
    } catch {
      // Directory may not exist in read-only serverless environment
    }

    // 3. Include any covers currently defined across all projects
    try {
      const projects = await getAllAdminProjects();
      for (const p of projects) {
        const cover = p.frontmatter.cover;
        if (cover) {
          const resolvedCover = resolveCoverUrl(cover) || cover;
          if (!imagesMap.has(resolvedCover)) {
            imagesMap.set(resolvedCover, {
              url: resolvedCover,
              name: `${p.frontmatter.title || p.slug} Cover`,
              type: cover.includes("blob.vercel-storage.com") ? "vercel-blob" : "project-cover",
              sourceProject: p.frontmatter.title || p.slug,
            });
          }
        }
      }
    } catch (projErr) {
      console.warn("Could not list project covers:", projErr);
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
