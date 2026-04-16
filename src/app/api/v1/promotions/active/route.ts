
import { NextRequest, NextResponse } from "next/server";
import { SupabasePromotionRepository } from "@/src/lib/infrastructure/repositories";

export async function GET(req: NextRequest) {
  try {
    const promotionRepo = new SupabasePromotionRepository();
    const promotions = await promotionRepo.findAllActive();

    return NextResponse.json(promotions);
  } catch (error: any) {
    console.error(`[API Error]`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
