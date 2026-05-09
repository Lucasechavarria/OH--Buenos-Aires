-- New migration for expanded CMS capabilities
-- Date: 2026-05-09

-- 1. Hero Carousel Table
CREATE TABLE IF NOT EXISTS public.hero_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Instagram Posts Table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Site Settings Table (Key-Value pair for global config)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Site Services Table (For Visita page)
CREATE TABLE IF NOT EXISTS public.site_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT, -- lucide icon name
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_services ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for hero_images" ON public.hero_images FOR SELECT USING (active = true);
CREATE POLICY "Public read access for instagram_posts" ON public.instagram_posts FOR SELECT USING (active = true);
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for site_services" ON public.site_services FOR SELECT USING (active = true);

-- Admin full access (assuming authenticated users are admins for now as per project pattern)
CREATE POLICY "Admin full access for hero_images" ON public.hero_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for instagram_posts" ON public.instagram_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access for site_services" ON public.site_services FOR ALL TO authenticated USING (true);

-- Insert some default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('contact_phone', '+54 11 4000 0000', 'Teléfono principal de contacto'),
('contact_email', 'info@ohbuenosaires.com', 'Email principal de contacto'),
('contact_address', 'Av Pueyrredon y Azcuenaga, Recoleta', 'Dirección física'),
('contact_whatsapp', 'https://wa.me/541100000000', 'Link directo a WhatsApp'),
('social_instagram', 'https://www.instagram.com/oh_buenosaires', 'Link a Instagram'),
('social_linkedin', 'https://www.linkedin.com/company/ohbuenosaires', 'Link a LinkedIn'),
('site_title', 'OH! Buenos Aires | Luxury Shopping Experience', 'Meta título principal'),
('site_description', 'Descubrí el epicentro del lujo en Recoleta. Marcas exclusivas, gastronomía de primer nivel y experiencias únicas.', 'Meta descripción principal')
ON CONFLICT (key) DO NOTHING;

-- Insert default services
INSERT INTO public.site_services (title, description, icon_name, order_index) VALUES
('Estacionamiento', 'Servicio de Valet Parking y 3 niveles de parking subterráneo.', 'Car', 1),
('Wi-Fi High Speed', 'Conectividad total en todas las áreas comunes y terrazas.', 'Wifi', 2),
('Pet Friendly', 'Tus compañeros de cuatro patas son bienvenidos en nuestro shopping.', 'Dog', 3),
('Seguridad 24/7', 'Personal de seguridad y monitoreo constante para tu tranquilidad.', 'ShieldCheck', 4)
ON CONFLICT DO NOTHING;
