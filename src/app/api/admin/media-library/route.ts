import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects, getBlobToken, safePutBlob } from "@/lib/admin-content";
import { resolveCoverUrl } from "@/lib/content";
import { list, del } from "@vercel/blob";
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
        if (cover && !cover.includes("PoqnC70kcQQT3cUt") && !cover.startsWith("data:")) {
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

    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName).toLowerCase() || ".png";
    const baseName = path.basename(originalName, ext).replace(/[^a-z0-9-_]/gi, "-");
    const fileName = `${baseName}-${Date.now()}${ext}`;

    const blobToken = getBlobToken();
    let url = "";

    if (blobToken) {
      const blob = await safePutBlob(`projects/${fileName}`, file, {
        addRandomSuffix: false,
        allowOverwrite: true,
        token: blobToken,
      });
      url = blob.url;
    } else if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      // Local development fallback (no Blob token configured yet)
      await fs.mkdir(PUBLIC_PROJECTS_IMG_DIR, { recursive: true });
      const filePath = path.join(PUBLIC_PROJECTS_IMG_DIR, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      url = `/images/projects/${fileName}`;
    } else {
      return NextResponse.json(
        {
          error:
            "Vercel Blob storage isn't configured for this deployment (BLOB_READ_WRITE_TOKEN is missing). Add it to your Vercel project's Production environment variables, then redeploy, before uploading images.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url,
      name: fileName,
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

// Delete an image from Vercel Blob
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

    const blobToken = getBlobToken();
    if (blobToken && url.includes("blob.vercel-storage.com")) {
      await del(url, { token: blobToken });
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
