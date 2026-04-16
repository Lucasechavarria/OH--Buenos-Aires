
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/infrastructure/supabase-server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verificamos sesión con getUser (más seguro)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado - Debes iniciar sesión" }, { status: 401 });
    }

    console.log(`[API Admin] Usuario ${user.email} intentando borrar promoción ${id}`);

    const { error, status } = await supabase
      .from("promotions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API Admin] Error en Supabase:", error);
      return NextResponse.json({ 
        error: error.message, 
        details: error.details,
        hint: error.hint,
        code: error.code 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error("[API Admin] Error crítico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
