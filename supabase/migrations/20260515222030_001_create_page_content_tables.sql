/*
  # Create page content management tables

  1. New Tables
    - `pages` - Main page records (home, services, contact)
    - `page_sections` - Content sections within each page (hero, services, why-us, etc.)
    - `page_section_items` - Individual items within sections (service cards, benefits list)

  2. Security
    - Enable RLS on all tables
    - Admin users can manage content
    - Public can only read published content
*/

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are readable by all"
  ON pages FOR SELECT
  USING (published = true);

CREATE POLICY "Admin can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE TABLE IF NOT EXISTS page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections readable with published page"
  ON page_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages WHERE pages.id = page_sections.page_id AND pages.published = true
    )
  );

CREATE POLICY "Admin can manage sections"
  ON page_sections FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE TABLE IF NOT EXISTS page_section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
  content jsonb NOT NULL DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_section_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items readable with published page"
  ON page_section_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM page_sections
      JOIN pages ON pages.id = page_sections.page_id
      WHERE page_sections.id = page_section_items.section_id
      AND pages.published = true
    )
  );

CREATE POLICY "Admin can manage items"
  ON page_section_items FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
