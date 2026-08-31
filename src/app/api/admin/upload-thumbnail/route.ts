import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateProjectThumbnail } from "@/lib/admin-content";
import { put } from "@vercel/blob";
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
      const slug = formData.get("slug") as string | null;
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
          { error: `Unsupported file type (${ext}). Please upload a PNG, JPG, WebP, or SVG.` },
          { status: 400 }
        );
      }

      const fileName = `${slug}${ext}`;
      let coverUrl = "";

      // 1. Use Vercel Blob if token is present (cloud storage)
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`projects/${fileName}`, file, {
          access: "public",
          addRandomSuffix: false,
        });
        coverUrl = blob.url;
      } else {
        // 2. Otherwise write directly to public/images/projects on local filesystem
        await fs.mkdir(PUBLIC_PROJECTS_IMG_DIR, { recursive: true });
        const filePath = path.join(PUBLIC_PROJECTS_IMG_DIR, fileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.writeFile(filePath, buffer);
        coverUrl = `/images/projects/${fileName}`;
      }

      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);

      return NextResponse.json({
        success: true,
        coverUrl,
        storageType: process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "local-filesystem",
        project,
      });
    } else {
      // JSON body for URL-based thumbnail update
      const body = await req.json();
      const { slug, coverUrl, alt } = body;

      if (!slug || !coverUrl) {
        return NextResponse.json(
          { error: "Slug and coverUrl are required" },
          { status: 400 }
        );
      }

      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);
      return NextResponse.json({
        success: true,
        coverUrl,
        project,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload thumbnail" },
      { status: 500 }
    );
  }
}
