// API Adapter for Promotions (Update)
// app/api/v1/promotions/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { SupabasePromotionRepository } from "@/src/lib/infrastructure/repositories";
import { TogglePromotionUseCase } from "@/src/lib/application/use_cases";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const promoRepo = new SupabasePromotionRepository();
    const togglePromo = new TogglePromotionUseCase(promoRepo);

    const updated = await togglePromo.execute(id, body.active);

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 400, 
        title: "Bad Request", 
        detail: error.message 
      }, 
      { status: 400 }
    );
  }
}
