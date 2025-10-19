import { BuilderState } from '@/types/builder'

export function generateUserConfirmationEmail(state: BuilderState, designId: string) {
  const { userContent, contactInfo, siteType, designStyle } = state

  const subject = `Your Website Design Submission Received - ${userContent.businessName}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                🚀 Design Received!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #f8fafc; font-size: 16px; line-height: 24px;">
                Hi <strong>${contactInfo.name}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 24px;">
                Thank you for using the 1Zero9 Studio Website Builder! We've received your design submission for <strong>${userContent.businessName}</strong>.
              </p>

              <!-- Design Summary Box -->
              <div style="background-color: #0f172a; border: 2px solid #334155; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <h2 style="margin: 0 0 16px 0; color: #dc2626; font-size: 20px;">Your Design Summary</h2>

                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px; width: 140px;">Business Name:</td>
                    <td style="color: #f8fafc; font-size: 14px; font-weight: 600;">${userContent.businessName}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px;">Tagline:</td>
                    <td style="color: #f8fafc; font-size: 14px;">${userContent.tagline}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px;">Site Type:</td>
                    <td style="color: #f8fafc; font-size: 14px; text-transform: capitalize;">${siteType}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px;">Design Style:</td>
                    <td style="color: #f8fafc; font-size: 14px; text-transform: capitalize;">${designStyle}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-size: 14px;">Sections:</td>
                    <td style="color: #f8fafc; font-size: 14px;">${state.selectedSections.filter(s => s.enabled).length} sections</td>
                  </tr>
                </table>
              </div>

              <!-- What's Next -->
              <div style="margin: 30px 0;">
                <h2 style="margin: 0 0 16px 0; color: #f8fafc; font-size: 20px;">What Happens Next?</h2>

                <div style="margin: 16px 0;">
                  <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                    <div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">1</span>
                    </div>
                    <div>
                      <h3 style="margin: 0 0 4px 0; color: #f8fafc; font-size: 16px; font-weight: 600;">We'll Review Your Design</h3>
                      <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 20px;">Our team will carefully review all your selections and prepare a detailed proposal.</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                    <div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">2</span>
                    </div>
                    <div>
                      <h3 style="margin: 0 0 4px 0; color: #f8fafc; font-size: 16px; font-weight: 600;">You'll Receive a Quote</h3>
                      <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 20px;">Within 24-48 hours, we'll email you a customized quote and timeline.</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: flex-start;">
                    <div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                      <span style="color: white; font-weight: bold; font-size: 14px;">3</span>
                    </div>
                    <div>
                      <h3 style="margin: 0 0 4px 0; color: #f8fafc; font-size: 16px; font-weight: 600;">Let's Build Together</h3>
                      <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 20px;">Once approved, we'll start bringing your vision to life!</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reference Number -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%); border-radius: 8px; padding: 16px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Your Reference Number</p>
                <p style="margin: 0; color: white; font-size: 18px; font-weight: bold; font-family: monospace;">${designId.substring(0, 8).toUpperCase()}</p>
              </div>

              <p style="margin: 30px 0 0 0; color: #cbd5e1; font-size: 14px; line-height: 22px;">
                If you have any questions, feel free to reply to this email. We're here to help!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #f8fafc;">The 1Zero9 Studio Team</strong>
              </p>
              <p style="margin: 16px 0 0 0; color: #475569; font-size: 12px;">
                © 2025 1Zero9 Studio. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
Hi ${contactInfo.name},

Thank you for using the 1Zero9 Studio Website Builder!

We've received your design submission for ${userContent.businessName}.

YOUR DESIGN SUMMARY
-------------------
Business Name: ${userContent.businessName}
Tagline: ${userContent.tagline}
Site Type: ${siteType}
Design Style: ${designStyle}
Sections: ${state.selectedSections.filter(s => s.enabled).length} sections

WHAT HAPPENS NEXT?
------------------
1. We'll Review Your Design
   Our team will carefully review all your selections and prepare a detailed proposal.

2. You'll Receive a Quote
   Within 24-48 hours, we'll email you a customized quote and timeline.

3. Let's Build Together
   Once approved, we'll start bringing your vision to life!

Your Reference Number: ${designId.substring(0, 8).toUpperCase()}

If you have any questions, feel free to reply to this email.

Best regards,
The 1Zero9 Studio Team

© 2025 1Zero9 Studio. All rights reserved.
  `

  return { subject, html, text }
}

export function generateAdminNotificationEmail(state: BuilderState, designId: string) {
  const { userContent, contactInfo, siteType, designStyle, selectedSections } = state

  const subject = `🚀 New Website Submission: ${userContent.businessName} (${siteType})`

  const enabledSections = selectedSections.filter(s => s.enabled)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">
                🚀 New Website Submission
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px;">
                A new website design has been submitted through the builder.
              </p>

              <!-- Client Info -->
              <div style="background-color: #f8fafc; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
                <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 18px;">Client Information</h2>
                <table width="100%" cellpadding="6" cellspacing="0">
                  <tr>
                    <td style="color: #64748b; font-size: 13px; width: 120px;">Name:</td>
                    <td style="color: #0f172a; font-size: 13px; font-weight: 600;">${contactInfo.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 13px;">Email:</td>
                    <td style="color: #0f172a; font-size: 13px;"><a href="mailto:${contactInfo.email}" style="color: #dc2626; text-decoration: none;">${contactInfo.email}</a></td>
                  </tr>
                  ${contactInfo.phone ? `
                  <tr>
                    <td style="color: #64748b; font-size: 13px;">Phone:</td>
                    <td style="color: #0f172a; font-size: 13px;">${contactInfo.phone}</td>
                  </tr>
                  ` : ''}
                  ${contactInfo.preferredContact ? `
                  <tr>
                    <td style="color: #64748b; font-size: 13px;">Prefers:</td>
                    <td style="color: #0f172a; font-size: 13px; text-transform: capitalize;">${contactInfo.preferredContact}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Project Details -->
              <div style="background-color: #fef3c7; border-left: 4px solid #fbbf24; padding: 16px; margin: 20px 0;">
                <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 18px;">Project Details</h2>
                <table width="100%" cellpadding="6" cellspacing="0">
                  <tr>
                    <td style="color: #78350f; font-size: 13px; width: 120px;">Business:</td>
                    <td style="color: #0f172a; font-size: 13px; font-weight: 600;">${userContent.businessName}</td>
                  </tr>
                  <tr>
                    <td style="color: #78350f; font-size: 13px;">Tagline:</td>
                    <td style="color: #0f172a; font-size: 13px;">${userContent.tagline}</td>
                  </tr>
                  <tr>
                    <td style="color: #78350f; font-size: 13px;">Site Type:</td>
                    <td style="color: #0f172a; font-size: 13px; text-transform: capitalize;">${siteType}</td>
                  </tr>
                  <tr>
                    <td style="color: #78350f; font-size: 13px;">Design Style:</td>
                    <td style="color: #0f172a; font-size: 13px; text-transform: capitalize;">${designStyle}</td>
                  </tr>
                  ${userContent.email ? `
                  <tr>
                    <td style="color: #78350f; font-size: 13px;">Business Email:</td>
                    <td style="color: #0f172a; font-size: 13px;">${userContent.email}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Sections -->
              <div style="margin: 20px 0;">
                <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px;">Selected Sections (${enabledSections.length})</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${enabledSections.map((section, index) => `
                    <span style="display: inline-block; background-color: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">
                      ${index + 1}. ${section.type}
                    </span>
                  `).join('')}
                </div>
              </div>

              ${contactInfo.notes ? `
              <!-- Additional Notes -->
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">Additional Notes:</h3>
                <p style="margin: 0; color: #475569; font-size: 13px; line-height: 20px;">${contactInfo.notes}</p>
              </div>
              ` : ''}

              <!-- Action Buttons -->
              <div style="margin: 30px 0; text-align: center;">
                <a href="https://app.supabase.com" style="display: inline-block; background-color: #dc2626; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 0 8px;">
                  View in Supabase →
                </a>
              </div>

              <!-- Reference -->
              <p style="margin: 20px 0 0 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; color: #64748b; font-size: 12px; text-align: center; font-family: monospace;">
                Reference ID: ${designId}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                This notification was automatically generated by the Website Builder
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const text = `
NEW WEBSITE SUBMISSION

Client Information:
- Name: ${contactInfo.name}
- Email: ${contactInfo.email}
${contactInfo.phone ? `- Phone: ${contactInfo.phone}` : ''}
${contactInfo.preferredContact ? `- Prefers: ${contactInfo.preferredContact}` : ''}

Project Details:
- Business: ${userContent.businessName}
- Tagline: ${userContent.tagline}
- Site Type: ${siteType}
- Design Style: ${designStyle}
${userContent.email ? `- Business Email: ${userContent.email}` : ''}

Selected Sections (${enabledSections.length}):
${enabledSections.map((s, i) => `${i + 1}. ${s.type}`).join('\n')}

${contactInfo.notes ? `Additional Notes:\n${contactInfo.notes}\n` : ''}

Reference ID: ${designId}

View full details in Supabase: https://app.supabase.com
  `

  return { subject, html, text }
}
