# 🛡️ Observabilidad y Seguridad: Oh! Buenos Aires (2026)

Este documento detalla el protocolo de monitoreo y autosanación para la capa de datos bajo el estándar DevSecOps.

## 1. Monitoreo de Integridad de Datos (PostgreSQL)

Utilizamos PromQL para detectar intentos de inserción maliciosos o fallos en las reglas de validación (Regex).

### Alerta: Violación de Restricciones (Check Constraint)
Detecta si el backend está enviando formatos de teléfono o URL inválidos con frecuencia.

```promql
# Tasa de errores de violación de restricción (Código 23514)
rate(pg_stat_database_errors{error_code="23514"}[5m]) > 0.1
```

## 2. Protocolo de "Autosanación" (Self-Healing)

1. **Detección**: El Orquestador de IA monitorea el pico de errores `23514`.
2. **Análisis**: Si los errores provienen de locales legítimos con formatos internacionales no previstos en el Regex inicial.
3. **Acción**: El agente propone un ajuste en la expresión regular en `supabase/migrations/` y dispara un despliegue de emergencia tras validación humana.

## 3. Seguridad de Aplicación (Shift-Left)

### Escaneo de Dependencias (SCA)
Ejecutado por **Trivy** en cada PR:
- **Severidad Crítica**: Bloquea el despliegue.
- **Severidad Alta**: Registra aviso pero permite despliegue en Staging.

### Análisis Estático (SAST)
Ejecutado por **Snyk**:
- Verifica inyecciones SQL en los adaptadores de infraestructura.
- Valida que no existan secretos (API Keys) hardcodeados en el repositorio.

---
**Status**: 🟢 Activo (Pipeline GitHub Actions v1.2)
