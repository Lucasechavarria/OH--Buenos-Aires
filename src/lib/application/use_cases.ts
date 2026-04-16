// Application Use Cases
// Capa de Aplicación (Orquestación)

import { IBrandRepository, IPromotionRepository } from "../domain/repositories";
import { Brand, Promotion } from "../domain/entities";
import { BrandFilters } from "../domain/schemas";

export class GetBrandsUseCase {
  constructor(private brandRepo: IBrandRepository) {}

  async execute(filters?: BrandFilters): Promise<Brand[]> {
    return this.brandRepo.findAll(filters);
  }
}

export class TogglePromotionUseCase {
  constructor(private promoRepo: IPromotionRepository) {}

  async execute(id: string, active: boolean): Promise<Promotion> {
    // Aquí se podrían agregar validaciones de negocio
    // ej: Máximo de 3 promociones activas por marca
    return this.promoRepo.update(id, { active });
  }
}
