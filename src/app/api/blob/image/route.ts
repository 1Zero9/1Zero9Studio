import { NextRequest, NextResponse } from "next/server";
import { getBlobToken } from "@/lib/admin-content";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blobUrl = searchParams.get("url");

  if (!blobUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Security: only proxy vercel blob storage URLs
  try {
    const parsed = new URL(blobUrl);
    if (!parsed.hostname.endsWith("blob.vercel-storage.com")) {
      return new NextResponse("Invalid blob domain", { status: 403 });
    }
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const token = getBlobToken();

  try {
    // Authenticated direct fetch
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(blobUrl, {
      headers,
      next: { revalidate: 86400 }, // Cache for 24h
    });

    if (!res.ok) {
      return new NextResponse(`Blob fetch failed: ${res.statusText}`, {
        status: res.status,
      });
    }

    const contentType = res.headers.get("content-type") || "image/png";

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    return new NextResponse(
      err instanceof Error ? err.message : "Error fetching blob image",
      { status: 500 }
    );
  }
}
