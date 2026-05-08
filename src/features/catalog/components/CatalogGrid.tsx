"use client";

import { useState } from "react";
import { Brand } from "@/src/lib/domain/entities";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getBrands } from "../services/brandService";
import { FlipCardOptimized } from "./FlipCard/FlipCardOptimized";
import { PerformanceWrapper } from "./PerformanceWrapper";
import { FilterBar } from "./FilterBar";
import { CuratedSelection } from "./CuratedSelection";
import { useCatalogStore } from "../store/useCatalogStore";
import { usePersistentFilters } from "../hooks/usePersistentFilters";


const MOCK_BRANDS: Brand[] = [
  { id: "1", name: "Kosiuko", logoUrl: "/Kosiuko.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l1", floor: "PB", localNumber: "L01" } },
  { id: "2", name: "La Martina", logoUrl: "/La_Martina-Logo.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l2", floor: "PB", localNumber: "L02" } },
  { id: "3", name: "Stella McCartney", logoUrl: "/Stella-MC-Cartnet.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l3", floor: "Piso 1", localNumber: "L101" } },
  { id: "4", name: "Brioche Dorée", logoUrl: "/Logo_Brioche_doree.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l4", floor: "PB", localNumber: "L06" } },
  { id: "5", name: "Mooi", logoUrl: "/MOOI.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l5", floor: "Piso 1", localNumber: "L105" } },
  { id: "6", name: "Natura", logoUrl: "/NATURA.png", category: { id: "c3", name: "Belleza", slug: "belleza" }, location: { id: "l6", floor: "PB", localNumber: "L08" } },
  { id: "7", name: "Smart Fit", logoUrl: "/SMART-FIT.png", category: { id: "c4", name: "Deportes", slug: "deportes" }, location: { id: "l7", floor: "1er Subsuelo", localNumber: "S101" } },
  { id: "8", name: "Miller Joyeros", logoUrl: "/Miller-joyeros.png", category: { id: "c5", name: "Joyería", slug: "joyeria" }, location: { id: "l8", floor: "PB", localNumber: "L12" } },
  { id: "9", name: "Psycho Bunny", logoUrl: "/psychobunny-logo.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l9", floor: "PB", localNumber: "L03" } },
  { id: "10", name: "Vasalissa", logoUrl: "/Vasalissa.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l10", floor: "PB", localNumber: "L05" } },
  { id: "11", name: "Samsonite", logoUrl: "/samsonite-logo-black-and-white.png", category: { id: "c6", name: "Accesorios", slug: "accesorios" }, location: { id: "l11", floor: "PB", localNumber: "L15" } },
  { id: "12", name: "Motorola", logoUrl: "/motorola.png", category: { id: "c7", name: "Tecnología", slug: "tecnologia" }, location: { id: "l12", floor: "Piso 1", localNumber: "L104" } },
  
  // Nuevas marcas agregadas
  { id: "13", name: "Acai", logoUrl: "/Acai-300x300.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l13", floor: "PB", localNumber: "L07" } },
  { id: "14", name: "Anthropologie", logoUrl: "/Anthropologie-300x300.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l14", floor: "Piso 1", localNumber: "L102" } },
  { id: "15", name: "Farmatodo", logoUrl: "/Farmatodo_logo.svg_-300x300.png", category: { id: "c8", name: "Salud", slug: "salud" }, location: { id: "l15", floor: "1er Subsuelo", localNumber: "S103" } },
  { id: "16", name: "Jano's", logoUrl: "/Janos.png", category: { id: "c9", name: "Eventos", slug: "eventos" }, location: { id: "l16", floor: "Piso 2", localNumber: "L201" } },
  { id: "17", name: "Juicy Couture", logoUrl: "/Juicy-Couture-Logo.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l17", floor: "Piso 1", localNumber: "L103" } },
  { id: "18", name: "Le Pain Quotidien", logoUrl: "/Le-pain.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l18", floor: "PB", localNumber: "L09" } },
  { id: "19", name: "Lidherma", logoUrl: "/Lidherma.png", category: { id: "c3", name: "Belleza", slug: "belleza" }, location: { id: "l19", floor: "1er Subsuelo", localNumber: "S105" } },
  { id: "20", name: "Optical World", logoUrl: "/Optical-World.png", category: { id: "c6", name: "Accesorios", slug: "accesorios" }, location: { id: "l20", floor: "Piso 1", localNumber: "L108" } },
  { id: "21", name: "Perramus", logoUrl: "/PERRAMUS.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l21", floor: "PB", localNumber: "L04" } },
  { id: "22", name: "Rouge", logoUrl: "/ROuge-300x300.png", category: { id: "c3", name: "Belleza", slug: "belleza" }, location: { id: "l22", floor: "PB", localNumber: "L11" } },
  { id: "23", name: "Sacoa", logoUrl: "/sacoa-logo-black-and-white.png", category: { id: "c10", name: "Entretenimiento", slug: "entretenimiento" }, location: { id: "l23", floor: "1er Subsuelo", localNumber: "S102" } },
  { id: "24", name: "Simmons", logoUrl: "/simmons-1-logo-png-transparent.png", category: { id: "c11", name: "Hogar", slug: "hogar" }, location: { id: "l24", floor: "1er Subsuelo", localNumber: "S104" } },
  { id: "25", name: "Tea Connection", logoUrl: "/TEA-CONNECTION.png", category: { id: "c2", name: "Gastronomía", slug: "gastronomia" }, location: { id: "l25", floor: "Piso 1", localNumber: "L106" } },
  { id: "26", name: "Vilebrequin", logoUrl: "/vilebrequin.png", category: { id: "c1", name: "Moda", slug: "moda" }, location: { id: "l26", floor: "Piso 1", localNumber: "L107" } },
];
const CURATED_BRANDS = [MOCK_BRANDS[0], MOCK_BRANDS[1], MOCK_BRANDS[2]];

export const CatalogGrid = () => {
  usePersistentFilters();
  const { searchQuery, category } = useCatalogStore();
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  
  const { data: dbBrands, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const brands = dbBrands && dbBrands.length > 0 ? dbBrands : MOCK_BRANDS;

  const filteredBrands = brands.filter((brand: Brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || 
      (brand.category && brand.category.slug.toLowerCase() === category.toLowerCase()) ||
      (brand.categories && brand.categories.some(c => c.slug.toLowerCase() === category.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-celeste-oh rounded-full animate-spin mb-4" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-onyx/40">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <PerformanceWrapper>
      <div className="space-y-12">
        <FilterBar />

        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-sm uppercase tracking-[0.3em] text-onyx/40 font-sans font-semibold">
              Explorando {category !== "all" ? category : "Marcas"}
            </h2>
            <span className="text-[10px] text-onyx/20 uppercase tracking-widest">
              {filteredBrands.length} resultados encontrados
            </span>
          </div>

          {filteredBrands.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredBrands.map((brand: Brand, index: number) => (
                <FlipCardOptimized 
                  key={brand.id} 
                  brand={brand} 
                  priority={index < 4} // LCP Optimization for first row
                  isFlipped={flippedCardId === brand.id}
                  onFlip={() => setFlippedCardId(flippedCardId === brand.id ? null : brand.id)}
                />
              ))}
            </motion.div>
          ) : (
            <CuratedSelection curatedItems={CURATED_BRANDS} />
          )}
        </section>
      </div>
    </PerformanceWrapper>
  );
};
