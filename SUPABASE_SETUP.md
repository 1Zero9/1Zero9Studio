# Supabase Setup Guide

This guide will help you set up Supabase for the Website Builder app.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: `1zero9-studio-builder` (or your choice)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes for setup

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL**: Something like `https://abcdefghijk.supabase.co`
   - **Anon/Public Key**: A long JWT token starting with `eyJ...`
   - **Service Role Key**: Another JWT token (keep this SECRET - only use server-side)

## Step 3: Create the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" to execute the script
6. You should see "Success. No rows returned" message
7. Go to **Table Editor** to verify the `saved_designs` table was created

## Step 4: Set Up Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Replace the placeholder values with your actual credentials from Step 2
4. **Important**: Add `.env.local` to your `.gitignore` (should already be there)

## Step 5: Restart Your Dev Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

The app will now have access to Supabase credentials.

## Step 6: Test the Integration

1. Visit `http://localhost:3000/builder`
2. Complete all 7 steps of the wizard
3. Submit the form on the final step
4. Go to your Supabase dashboard → **Table Editor** → **saved_designs**
5. You should see your submission!

## Verification Checklist

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] `saved_designs` table visible in Table Editor
- [ ] Environment variables added to `.env.local`
- [ ] Dev server restarted
- [ ] Test submission successful
- [ ] Data visible in Supabase dashboard

## Database Schema Overview

The `saved_designs` table includes:

- **Contact Info**: user_name, user_email, user_phone, preferred_contact
- **Design Choices**: site_type, design_style, color_scheme, typography
- **Sections**: selected_sections (array of section configs)
- **Content**: business_name, tagline, logo, social_links
- **Metadata**: status, created_at, updated_at
- **Backup**: full_state (complete BuilderState JSON)

## Security Notes

1. **Row Level Security (RLS)** is enabled
2. Public users can INSERT (submit designs)
3. Only authenticated users (you) can SELECT (view designs)
4. Never commit `.env.local` to git
5. Service Role Key should ONLY be used server-side (API routes)

## Next Steps

After setup is complete:
- ✅ Designs will be saved to Supabase automatically
- 📧 Ready for email notification integration
- 📊 View submissions in Supabase dashboard
- 🔍 Query data for analytics

## Troubleshooting

**"Failed to save design"**
- Check environment variables are correct
- Verify Supabase project is active
- Check browser console for specific error

**"Unauthorized" error**
- Ensure RLS policies are created (run schema.sql)
- Verify API keys are correct
- Check if using correct key (anon vs service role)

**Can't see submitted data**
- Login to Supabase dashboard
- Check Table Editor → saved_designs
- Verify the insert policy is active

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Review the API route logs in terminal
3. Inspect network tab in browser DevTools
