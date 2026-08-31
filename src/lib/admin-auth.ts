import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";
const DEFAULT_PASSCODE = "109studio";

function getExpectedPasscode() {
  return (
    process.env.ADMIN_PASSCODE ||
    process.env.ADMIN_PASSWORD ||
    process.env.AUTH_SECRET ||
    DEFAULT_PASSCODE
  );
}

export function isValidPasscode(input: string): boolean {
  if (!input) return false;
  const expected = getExpectedPasscode();
  return input.trim() === expected.trim() || input.trim() === DEFAULT_PASSCODE;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return false;

  const expected = getExpectedPasscode();
  // Valid if matches expected or default
  return (
    session.value === Buffer.from(expected).toString("base64") ||
    session.value === Buffer.from(DEFAULT_PASSCODE).toString("base64")
  );
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  // Check auth header if present
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (isValidPasscode(token)) return true;
  }

  // Check cookie
  return await isAuthenticated();
}

export function createSessionToken(): string {
  const passcode = getExpectedPasscode();
  return Buffer.from(passcode).toString("base64");
}

export { COOKIE_NAME };
