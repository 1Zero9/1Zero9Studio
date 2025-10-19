# Email Setup Guide (Supabase)

This guide explains how to set up email notifications using Supabase's built-in email capabilities.

## Supabase Email Options

Supabase provides two ways to send emails:

### Option 1: Database Triggers + Edge Functions (Recommended)
Use Supabase Edge Functions to send emails when new records are inserted.

### Option 2: Resend Integration
Supabase partners with Resend for production email sending (free tier: 3,000 emails/month).

---

## Setup: Resend Integration (Recommended for Production)

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email
4. Add your domain (or use Resend's test domain for development)

### Step 2: Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Name it "1Zero9 Studio Builder"
4. Copy the API key (starts with `re_...`)

### Step 3: Add to Environment Variables

Add to your `.env.local`:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev  # Use your domain in production
RESEND_ADMIN_EMAIL=your-email@example.com  # Where to receive notifications
```

### Step 4: Install Resend SDK

```bash
npm install resend
```

### Step 5: Configure Your Domain (Production Only)

1. In Resend dashboard, click "Add Domain"
2. Add your domain (e.g., `1zero9.studio`)
3. Add the DNS records Resend provides to your domain registrar
4. Wait for verification (usually < 1 hour)
5. Use emails like `hello@1zero9.studio` or `noreply@1zero9.studio`

---

## Development vs Production

**Development:**
- Use Resend's test domain: `onboarding@resend.dev`
- Emails only sent to verified addresses
- Free tier is perfect for testing

**Production:**
- Use your own domain
- Unlimited recipient addresses
- Professional sender address

---

## Email Templates

We'll create two email templates:

1. **User Confirmation Email**
   - Sent to the user who submitted the design
   - Confirms receipt of their submission
   - Provides design summary and next steps

2. **Admin Notification Email**
   - Sent to your team
   - Alerts you of new submission
   - Includes all submission details and link to Supabase

---

## Testing

**To test emails in development:**

1. Verify your personal email in Resend dashboard
2. Submit a test design through the builder
3. Check your inbox for both emails
4. Check Resend dashboard for delivery logs

---

## Cost Breakdown

**Resend Pricing:**
- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro**: $20/month for 50,000 emails
- **Scale**: $80/month for 1,000,000 emails

For the builder app, the free tier is more than sufficient!

---

## Alternative: Supabase Native SMTP (Limited)

Supabase has basic SMTP capabilities but with limitations:
- Only for auth emails by default
- Requires custom Edge Function setup
- More complex configuration

**Recommendation:** Use Resend for simplicity and reliability.

---

## Next Steps After Setup

Once configured, the app will automatically:
1. ✅ Save design to Supabase
2. ✅ Send confirmation email to user
3. ✅ Send notification email to your team
4. ✅ Show success screen to user

---

## Troubleshooting

**"Failed to send email"**
- Check RESEND_API_KEY is correct
- Verify API key has send permissions
- Check Resend dashboard for error logs

**"Email not received"**
- Check spam/junk folder
- Verify recipient email in Resend (development only)
- Check Resend delivery logs

**"Invalid from address"**
- Use `onboarding@resend.dev` for testing
- Use verified domain for production
