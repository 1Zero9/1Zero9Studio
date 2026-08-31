import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateProjectThumbnail, getBlobToken, safePutBlob } from "@/lib/admin-content";
import fs from "fs/promises";
import path from "path";

const PUBLIC_PROJECTS_IMG_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "projects"
);

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const slug = (formData.get("slug") as string) || "project";
      const alt = formData.get("alt") as string | null;

      if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
      }

      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
      }

      // Check file extension
      const originalName = file.name || "cover.png";
      const ext = path.extname(originalName).toLowerCase() || ".png";
      const allowedExts = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"];

      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { error: `Unsupported file type (${ext}). Please upload a PNG, JPG, WebP, SVG, or GIF.` },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const fileName = `${slug}-${timestamp}${ext}`;
      let coverUrl = "";
      let storageType = "local-filesystem";
      const blobToken = getBlobToken();

      // 1. Try Vercel Blob if token is found
      if (blobToken) {
        try {
          const blob = await safePutBlob(`projects/${fileName}`, file, {
            addRandomSuffix: false,
            allowOverwrite: true,
            token: blobToken,
          });
          coverUrl = blob.url;
          storageType = "vercel-blob";
        } catch (blobErr: unknown) {
          console.error("Vercel blob put error, falling back to data URL:", blobErr);
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const mimeType = file.type || "image/png";
          coverUrl = `data:${mimeType};base64,${base64}`;
          storageType = "inline-data";
        }
      } else if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
        // 2. Local development fallback
        try {
          await fs.mkdir(PUBLIC_PROJECTS_IMG_DIR, { recursive: true });
          const filePath = path.join(PUBLIC_PROJECTS_IMG_DIR, fileName);
          const arrayBuffer = await file.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(arrayBuffer));
          coverUrl = `/images/projects/${fileName}`;
          storageType = "local-filesystem";
        } catch {
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const mimeType = file.type || "image/png";
          coverUrl = `data:${mimeType};base64,${base64}`;
          storageType = "inline-data";
        }
      } else {
        // 3. Serverless fallback without blob token -> high quality inline data URL
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type || "image/png";
        coverUrl = `data:${mimeType};base64,${base64}`;
        storageType = "inline-data";
      }

      // Update project metadata
      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);

      // Invalidate edge cache so homepage, portfolio, labs, and case studies update instantly
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath("/labs");
      revalidatePath(`/projects/${slug}`);

      return NextResponse.json({
        success: true,
        coverUrl,
        storageType,
        project,
      });
    } else {
      // JSON body for direct URL-based thumbnail update
      const body = await req.json();
      const { slug, coverUrl, alt } = body;

      if (!slug || !coverUrl) {
        return NextResponse.json(
          { error: "Slug and coverUrl are required" },
          { status: 400 }
        );
      }

      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);

      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath("/labs");
      revalidatePath(`/projects/${slug}`);

      return NextResponse.json({
        success: true,
        coverUrl,
        project,
      });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to upload thumbnail",
      },
      { status: 500 }
    );
  }
}
