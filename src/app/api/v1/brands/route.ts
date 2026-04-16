// API Adapter for Brands
// src/app/api/v1/brands/route.ts

import { NextRequest, NextResponse } from "next/server";
import { SupabaseBrandRepository } from "@/src/lib/infrastructure/repositories";
import { GetBrandsUseCase } from "@/src/lib/application/use_cases";
import { BrandFilterSchema } from "@/src/lib/domain/schemas";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // 1. Extract Search Params
    const { searchParams } = new URL(req.url);
    
    // Suporte para parámetros múltiples ?cat=moda&cat=hogar
    const rawParams = {
      q: searchParams.get("q") || undefined,
      categories: searchParams.getAll("cat").length > 0 ? searchParams.getAll("cat") : undefined,
      floors: searchParams.getAll("floor").length > 0 ? searchParams.getAll("floor") : undefined,
    };

    // 2. Validation (Domain Layer)
    const filters = BrandFilterSchema.parse(rawParams);

    // 3. Execution (Application Layer)
    const brandRepo = new SupabaseBrandRepository();
    const getBrands = new GetBrandsUseCase(brandRepo);

    const brands = await getBrands.execute(filters);

    return NextResponse.json(brands, {
      headers: {
        "X-Request-ID": requestId,
      }
    });

  } catch (error: any) {
    console.error(`[API Error] RequestID: ${requestId}`, error);

    // RFC 7807 Error Handling
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          type: "https://ohbuenosaires.com/errors/validation-failed",
          title: "Error de Validación",
          status: 400,
          detail: "Los parámetros de búsqueda proporcionados son inválidos.",
          instance: req.nextUrl.pathname,
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        type: "https://ohbuenosaires.com/errors/internal-server-error",
        status: 500, 
        title: "Error Interno del Servidor", 
        detail: error.message || "Ha ocurrido un error inesperado al procesar la solicitud.",
        instance: req.nextUrl.pathname,
        requestId
      }, 
      { 
        status: 500,
        headers: { "X-Request-ID": requestId }
      }
    );
  }
}
