import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  generateMagicLinkToken,
  isAllowedAdminEmail,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isAllowedAdminEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "This email is not authorized for administrative access." },
        { status: 403 }
      );
    }

    const token = generateMagicLinkToken(cleanEmail);
    const origin = req.nextUrl.origin || "http://localhost:3000";
    const magicLinkUrl = `${origin}/admin/verify?token=${token}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    let emailSent = false;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const { error: sendError } = await resend.emails.send({
          from: fromEmail.includes("@") ? `1Zero9 Studio <${fromEmail}>` : fromEmail,
          to: [cleanEmail],
          subject: "🔐 1Zero9 Studio — Admin Login Magic Link",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px;">
              <div style="margin-bottom: 24px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #16a34a; margin-right: 8px;"></span>
                <strong style="font-size: 16px; color: #0f172a;">1Zero9 Studio Control</strong>
              </div>
              <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Sign in to Workbench Admin</h1>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Click the button below to log in to your 1Zero9 Studio project vetting and workbench management portal. This link expires in 15 minutes.
              </p>
              <div style="margin: 28px 0;">
                <a href="${magicLinkUrl}" style="display: inline-block; padding: 14px 28px; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  Log in to 1Zero9 Admin →
                </a>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin: 24px 0 0 0; line-height: 1.5;">
                If you didn't request this email, you can safely ignore it.<br/>
                Direct link: <a href="${magicLinkUrl}" style="color: #2563eb;">${magicLinkUrl}</a>
              </p>
            </div>
          `,
        });

        if (!sendError) {
          emailSent = true;
        } else {
          console.warn("Resend email send error:", sendError);
        }
      } catch (err) {
        console.error("Resend error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      magicLinkUrl: process.env.NODE_ENV !== "production" ? magicLinkUrl : undefined,
      message: `Magic link sent to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate magic link",
      },
      { status: 500 }
    );
  }
}
