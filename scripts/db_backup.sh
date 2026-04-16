#!/bin/bash
# ==========================================
# Oh! Buenos Aires - Logical Backup Script
# Authored by: Data Agent (Final Audit Phase)
# ==========================================

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
# URL de conexión (Debe configurarse como variable de entorno en Prod)
DB_URL=${DATABASE_URL:-"postgresql://postgres:[YOUR-PASSWORD]@db.sjtxyfmyrwufkszmzjtp.supabase.co:5432/postgres"}

echo "--- Iniciando Respaldo Lógico (Oh! Buenos Aires) ---"

# Crear directorio de backups si no existe
mkdir -p ./backups

# Exportar tablas del catálogo (Schema + Data)
pg_dump "$DB_URL" \
  --table=brands \
  --table=promotions \
  --table=categories \
  --table=locations \
  --table=audit_logs \
  --format=plain \
  --file="./backups/catalogo_v1_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
  echo "--- Respaldo Exitoso: ./backups/catalogo_v1_$TIMESTAMP.sql ---"
else
  echo "--- [ERROR] El respaldo ha fallado. Verifique la conexión. ---"
  exit 1
fi
