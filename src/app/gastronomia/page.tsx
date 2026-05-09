"use client";

import { useEffect, Suspense } from "react";
import Header from "@/src/features/catalog/components/Header";
import { CatalogGrid } from "@/src/features/catalog/components/CatalogGrid";
import { useCatalogStore } from "@/src/features/catalog/store/useCatalogStore";
import { motion } from "framer-motion";
import { Utensils, Clock, Star, ChevronRight } from "lucide-react";
import ContactSection from "@/src/components/ContactSection";
import Footer from "@/src/components/Footer";

export default function GastronomiaPage() {
  const { setCategory } = useCatalogStore();

  useEffect(() => {
    // Forzamos la categoría gastronomía al entrar
    setCategory("gastronomia");
    return () => setCategory("all");
  }, [setCategory]);

  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Inmersivo Gastronómico */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-onyx">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            alt="Gastronomía OH!" 
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-celeste-oh/30 bg-white/5 backdrop-blur-md mb-8">
              <Utensils className="w-4 h-4 text-celeste-oh" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Sabor & Exclusividad</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-serif text-white mb-6">
              Experiencia <br />
              <span className="text-celeste-oh">Gastronómica</span>
            </h1>
            <p className="max-w-2xl mx-auto text-alabaster/60 text-lg md:text-xl font-medium leading-relaxed font-sans italic">
              Desde cafés de especialidad hasta alta cocina internacional. 
              Un recorrido por los sabores más selectos de Recoleta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Gastronomy Grid */}
      <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif text-onyx mb-6">Nuestros Sabores</h2>
            <p className="text-onyx/60 text-base leading-loose font-medium">
              Explora nuestra selección de locales gastronómicos. Cada espacio ha sido elegido para ofrecerte una experiencia única y memorable.
            </p>
          </div>
          
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-onyx/40">
             <div className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-celeste-oh" />
               <span>Abierto hasta las 23:00</span>
             </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-celeste-oh" />
                <span>Selección Exclusiva</span>
              </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse text-celeste-oh">Cargando menú...</div>}>
          <CatalogGrid />
        </Suspense>
      </section>

      {/* Gastronomy Ethos */}
      <section className="bg-onyx py-24 px-6 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-celeste-oh/5 blur-3xl rounded-full translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1550966841-3ee3ad3ae948?auto=format&fit=crop&q=80&w=1000" 
              alt="Ambiente OH!" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-onyx/20" />
          </div>
          
          <div className="space-y-10">
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Más que comida, <br />
              <span className="text-celeste-oh">un momento único.</span>
            </h3>
            <p className="text-alabaster/60 text-lg leading-relaxed font-sans">
              En OH! Buenos Aires, la gastronomía es una forma de arte. Nuestros espacios están diseñados para que cada bocado sea acompañado de un ambiente sofisticado y un servicio de primer nivel.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <p className="text-3xl font-serif text-white mb-2">10+</p>
                <p className="text-[10px] uppercase tracking-widest text-alabaster/40 font-bold">Propuestas Únicas</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-white mb-2">3</p>
                <p className="text-[10px] uppercase tracking-widest text-alabaster/40 font-bold">Rooftops</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      
      <Footer />
    </main>
  );
}
