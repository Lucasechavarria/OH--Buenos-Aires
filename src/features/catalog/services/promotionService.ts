// Promotion Service
// src/features/catalog/services/promotionService.ts

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountValue?: string;
  bank?: string;
  validUntil: string;
}

export const getActivePromotions = async (): Promise<Promotion[]> => {
  const response = await fetch("/api/v1/promotions/active");
  if (!response.ok) {
    throw new Error("Failed to fetch promotions");
  }
  return response.json();
};
