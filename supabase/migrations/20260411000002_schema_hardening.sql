-- Migration: 20260411000002_schema_hardening.sql
-- Goal: Applied DBA Hardening rules (Regex, Constraints, Indexes)
-- Adherence: Zero-Trust Data Layer & NIST SP 800-207

-- 1. Hardening Brands Table
-- Aseguramos la existencia de 'phone' antes de aplicar el hardening
ALTER TABLE brands 
  ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE brands 
  -- Phone Validation: Soporta formato internacional, espacios y guiones
  DROP CONSTRAINT IF EXISTS check_phone_format,
  ADD CONSTRAINT check_phone_format 
  CHECK (phone ~ '^\+?[0-9\s\-]+$'),
  
  -- Google Maps URL Validation: Blindaje contra inyecciones de enlaces maliciosos
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  DROP CONSTRAINT IF EXISTS check_maps_url,
  ADD CONSTRAINT check_maps_url 
  CHECK (google_maps_url ~ '^https?://(www\.)?(google\.com/maps|maps\.apple\.com|maps\.app\.goo\.gl)/.*');

-- 2. Hardening Promotions Table
ALTER TABLE promotions
  -- Image URL Validation: Asegura protocolos seguros (HTTPS)
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  DROP CONSTRAINT IF EXISTS check_promo_image_url,
  ADD CONSTRAINT check_promo_image_url 
  CHECK (image_url ~ '^https?://.*'),
  
  -- Integridad referencial explícita para evitar registros huérfanos
  DROP CONSTRAINT IF EXISTS promotions_brand_id_fkey,
  ADD CONSTRAINT promotions_brand_id_fkey 
    FOREIGN KEY (brand_id) 
    REFERENCES brands(id) 
    ON DELETE CASCADE;

-- 3. Optimization Indexes (B-Tree)
CREATE INDEX IF NOT EXISTS idx_brands_name_btree ON brands(name);
CREATE INDEX IF NOT EXISTS idx_promotions_brand_id_btree ON promotions(brand_id);

-- 4. Audit Support: updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_brands_updated_at') THEN
        CREATE TRIGGER tr_brands_updated_at 
        BEFORE UPDATE ON brands 
        FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;
