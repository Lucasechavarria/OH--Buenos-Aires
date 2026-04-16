-- Expand Schema for Banners, Subscribers and Admin Storage Policies
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);

-- Admin CRUD (Any authenticated user as staff)
CREATE POLICY "Admin full access banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access subscribers" ON subscribers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage locations" ON locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage promotions" ON promotions FOR ALL USING (auth.role() = 'authenticated');

-- Storage buckets handling (Requires supabase storage extensions to be active, standard on Supabase)
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Admin manage banners bucket" ON storage.objects FOR ALL USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Public read brand-logos bucket" ON storage.objects FOR SELECT USING (bucket_id = 'brand-logos');
CREATE POLICY "Admin manage brand-logos bucket" ON storage.objects FOR ALL USING (bucket_id = 'brand-logos' AND auth.role() = 'authenticated');
