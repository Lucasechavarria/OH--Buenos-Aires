export interface Brand {
  id: string;
  name: string;
  logo: string;
  promo: string;
  phone: string;
  location: string;
  category: "Moda" | "Relojería" | "Accesorios" | "Hogar";
}

export const brands: Brand[] = [
  {
    id: "rolex",
    name: "Rolex",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Rolex_logo.svg/1200px-Rolex_logo.svg.png",
    promo: "CONSULTÁ POR EDICIONES LIMITADAS",
    phone: "+54 11 4803-0000",
    location: "Planta Baja - Local 10",
    category: "Relojería",
  },
  {
    id: "lv",
    name: "Louis Vuitton",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/1200px-Louis_Vuitton_logo_and_wordmark.svg.png",
    promo: "15% OFF EN SELECCIÓN DE CUERO",
    phone: "+54 11 4803-1111",
    location: "Primer Piso - Local 22",
    category: "Moda",
  },
  {
    id: "gucci",
    name: "Gucci",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gucci_logo.svg/1200px-Gucci_logo.svg.png",
    promo: "NUEVA COLECCIÓN DISPONIBLE",
    phone: "+54 11 4803-2222",
    location: "Planta Baja - Local 05",
    category: "Moda",
  },
  {
    id: "hermes",
    name: "Hermès",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Hermes_Paris_Logo.svg/1200px-Hermes_Paris_Logo.svg.png",
    promo: "EXPERIENCIA PERSONALIZADA",
    phone: "+54 11 4803-3333",
    location: "Primer Piso - Local 18",
    category: "Accesorios",
  },
  {
    id: "prada",
    name: "Prada",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Prada-Logo.svg/1200px-Prada-Logo.svg.png",
    promo: "10% OFF EXCLUSIVO OH!",
    phone: "+54 11 4803-4444",
    location: "Planta Baja - Local 12",
    category: "Moda",
  },
  {
    id: "cartier",
    name: "Cartier",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cartier_logo.svg/1200px-Cartier_logo.svg.png",
    promo: "CATÁLOGO DE JOYERÍA 2026",
    phone: "+54 11 4803-5555",
    location: "Planta Baja - Local 08",
    category: "Relojería",
  },
];
