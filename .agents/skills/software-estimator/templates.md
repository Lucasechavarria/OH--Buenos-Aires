# Plantillas del Estimador de Software

Puedes copiar y pegar estas plantillas en el chat para que el agente las complete o modifique según tus necesidades.

## 1. Configuración de Costos Base
Usa esto para establecer las reglas del juego.

```json
{
  "currency": "USD",
  "hourly_rates": {
    "senior_dev": 60,
    "junior_dev": 30,
    "designer": 45,
    "pm": 50
  },
  "risk_coefficient": 1.2,
  "management_fee_percentage": 0.15
}
```

## 2. Desglose de Funcionalidades (Backlog para Estimación)
Completa los componentes que quieras presupuestar.

```markdown
### Componente: [Nombre]
- Funcionalidad A: [Descripción] (Estimación: X horas)
- Funcionalidad B: [Descripción] (Estimación: Y horas)
- Integraciones: [API/Servicios] (Estimación: Z horas)
```

## 3. Ejemplo de Cálculo de Retención
Estrategia para cobrar mantenimiento mensual.

```markdown
### Plan de Retención Mensual
- **Mantenimiento Técnico**: 5 horas/mes
- **Soporte Usuario**: 3 horas/mes
- **Actualizaciones Seguridad**: Incluidas
- **Costo Total Mensual**: [Horas * Tasa] + [Fee Infraestructura]
```
