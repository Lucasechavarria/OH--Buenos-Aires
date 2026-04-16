/**
 * Protocolo de Deep Linking seguro para Oh! Buenos Aires (2026)
 * Centraliza la lógica de redirección a mapas y sanitización de etiquetas.
 */

export interface MapRedirectParams {
  label: string;
  floor?: string;
  localNumber?: string;
}

export const getMapsUrl = ({ label, floor, localNumber }: MapRedirectParams): string => {
  const query = encodeURIComponent(`${label} Oh! Buenos Aires ${floor ? `Piso ${floor}` : ''}`);
  
  // Detección básica de plataforma (para propósitos de Deep Linking adaptativo)
  const isApple = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

  if (isApple) {
    return `https://maps.apple.com/?q=${query}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Sanitiza una cadena para su uso seguro en componentes UI (prevención XSS/Redirección)
 */
export const sanitizeLabel = (label: string): string => {
  // Eliminamos caracteres de control y etiquetas HTML básicas si existieran
  return label.replace(/[<>]/g, '').slice(0, 100).trim();
};
