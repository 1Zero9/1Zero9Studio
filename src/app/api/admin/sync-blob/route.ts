import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects, updateProjectThumbnail, getBlobToken } from "@/lib/admin-content";
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

  const blobToken = getBlobToken();
  if (!blobToken) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob token is missing. Please ensure BLOB_READ_WRITE_TOKEN is configured in your Vercel Environment Variables or .env.local.",
      },
      { status: 400 }
    );
  }

  try {
    const uploaded: { fileName: string; url: string; projectSlug?: string }[] = [];
    const projects = await getAllAdminProjects();

    // 1. Read all files in public/images/projects
    let localFiles: string[] = [];
    try {
      localFiles = await fs.readdir(PUBLIC_PROJECTS_IMG_DIR);
    } catch {
      // If directory is not available, skip local folder scan
    }

    for (const file of localFiles) {
      if (!file.match(/\.(png|jpg|jpeg|webp|svg|gif|avif)$/i)) continue;

      const filePath = path.join(PUBLIC_PROJECTS_IMG_DIR, file);
      const fileBuffer = await fs.readFile(filePath);
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);

      // Upload to Vercel Blob
      const blob = await put(`projects/${file}`, fileBuffer, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: blobToken,
      });

      // Find if any project matches this filename
      const matchingProject = projects.find(
        (p) =>
          p.slug.toLowerCase() === baseName.toLowerCase() ||
          p.frontmatter.cover?.includes(file)
      );

      if (matchingProject) {
        await updateProjectThumbnail(matchingProject.slug, blob.url);
      }

      uploaded.push({
        fileName: file,
        url: blob.url,
        projectSlug: matchingProject?.slug,
      });
    }

    // 2. Also check if any projects have inline data URLs or missing CDN URLs
    for (const p of projects) {
      const cover = p.frontmatter.cover;
      if (cover && cover.startsWith("data:image/")) {
        // Convert inline base64 data URL to Vercel Blob
        const matches = cover.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches && matches[1] && matches[2]) {
          const mimeType = matches[1];
          const ext = mimeType.split("/")[1] || "png";
          const buffer = Buffer.from(matches[2], "base64");
          const fileName = `${p.slug}-${Date.now()}.${ext}`;

          const blob = await put(`projects/${fileName}`, buffer, {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            token: blobToken,
          });

          await updateProjectThumbnail(p.slug, blob.url);
          uploaded.push({
            fileName,
            url: blob.url,
            projectSlug: p.slug,
          });
        }
      }
    }

    // Revalidate edge cache across the entire site
    revalidatePath("/", "layout");
    revalidatePath("/projects");
    revalidatePath("/labs");

    return NextResponse.json({
      success: true,
      message: `Successfully pushed ${uploaded.length} assets to Vercel Blob CDN!`,
      uploaded,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to push assets to Vercel CDN",
      },
      { status: 500 }
    );
  }
}
