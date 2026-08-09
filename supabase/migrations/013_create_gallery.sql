-- 013_create_gallery.sql
-- Gallery items with Supabase Storage

CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  storage_path TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_published ON gallery_items(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_items_sort_order ON gallery_items(sort_order);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Admin can manage all gallery items
CREATE POLICY "Admin can manage gallery_items"
  ON gallery_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Public can read published gallery items
CREATE POLICY "Public can read published gallery"
  ON gallery_items FOR SELECT
  USING (is_published = true);
