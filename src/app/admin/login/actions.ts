"use server";

import {
  createLoginToken,
  isAllowedAdminEmail,
  isLoginRequestRateLimited,
} from "@/lib/admin-auth";
import { sendAdminLoginEmail } from "@/lib/admin-email";

export async function requestLoginLink(_prev: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return "Enter an email address.";
  }

  if (await isLoginRequestRateLimited(email)) {
    return "Too many login requests. Try again in an hour.";
  }

  if (isAllowedAdminEmail(email)) {
    const token = await createLoginToken(email);
    await sendAdminLoginEmail(email, token);
  }

  return "If that address is allowed, a sign-in link is on its way — check your inbox.";
}
