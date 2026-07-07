import { Resend } from "resend";
import { site } from "@/lib/site";

export async function sendAdminLoginEmail(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY / RESEND_FROM_EMAIL environment variables are not set");
  }

  const verifyUrl = new URL("/admin/verify", site.url);
  verifyUrl.searchParams.set("token", token);

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: email,
    subject: "Your 1Zero9 admin sign-in link",
    text: `Sign in to the 1Zero9 admin portal: ${verifyUrl.toString()}\n\nThis link expires in 15 minutes and can only be used once.`,
  });
}
