import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { updateProjectThumbnail, saveProjectImage } from "@/lib/admin-content";
import path from "path";

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
      // When false, only upload the file and return its URL — don't write
      // it to the project's frontmatter yet. Used by the edit modal so a
      // thumbnail pick behaves like every other field (staged until Save),
      // instead of persisting immediately and ignoring Cancel.
      const attach = formData.get("attach") !== "false";

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

      const arrayBuffer = await file.arrayBuffer();
      const { url: coverUrl } = await saveProjectImage(
        originalName,
        file.type || "application/octet-stream",
        Buffer.from(arrayBuffer),
        slug
      );

      if (!attach) {
        return NextResponse.json({ success: true, coverUrl });
      }

      // Update project metadata
      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);
      if (!project) {
        return NextResponse.json(
          { error: `Project "${slug}" was not found, so the thumbnail couldn't be attached.` },
          { status: 404 }
        );
      }

      // Invalidate edge cache so homepage, portfolio, labs, and case studies update instantly
      revalidatePath("/", "layout");
      revalidatePath("/projects");
      revalidatePath("/labs");
      revalidatePath(`/projects/${slug}`);

      return NextResponse.json({
        success: true,
        coverUrl,
        project,
      });
    } else {
      // JSON body for direct URL-based thumbnail update
      const body = await req.json();
      const { slug, coverUrl, alt, attach = true } = body;

      if (!slug || !coverUrl) {
        return NextResponse.json(
          { error: "Slug and coverUrl are required" },
          { status: 400 }
        );
      }

      if (!attach) {
        return NextResponse.json({ success: true, coverUrl });
      }

      const project = await updateProjectThumbnail(slug, coverUrl, alt || undefined);
      if (!project) {
        return NextResponse.json(
          { error: `Project "${slug}" was not found, so the thumbnail couldn't be attached.` },
          { status: 404 }
        );
      }

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
