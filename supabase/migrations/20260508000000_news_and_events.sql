-- New migration for News and Events CRUD
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT,
    date DATE DEFAULT CURRENT_DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public read only active items
CREATE POLICY "Public read active news" ON news FOR SELECT USING (active = true);
CREATE POLICY "Public read active events" ON events FOR SELECT USING (active = true);

-- Admin full access
CREATE POLICY "Admin manage news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read news images" ON storage.objects FOR SELECT USING (bucket_id = 'news');
CREATE POLICY "Admin manage news images" ON storage.objects FOR ALL USING (bucket_id = 'news' AND auth.role() = 'authenticated');

CREATE POLICY "Public read events images" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Admin manage events images" ON storage.objects FOR ALL USING (bucket_id = 'events' AND auth.role() = 'authenticated');
