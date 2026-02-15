import { Resend } from 'resend';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

export async function sendConsultationReadyEmail(params: {
  to: string;
  destination: string;
  totalEUR: number;
}) {
  const resend = getResend();
  if (!resend) {
    return { ok: false, reason: 'Resend not configured' };
  }

  const subject = `Your holiday consultation is ready: ${params.destination}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5">
      <h2>Your holiday consultation is ready</h2>
      <p>Your concierge has prepared package options.</p>
      <p><strong>Top option:</strong> ${params.destination}</p>
      <p><strong>Package total:</strong> EUR ${params.totalEUR.toLocaleString()}</p>
      <p>Open your concierge dashboard to review full details.</p>
    </div>
  `;

  const text = [
    'Your holiday consultation is ready.',
    `Top option: ${params.destination}`,
    `Package total: EUR ${params.totalEUR.toLocaleString()}`,
    'Open your concierge dashboard to review full details.',
  ].join('\n');

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject,
    html,
    text,
  });

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}
