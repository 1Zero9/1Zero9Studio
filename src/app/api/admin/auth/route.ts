import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createSessionToken,
  isAuthenticated,
  isValidPasscode,
} from "@/lib/admin-auth";

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || !isValidPasscode(passcode)) {
      return NextResponse.json(
        { error: "Invalid passcode" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
