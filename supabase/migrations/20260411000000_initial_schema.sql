-- Initial Schema for Oh! Buenos Aires (3NF)
-- Authored by: Backend Developer Agent

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tables
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor TEXT NOT NULL,
    local_number TEXT NOT NULL,
    UNIQUE(floor, local_number),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    phone TEXT,
    category_id UUID REFERENCES categories(id),
    location_id UUID REFERENCES locations(id),
    manager_id UUID REFERENCES auth.users(id), -- For RBAC
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read promotions" ON promotions FOR SELECT USING (true);

-- Authenticated brand manager operations
CREATE POLICY "Managers can update their own brand" ON brands
    FOR UPDATE USING (auth.uid() = manager_id);

CREATE POLICY "Managers can manage their own promotions" ON promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM brands 
            WHERE brands.id = promotions.brand_id 
            AND brands.manager_id = auth.uid()
        )
    );

-- 4. Initial Seed Data
INSERT INTO categories (name, slug) VALUES 
('Moda', 'moda'),
('Relojería', 'relojeria'),
('Accesorios', 'accesorios'),
('Hogar', 'hogar');
