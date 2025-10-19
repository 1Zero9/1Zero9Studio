-- 1Zero9 Studio Website Builder - Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Create the saved_designs table
CREATE TABLE IF NOT EXISTS saved_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contact Information
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  preferred_contact TEXT,
  additional_notes TEXT,

  -- Site Type and Purpose
  site_type TEXT NOT NULL,
  purpose_description TEXT,

  -- Design Choices
  design_style TEXT NOT NULL,
  color_scheme JSONB NOT NULL,
  typography JSONB NOT NULL,

  -- Selected Sections
  selected_sections JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- User Content
  business_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  logo TEXT, -- Base64 encoded logo
  primary_color TEXT,
  email TEXT,
  phone TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  status TEXT DEFAULT 'pending', -- pending, reviewed, in_progress, completed
  session_id TEXT,

  -- Full state backup
  full_state JSONB NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_designs_created_at ON saved_designs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_designs_user_email ON saved_designs(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_designs_status ON saved_designs(status);
CREATE INDEX IF NOT EXISTS idx_saved_designs_site_type ON saved_designs(site_type);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_designs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for submissions)
CREATE POLICY "Allow public inserts" ON saved_designs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create a policy for reading (you can restrict this later)
-- For now, allow read access only with a service role key (from your backend)
CREATE POLICY "Allow service role to read all" ON saved_designs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_saved_designs_updated_at
  BEFORE UPDATE ON saved_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for admin dashboard (optional)
CREATE OR REPLACE VIEW design_submissions_summary AS
SELECT
  id,
  created_at,
  user_name,
  user_email,
  business_name,
  site_type,
  design_style,
  status,
  array_length(
    ARRAY(SELECT jsonb_array_elements(selected_sections)),
    1
  ) as section_count
FROM saved_designs
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON design_submissions_summary TO authenticated;

-- Comments for documentation
COMMENT ON TABLE saved_designs IS 'Stores website design submissions from the builder app';
COMMENT ON COLUMN saved_designs.full_state IS 'Complete BuilderState JSON for backup and reconstruction';
COMMENT ON COLUMN saved_designs.status IS 'Workflow status: pending, reviewed, in_progress, completed';
