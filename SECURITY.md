# Política de Seguridad - Oh! Buenos Aires

## Política de Reporte de Vulnerabilidades

Nos tomamos la seguridad muy en serio. Si descubres una vulnerabilidad de seguridad en este proyecto, por favor NO abras una issue pública. En su lugar, reporta el hallazgo enviando un correo a security@ohbuenosaires.com.

### Alcance
Esta política cubre todos los repositorios y servicios bajo la organización de Oh! Buenos Aires.

## Medidas de Seguridad Activas

Para garantizar la experiencia "Boutique Europea", aplicamos las siguientes medidas:

- **Confianza Cero**: Todo acceso a la API es validado mediante JWT y políticas RLS en la base de datos.
- **Ciclo de Vida Seguro**: Cada cambio es escaneado por **Snyk** y **Trivy** antes de ser desplegado.
- **Hardening de Pipeline**: Utilizamos hashes SHA inmutables para todas nuestras acciones de despliegue.
- **Defensa en Profundidad**: Cabeceras de seguridad estrictas (CSP, HSTS) configuradas en el borde de la red (Vercel Edge).

## Proceso de Respuesta
1. Acuse de recibo en menos de 24 horas.
2. Análisis de impacto y blast radius.
3. Generación de parche de seguridad.
4. Divulgación pública coordinada tras la resolución.

---
© 2026 OH! BUENOS AIRES EXPERIENCE.
