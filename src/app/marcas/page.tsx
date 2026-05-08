"use client";

import { Suspense } from "react";
import Header from "@/src/features/catalog/components/Header";
import { CatalogGrid } from "@/src/features/catalog/components/CatalogGrid";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ContactSection from "@/src/components/ContactSection";

export default function MarcasPage() {
  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Refinado para Marcas */}
      <section className="relative pt-32 pb-20 px-6 bg-onyx overflow-hidden">
        <div className="absolute inset-0 ornament-bg mix-blend-soft-light opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-onyx" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-celeste-oh hover:text-brand-accent transition-all mb-12 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Directorio de <br />
            <span className="text-celeste-oh">Marcas & Locales</span>
          </motion.h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-12">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl text-alabaster/60 text-lg font-medium leading-relaxed font-sans"
            >
              Explora nuestra selección curada de boutiques internacionales, gastronomía de autor y servicios exclusivos en el corazón de Recoleta.
            </motion.p>
            
            <a 
              href="https://maps.app.goo.gl/8Z1QYSy1anWy5jY96" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-celeste-oh hover:text-brand-accent transition-colors group"
            >
              <MapPin className="w-4 h-4" />
              <span>Cómo llegar</span>
            </a>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <div className="relative -mt-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-32">
              <div className="h-12 w-12 border-t-2 border-celeste-oh rounded-full animate-spin" />
            </div>
          }>
            <CatalogGrid />
          </Suspense>
        </div>
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
