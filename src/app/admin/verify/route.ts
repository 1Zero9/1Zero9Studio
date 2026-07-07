import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken, createSessionCookie } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const email = await consumeLoginToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  await createSessionCookie(email);
  return NextResponse.redirect(new URL("/admin", request.url));
}
