# Sprint 6: Reestructuración de la Home y Directorio de Marcas

## Objetivo
Limpiar la página principal según el requerimiento del cliente (no mostrar listado de marcas en Home) y establecer un directorio de marcas independiente.

## Tareas Principales
- [x] **Creación de Sección Marcas (`/marcas`)**:
    - Generar la nueva ruta `src/app/marcas/page.tsx`.
    - Migrar el componente `CatalogGrid` y la lógica de búsqueda/filtrado.
- [x] **Limpieza de Home (`/`)**:
    - Eliminar el listado de marcas de la página principal.
    - Potenciar el Hero dinámico y la sección de últimas novedades (`LatestNewsSnippet`).
- [x] **Optimización de Navegación**:
    - Actualizar los enlaces del `Header` para incluir el acceso directo a Marcas/Tiendas.

## Criterios de Aceptación
- La Home no muestra el listado completo de marcas.
- Existe una página `/marcas` funcional con el catálogo completo.
- La navegación entre Home y Marcas es fluida.
