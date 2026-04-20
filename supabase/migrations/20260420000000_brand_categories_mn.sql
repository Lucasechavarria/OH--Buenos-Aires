-- Migration: Brand Categories M:N Relationship
-- Created on: 2026-04-20

-- 1. Create the join table
CREATE TABLE IF NOT EXISTS brand_categories (
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (brand_id, category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
DROP POLICY IF EXISTS "Public read brand_categories" ON brand_categories;
CREATE POLICY "Public read brand_categories" ON brand_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage brand_categories" ON brand_categories;
CREATE POLICY "Admin manage brand_categories" ON brand_categories FOR ALL USING (auth.role() = 'authenticated');

-- 4. Migrate existing data (if any)
INSERT INTO brand_categories (brand_id, category_id)
SELECT id, category_id 
FROM brands 
WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 5. Add default categories as requested
-- 'Deporte', 'Zapatillería', 'Moda', 'Accesorios'
INSERT INTO categories (name, slug) VALUES 
('Deporte', 'deporte'),
('Zapatillería', 'zapatilleria')
ON CONFLICT (slug) DO NOTHING;

-- 'Moda' and 'Accesorios' already exist in initial schema, but let's be sure.
INSERT INTO categories (name, slug) VALUES 
('Moda', 'moda'),
('Accesorios', 'accesorios')
ON CONFLICT (slug) DO NOTHING;
