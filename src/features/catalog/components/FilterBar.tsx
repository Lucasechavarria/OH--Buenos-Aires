"use client";

import { Search, X } from "lucide-react";
import { useCatalogStore } from "../store/useCatalogStore";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { label: "Todas", value: "all" },
  { label: "Moda", value: "moda" },
  { label: "Gastronomía", value: "gastronomia" },
  { label: "Belleza", value: "belleza" },
  { label: "Joyería", value: "joyeria" },
  { label: "Relojería", value: "relojeria" },
  { label: "Tecnología", value: "tecnologia" },
  { label: "Deportes", value: "deportes" },
  { label: "Accesorios", value: "accesorios" },
  { label: "Hogar", value: "hogar" },
  { label: "Salud", value: "salud" },
  { label: "Eventos", value: "eventos" },
  { label: "Entretenimiento", value: "entretenimiento" },
];

export const FilterBar = () => {
  const { searchQuery, setSearchQuery, category, setCategory, resetFilters } = useCatalogStore();

  return (
    <div className="w-full bg-alabaster/50 border-b border-onyx/5 py-12 mb-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* ROW 1: Search, Category Select and Reset */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Main Controls Wrapper */}
          <div className="flex flex-col sm:flex-row w-full max-w-3xl gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-onyx/40 transition-colors group-focus-within:text-gold-heritage" />
              <input
                type="text"
                placeholder="Buscar marcas, locales o servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-onyx/10 rounded-xl focus:ring-1 focus:ring-gold-heritage focus:border-gold-heritage font-sans text-xs tracking-wide transition-all text-onyx placeholder:text-onyx/60 shadow-sm"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx bg-alabaster rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Elegante Dropdown de Categorías */}
            <div className="relative w-full sm:w-64">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none pl-6 pr-10 py-3.5 bg-white border border-onyx/10 rounded-xl focus:ring-1 focus:ring-gold-heritage focus:border-gold-heritage font-sans text-xs tracking-[0.2em] transition-all text-onyx font-bold shadow-sm uppercase cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-onyx/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {(searchQuery !== "" || category !== "all") && (
            <button
              onClick={resetFilters}
              className="text-[9px] uppercase tracking-[0.2em] text-onyx/40 hover:text-onyx transition-colors font-sans border border-onyx/10 hover:border-onyx/30 rounded-xl px-6 py-3.5 bg-white shadow-sm shrink-0 mt-2 sm:mt-0"
            >
              Borrar Filtros
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
