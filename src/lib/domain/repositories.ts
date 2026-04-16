// Repository Ports (Interfaces)
// Define cómo la aplicación interactúa con la persistencia

import { Brand, Promotion, Category } from "./entities";
import { BrandFilters } from "./schemas";

export interface IBrandRepository {
  findAll(filters?: BrandFilters): Promise<Brand[]>;
  findById(id: string): Promise<Brand | null>;
  findByCategory(categoryId: string): Promise<Brand[]>;
}

export interface IPromotionRepository {
  findByBrandId(brandId: string): Promise<Promotion[]>;
  findAllActive(): Promise<Promotion[]>;
  update(id: string, data: Partial<Promotion>): Promise<Promotion>;
}

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
}
