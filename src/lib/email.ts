import { Resend } from 'resend'
import { BuilderState } from '@/types/builder'
import { generateUserConfirmationEmail, generateAdminNotificationEmail } from './email-templates'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || 'your-email@example.com'

export async function sendConfirmationEmail(state: BuilderState, designId: string) {
  try {
    const { subject, html, text } = generateUserConfirmationEmail(state, designId)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: state.contactInfo.email!,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Error sending confirmation email:', error)
      throw new Error('Failed to send confirmation email')
    }

    console.log('Confirmation email sent:', data)
    return { success: true, data }

  } catch (error) {
    console.error('Confirmation email error:', error)
    // Don't throw - we don't want email failures to break the submission
    return { success: false, error }
  }
}

export async function sendAdminNotification(state: BuilderState, designId: string) {
  try {
    const { subject, html, text } = generateAdminNotificationEmail(state, designId)

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
      // Optional: Add reply-to as the customer's email
      replyTo: state.contactInfo.email,
    })

    if (error) {
      console.error('Error sending admin notification:', error)
      throw new Error('Failed to send admin notification')
    }

    console.log('Admin notification sent:', data)
    return { success: true, data }

  } catch (error) {
    console.error('Admin notification error:', error)
    // Don't throw - we don't want email failures to break the submission
    return { success: false, error }
  }
}

export async function sendBothEmails(state: BuilderState, designId: string) {
  // Send both emails in parallel
  const [confirmationResult, adminResult] = await Promise.allSettled([
    sendConfirmationEmail(state, designId),
    sendAdminNotification(state, designId),
  ])

  return {
    confirmation: confirmationResult.status === 'fulfilled' ? confirmationResult.value : { success: false },
    admin: adminResult.status === 'fulfilled' ? adminResult.value : { success: false },
  }
}
