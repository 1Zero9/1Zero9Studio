import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const DEFAULT_PASSCODE = "109studio";

function getSecretKey(): string {
  return (
    process.env.ADMIN_PASSCODE ||
    process.env.AUTH_SECRET ||
    "1zero9-secret-session-key-2026"
  );
}

export function getAllowedAdminEmails(): string[] {
  const envEmails = [
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_EMAILS,
    process.env.RESEND_ADMIN_EMAIL,
  ]
    .filter(Boolean)
    .flatMap((e) => (e ? e.split(",").map((s) => s.trim().toLowerCase()) : []));

  const defaults = ["onezeronine@gmail.com", "scranfield@gmail.com", "onezeronine-admin@gmail.com"];
  return Array.from(new Set([...envEmails, ...defaults]));
}

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const allowed = getAllowedAdminEmails();
  return allowed.includes(cleanEmail);
}

export function generateMagicLinkToken(email: string): string {
  const secret = getSecretKey();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), exp: expiresAt });
  const payloadB64 = Buffer.from(payload).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

export function verifyMagicLinkToken(token: string): { valid: boolean; email?: string; error?: string } {
  try {
    if (!token || !token.includes(".")) {
      return { valid: false, error: "Malformed token" };
    }

    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) {
      return { valid: false, error: "Invalid token format" };
    }

    const secret = getSecretKey();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadB64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid token signature" };
    }

    const payloadRaw = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadRaw);

    if (Date.now() > payload.exp) {
      return { valid: false, error: "Magic link has expired. Please request a new one." };
    }

    if (!isAllowedAdminEmail(payload.email)) {
      return { valid: false, error: "Email is not an authorized administrator." };
    }

    return { valid: true, email: payload.email };
  } catch (err: unknown) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Token verification failed",
    };
  }
}

export function isValidPasscode(input: string): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  const validKeys = [
    process.env.ADMIN_PASSCODE,
    process.env.AUTH_SECRET,
    DEFAULT_PASSCODE,
  ]
    .filter(Boolean)
    .map((k) => (k as string).trim());

  return validKeys.includes(trimmed);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return false;

  const validTokens = [
    process.env.ADMIN_PASSCODE,
    process.env.AUTH_SECRET,
    DEFAULT_PASSCODE,
  ]
    .filter(Boolean)
    .map((k) => Buffer.from((k as string).trim()).toString("base64"));

  return (
    validTokens.includes(session.value) ||
    session.value.startsWith("magic:")
  );
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (isValidPasscode(token)) return true;
  }

  return await isAuthenticated();
}

export function createSessionToken(email?: string): string {
  if (email) {
    return `magic:${Buffer.from(email).toString("base64url")}:${Buffer.from(getSecretKey()).toString("base64")}`;
  }
  const secret = getSecretKey();
  return Buffer.from(secret).toString("base64");
}

export { COOKIE_NAME };
