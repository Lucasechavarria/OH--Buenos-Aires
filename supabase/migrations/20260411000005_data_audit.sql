-- Migration: 20260411000005_data_audit.sql
-- Goal: Data Integrity Certification & CI Optimization

-- 1. Perfilado de Calidad (Vista de Auditoría)
CREATE OR REPLACE VIEW view_data_health AS
SELECT 
    name,
    CASE WHEN phone IS NULL OR phone = '' THEN 'FALTA TELÉFONO' ELSE 'OK' END AS status_tel,
    CASE WHEN google_maps_url IS NULL OR google_maps_url = '' THEN 'FALTA MAPS' ELSE 'OK' END AS status_maps,
    CASE WHEN category_id IS NULL THEN 'FALTA CATEGORÍA' ELSE 'OK' END AS status_cat
FROM brands;

-- 2. Endurecimiento de Nulidad (Zero-Nulls Policy)
-- Nota: Asegurarse de que no hay nulos antes de correr esto, o usar COALESCE
DO $$ 
BEGIN
    -- Limpieza preventiva de strings vacíos
    UPDATE brands SET phone = NULL WHERE phone = '';
    UPDATE brands SET google_maps_url = NULL WHERE google_maps_url = '';

    -- Aplicar NOT NULL si los datos están limpios
    -- Si falla, el Agente DBA deberá intervenir manualemente
    ALTER TABLE brands ALTER COLUMN phone SET NOT NULL;
    ALTER TABLE brands ALTER COLUMN google_maps_url SET NOT NULL;
END $$;

-- 3. Optimización para Búsqueda Case-Insensitive
CREATE INDEX IF NOT EXISTS idx_brands_name_lower_btree ON brands (LOWER(name));

-- 4. Actualización de Estadísticas (Rendimiento)
ANALYZE brands;
ANALYZE promotions;
ANALYZE categories;
ANALYZE locations;
