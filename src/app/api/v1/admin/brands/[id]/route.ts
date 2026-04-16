import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/infrastructure/supabase-server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Verificamos sesión por seguridad
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log(`[API Admin] Intentando borrar marca ${id}`);

    const { error, status } = await supabase
      .from("brands")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API Admin] Error en Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error("[API Admin] Error crítico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
