-- 014_create_website_content.sql
-- Website CMS content

CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES profiles(id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_website_content_key ON website_content(key);
CREATE INDEX IF NOT EXISTS idx_website_content_published ON website_content(published);

-- Enable RLS
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Admin can manage all website content
CREATE POLICY "Admin can manage website_content"
  ON website_content FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Public can read published content
CREATE POLICY "Public can read published website_content"
  ON website_content FOR SELECT
  USING (published = true);
