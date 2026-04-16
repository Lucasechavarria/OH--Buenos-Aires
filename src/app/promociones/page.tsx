
"use client";

import Header from "@/src/features/catalog/components/Header";
import PromotionsSection from "@/src/components/PromotionsSection";
import ContactSection from "@/src/components/ContactSection";
import { motion } from "framer-motion";
import { Ticket, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PromotionsPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-gold-leaf selection:text-midnight-blue">
      <Header />
      
      {/* Hero Refinado para la página de Promociones */}
      <section className="relative pt-32 pb-20 px-6 bg-onyx overflow-hidden">
        <div className="absolute inset-0 ornament-bg mix-blend-soft-light opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-onyx" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-heritage hover:text-gold-shine transition-all mb-12 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Beneficios <br />
            <span className="text-gold-heritage">Exclusivos</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-alabaster/60 text-lg font-medium leading-relaxed font-sans"
          >
            Explora una selección curada de ofertas y experiencias únicas diseñadas por nuestras marcas para los visitantes más exigentes de Recoleta.
          </motion.p>
        </div>

        {/* Decoración Luxe */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full pointer-events-none opacity-20">
            <Ticket className="w-full h-full text-gold-heritage rotate-12 translate-x-1/2 translate-y-1/4" />
        </div>
      </section>

      {/* Reutilizamos el componente de grid de promociones pero ajustado */}
      <div className="relative -mt-10 pb-20">
        <PromotionsSection />
      </div>

      <ContactSection />
      
      <footer className="py-10 px-6 border-t border-onyx/5 text-center">
        <p className="text-onyx/40 text-[9px] font-bold uppercase tracking-[0.2em]">
          © 2026 OH! BUENOS AIRES EXPERIENCE. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </main>
  );
}
