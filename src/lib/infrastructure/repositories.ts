// Supabase Repositories Implementation
// Capa de Infraestructura (Adaptadores)

import { supabase } from "./supabase-client";
import { 
  IBrandRepository, 
  IPromotionRepository, 
  ICategoryRepository 
} from "../domain/repositories";
import { Brand, Promotion, Category } from "../domain/entities";
import { BrandFilters } from "../domain/schemas";

export class SupabaseBrandRepository implements IBrandRepository {
  async findAll(filters?: BrandFilters): Promise<Brand[]> {
    let query = supabase
      .from("brands")
      .select(`
        id, 
        name, 
        logo_url, 
        phone,
        brand_categories (
          categories (id, name, slug)
        ),
        locations (id, floor, local_number),
        google_maps_url,
        promotions (id, title, active, image_url, valid_from, valid_until, external_url)
      `);

    // Applying Filters dynamically
    if (filters?.q) {
      query = query.ilike("name", `%${filters.q}%`);
    }

    if (filters?.categories && filters.categories.length > 0) {
      // Filtrado por slug de categoría (Join filtering)
      query = query.filter("categories.slug", "in", `(${filters.categories.join(",")})`);
    }

    if (filters?.floors && filters.floors.length > 0) {
      query = query.filter("locations.floor", "in", `(${filters.floors.join(",")})`);
    }

    const { data, error } = await query.order("name");

    if (error) throw new Error(error.message);

    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      logoUrl: b.logo_url,
      phone: b.phone,
      category: b.brand_categories?.[0]?.categories || undefined,
      categories: b.brand_categories?.map((bc: any) => bc.categories).filter(Boolean) || [],
      location: b.locations ? {
        id: b.locations.id,
        floor: b.locations.floor,
        localNumber: b.locations.local_number
      } : undefined,
      googleMapsUrl: b.google_maps_url,
      activePromotions: b.promotions
        ? b.promotions
            .filter((p: any) => {
              if (!p.active) return false;
              const now = new Date();
              const from = p.valid_from ? new Date(p.valid_from) : null;
              const until = p.valid_until ? new Date(p.valid_until) : null;
              
              if (from && now < from) return false;
              if (until && now > until) return false;
              
              return true;
            })
            .map((p: any) => ({
              id: p.id,
              brandId: p.brand_id,
              title: p.title,
              description: p.description,
              active: p.active,
              imageUrl: p.image_url,
              validFrom: p.valid_from ? new Date(p.valid_from) : undefined,
              validUntil: p.valid_until ? new Date(p.valid_until) : undefined,
              externalUrl: p.external_url
            }))
        : []
    }));
  }

  async findById(id: string): Promise<Brand | null> {
    const { data, error } = await supabase
      .from("brands")
      .select(`
        id,
        name,
        logo_url,
        phone,
        brand_categories (
          categories (*)
        ),
        locations (*),
        promotions (*)
      `)
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Brand;
  }

  async findByCategory(categoryId: string): Promise<Brand[]> {
    // Implementación similar a findAll con filtro
    return []; 
  }
}

export class SupabasePromotionRepository implements IPromotionRepository {
  async findByBrandId(brandId: string): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("brand_id", brandId);

    if (error) throw new Error(error.message);
    return data.map((p: any) => ({
        id: p.id,
        brandId: p.brand_id,
        title: p.title,
        description: p.description,
        active: p.active,
        createdAt: new Date(p.created_at)
    }));
  }

  async findAllActive(): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from("promotions")
      .select(`
        *,
        brands (
          name,
          logo_url
        )
      `)
      .eq("active", true);

    if (error) throw new Error(error.message);

    const now = new Date();
    
    return data
      .filter((p: any) => {
        const from = p.valid_from ? new Date(p.valid_from) : null;
        const until = p.valid_until ? new Date(p.valid_until) : null;
        if (from && now < from) return false;
        if (until && now > until) return false;
        return true;
      })
      .map((p: any) => ({
        id: p.id,
        brandId: p.brand_id,
        title: p.title,
        description: p.description,
        active: p.active,
        createdAt: new Date(p.created_at),
        imageUrl: p.image_url,
        validFrom: p.valid_from ? new Date(p.valid_from) : undefined,
        validUntil: p.valid_until ? new Date(p.valid_until) : undefined,
        externalUrl: p.external_url,
        brand: p.brands ? {
          name: p.brands.name,
          logoUrl: p.brands.logo_url
        } : undefined
      }));
  }

  async update(id: string, data: Partial<Promotion>): Promise<Promotion> {
    const { data: updated, error } = await supabase
      .from("promotions")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated as Promotion;
  }
}
