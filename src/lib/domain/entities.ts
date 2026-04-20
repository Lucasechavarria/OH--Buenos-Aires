// Domain Entities for Oh! Buenos Aires
// Capa de Dominio (Entidades e Interfaces)

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Location {
  id: string;
  floor: string;
  localNumber: string;
}

export interface Promotion {
  id: string;
  brandId: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: Date;
  imageUrl?: string;
  validFrom?: Date;
  validUntil?: Date;
  brand?: {
    name: string;
    logoUrl?: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  phone?: string;
  category?: Category;
  categories?: Category[];
  location?: Location;
  googleMapsUrl?: string;
  activePromotions?: Promotion[];
}
