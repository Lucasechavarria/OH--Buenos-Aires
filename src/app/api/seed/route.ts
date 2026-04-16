import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/infrastructure/supabase-server";

// Using the same mock data from CatalogGrid
const MOCK_BRANDS = [
  { name: "Kosiuko", logoUrl: "/Kosiuko.png" },
  { name: "La Martina", logoUrl: "/La_Martina-Logo.png" },
  { name: "Stella McCartney", logoUrl: "/Stella-MC-Cartnet.png" },
  { name: "Brioche Dorée", logoUrl: "/Logo_Brioche_doree.png" },
  { name: "Mooi", logoUrl: "/MOOI.png" },
  { name: "Natura", logoUrl: "/NATURA.png" },
  { name: "Smart Fit", logoUrl: "/SMART-FIT.png" },
  { name: "Miller Joyeros", logoUrl: "/Miller-joyeros.png" },
  { name: "Psycho Bunny", logoUrl: "/psychobunny-logo.png" },
  { name: "Vasalissa", logoUrl: "/Vasalissa.png" },
  { name: "Samsonite", logoUrl: "/samsonite-logo-black-and-white.png" },
  { name: "Motorola", logoUrl: "/motorola.png" },
  { name: "Acai", logoUrl: "/Acai-300x300.png" },
  { name: "Anthropologie", logoUrl: "/Anthropologie-300x300.png" },
  { name: "Farmatodo", logoUrl: "/Farmatodo_logo.svg_-300x300.png" },
  { name: "Jano's", logoUrl: "/Janos.png" },
  { name: "Juicy Couture", logoUrl: "/Juicy-Couture-Logo.png" },
  { name: "Le Pain Quotidien", logoUrl: "/Le-pain.png" },
  { name: "Lidherma", logoUrl: "/Lidherma.png" },
  { name: "Optical World", logoUrl: "/Optical-World.png" },
  { name: "Perramus", logoUrl: "/PERRAMUS.png" },
  { name: "Rouge", logoUrl: "/ROuge-300x300.png" },
  { name: "Sacoa", logoUrl: "/sacoa-logo-black-and-white.png" },
  { name: "Simmons", logoUrl: "/simmons-1-logo-png-transparent.png" },
  { name: "Tea Connection", logoUrl: "/TEA-CONNECTION.png" },
  { name: "Vilebrequin", logoUrl: "/vilebrequin.png" }
];

export async function GET() {
  const supabase = await createServerSupabaseClient();
  
  // 1. Fetch existing brands to avoid duplicates
  const { data: existing } = await supabase.from("brands").select("name");
  const existingNames = new Set(existing?.map(e => e.name) || []);

  const toInsert = MOCK_BRANDS.filter(b => !existingNames.has(b.name)).map(b => ({
    name: b.name,
    logo_url: b.logoUrl,
    phone: "+54 11 0000-0000",
    google_maps_url: "https://maps.app.goo.gl/ohbuenosaires"
  }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("brands").insert(toInsert);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: `Se insertaron ${toInsert.length} marcas estáticas al panel Admin exitosamente.` 
  });
}
