import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, company } = body;

    // Honeypot field — hidden from real visitors via CSS, but bots tend to
    // fill in every input they find. Pretend success without sending.
    if (typeof company === "string" && company.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter a message (at least 10 characters)." },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 200);
    const cleanMessage = message.trim().slice(0, 5000);

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set — contact form email was not sent.");
      return NextResponse.json(
        { error: "Email sending isn't configured yet. Please email us directly instead." },
        { status: 503 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.CONTACT_TO_EMAIL || site.author.email;

    const resend = new Resend(resendApiKey);
    const { error: sendError } = await resend.emails.send({
      from: fromEmail.includes("@") ? `1Zero9 Studio <${fromEmail}>` : fromEmail,
      to: [toEmail],
      replyTo: cleanEmail,
      subject: `New message from ${cleanName} — 1Zero9 Studio`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px;">
          <div style="margin-bottom: 24px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #16a34a; margin-right: 8px;"></span>
            <strong style="font-size: 16px; color: #0f172a;">1Zero9 Studio Contact Form</strong>
          </div>
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">New message from ${escapeHtml(cleanName)}</h1>
          <p style="font-size: 14px; color: #475569; margin: 0 0 4px 0;">
            <strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #2563eb;">${escapeHtml(cleanEmail)}</a>
          </p>
          <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #eaeaea;">
            <p style="font-size: 14px; line-height: 1.6; color: #0f172a; margin: 0; white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 24px 0 0 0;">
            Sent via the contact form at 1zero9.com
          </p>
        </div>
      `,
    });

    if (sendError) {
      console.error("Resend contact send error:", sendError);
      return NextResponse.json(
        { error: "Something went wrong sending your message. Please try emailing us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to send message",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
