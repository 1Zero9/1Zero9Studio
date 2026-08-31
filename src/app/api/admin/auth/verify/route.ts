import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createSessionToken,
  verifyMagicLinkToken,
} from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?error=missing_token", req.url));
  }

  const result = verifyMagicLinkToken(token);

  if (!result.valid || !result.email) {
    const errorMsg = encodeURIComponent(result.error || "Invalid or expired token");
    return NextResponse.redirect(new URL(`/admin/login?error=${errorMsg}`, req.url));
  }

  const sessionToken = createSessionToken(result.email);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}
