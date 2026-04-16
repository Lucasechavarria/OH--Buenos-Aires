"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Info } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useMapRedirect } from "../../hooks/useMapRedirect";
import { Brand } from "@/src/lib/domain/entities";

interface FlipCardProps {
  brand: Brand;
}

export const FlipCard = ({ brand }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { redirectToMaps } = useMapRedirect();

  const handleFlip = () => setIsFlipped(!isFlipped);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className="group h-[380px] w-full perspective-1000 cursor-pointer outline-none"
      onClick={handleFlip}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`Ver información de ${brand.name}`}
    >
      <motion.div
        className="relative h-full w-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Lado Frontal (Lado A) */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-brand-surface border border-midnight-blue/5 shadow-sm overflow-hidden backface-hidden flex flex-col items-center justify-center p-8 transition-colors group-hover:bg-white">
          <div className="relative h-28 w-44 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <h3 className="mt-8 text-xl font-serif text-midnight-blue tracking-tight">
            {brand.name}
          </h3>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-midnight-blue/40 font-bold">
            {brand.category?.name}
          </p>
          
          <div className="absolute bottom-6 flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
            <div className="h-1 w-1 rounded-full bg-gold-leaf" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Ver Beneficios</span>
          </div>
        </div>

        {/* Lado Posterior (Lado B) */}
        <div className="absolute inset-0 h-full w-full rounded-2xl bg-midnight-blue p-8 backface-hidden rotate-y-180 flex flex-col justify-between text-brand-surface shadow-xl">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-serif text-gold-leaf">{brand.name}</h3>
              <Info className="h-4 w-4 text-gold-leaf/40" />
            </div>
            
            <div className="space-y-4">
              {brand.activePromotions?.map((promo) => (
                <div key={promo.id} className="p-4 rounded-xl bg-brand-surface/5 border border-brand-surface/10">
                  <p className="text-sm font-bold tracking-wide text-gold-leaf mb-1">
                    PROMOCIÓN EXCLUSIVA
                  </p>
                  <p className="text-xs font-light leading-relaxed opacity-80">
                    {promo.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs opacity-70">
                <MapPin className="h-3.5 w-3.5 text-gold-leaf" />
                <span>{brand.location?.floor} • Local {brand.location?.localNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-xs opacity-70">
                <Phone className="h-3.5 w-3.5 text-gold-leaf" />
                <span>{brand.phone}</span>
              </div>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                redirectToMaps({ label: `Oh! Buenos Aires ${brand.name}` });
              }}
              className="w-full h-12 text-[10px]"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Visitar Local
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
