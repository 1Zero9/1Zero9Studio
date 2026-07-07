import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "admin_session";
const LOGIN_TOKEN_TTL_MINUTES = 15;
const SESSION_TTL_DAYS = 30;
const LOGIN_REQUEST_LIMIT_PER_HOUR = 5;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export function isAllowedAdminEmail(email: string) {
  const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(allowed) && email.trim().toLowerCase() === allowed;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Single-address allowlist, so a global request count is equivalent to a
// per-email one — no need to store the attempted email on the token row.
export async function isLoginRequestRateLimited(_email: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.adminLoginToken.count({
    where: { createdAt: { gte: since } },
  });
  return count >= LOGIN_REQUEST_LIMIT_PER_HOUR;
}

export async function createLoginToken(email: string) {
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MINUTES * 60 * 1000);
  const token = await new SignJWT({ email, type: "login" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSecret());

  await prisma.adminLoginToken.create({
    data: { tokenHash: hashToken(token), expiresAt },
  });

  return token;
}

export async function consumeLoginToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "login" || typeof payload.email !== "string") {
      return null;
    }

    const tokenHash = hashToken(token);
    const record = await prisma.adminLoginToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return null;
    }

    await prisma.adminLoginToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });

    return payload.email;
  } catch {
    return null;
  }
}

export async function createSessionCookie(email: string) {
  const token = await new SignJWT({ email, type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "session" || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<{ email: string }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}
