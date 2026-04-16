import { z } from "zod";

/**
 * Esquema de validación para los filtros del catálogo de marcas.
 * Soporta búsqueda textual, categorías múltiples y pisos del mall.
 */
export const BrandFilterSchema = z.object({
  q: z.string().optional(),
  categories: z.union([z.string(), z.array(z.string())]).transform((val) => 
    typeof val === "string" ? [val] : val
  ).optional(),
  floors: z.union([z.string(), z.array(z.string())]).transform((val) => 
    typeof val === "string" ? [val] : val
  ).optional(),
});

/**
 * Esquema para validar URLs de mapas (Google/Apple).
 */
export const MapUrlSchema = z.string().regex(
  /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.apple\.com|maps\.app\.goo\.gl)\/.+$/,
  "URL de mapa no válida. Debe ser un enlace oficial de Google Maps o Apple Maps."
);

export type BrandFilters = z.infer<typeof BrandFilterSchema>;
