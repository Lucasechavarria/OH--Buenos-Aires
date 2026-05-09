"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a novedades de forma permanente
    router.replace("/novedades");
  }, [router]);

  return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center text-white gap-6">
      <Loader2 className="w-10 h-10 text-celeste-oh animate-spin" />
      <div className="text-center">
        <h1 className="text-2xl font-serif mb-2">Consolidando Novedades</h1>
        <p className="text-alabaster/40 text-[10px] uppercase tracking-[0.3em]">Redirigiendo a la nueva experiencia...</p>
      </div>
    </div>
  );
}
