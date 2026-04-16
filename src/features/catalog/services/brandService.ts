// Brand Service
// src/features/catalog/services/brandService.ts

import { Brand } from "@/src/lib/domain/entities";

export const getBrands = async (): Promise<Brand[]> => {
  const response = await fetch("/api/v1/brands");
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  return response.json();
};
