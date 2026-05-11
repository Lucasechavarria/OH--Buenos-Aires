
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Clock, Ticket } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Brand } from "@/src/lib/domain/entities";
import { generateCouponPDF } from "../../services/couponService";

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

interface FlipCardProps {
  brand: Brand;
  priority?: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}

export const FlipCardOptimized = ({ brand, priority = false, isFlipped, onFlip }: FlipCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFlip();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  };

  const handleDownloadCoupon = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const activePromo = brand.activePromotions?.[0];
      if (activePromo) {
        await generateCouponPDF(brand, activePromo);
      }
    } catch (err) {
      console.error(err);
      alert("Error al generar el cupón. Intente nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="group h-[400px] w-full perspective-1000 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-celeste-oh/30 rounded-2xl relative"
      onClick={handleFlip}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`Local ${brand.name}. Pulsa para más información.`}
    >
      <div className="absolute inset-0 bg-celeste-oh/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms] pointer-events-none rounded-[3rem] translate-y-6 scale-90 z-0" />

      <motion.div
        className="relative h-full w-full preserve-3d z-10"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={shouldReduceMotion ? {} : { y: -8 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="absolute inset-0 h-full w-full rounded-2xl border border-celeste-oh/30 bg-white shadow-sm overflow-hidden backface-hidden flex flex-col items-center justify-between p-8 transition-all duration-700 group-hover:border-celeste-oh group-hover:shadow-[0_25px_50px_-12px_rgba(100,180,200,0.25)] group-hover:ring-1 group-hover:ring-celeste-oh/50">
          <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden rounded-2xl z-20">
            <div className="absolute top-0 -left-full h-full w-[200%] skew-x-[-30deg] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-transform duration-[3000ms] ease-out group-hover:translate-x-[150%] group-hover:opacity-90 mix-blend-overlay blur-[2px]" />
          </div>

          <div className="flex-none"></div>

          <div className="relative w-full flex-1 flex items-center justify-center px-4">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={`Logo de ${brand.name}`}
                className={`max-h-56 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 
                  ${brand.name.toLowerCase().includes('stella') || brand.name.toLowerCase().includes('smart') ? 'scale-[1.45]' : ''} 
                  ${brand.name.toLowerCase().includes('smart') || brand.name.toLowerCase().includes('natura') ? 'drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : ''}`}
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 text-5xl font-serif">
                {brand.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-none pb-2 text-center w-full border-t border-celeste-oh/10 pt-4 mt-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-celeste-oh font-bold font-sans [text-shadow:_0_0.5px_0.5px_rgba(0,0,0,0.1)]">
              {brand.category?.name || "Local"}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 h-full w-full rounded-2xl bg-onyx p-8 backface-hidden rotate-y-180 flex flex-col justify-between text-alabaster shadow-2xl border border-celeste-oh/30">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-serif text-celeste-oh mb-2">{brand.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-alabaster/60 font-sans tracking-widest uppercase">
                  <MapPin className="h-3 w-3 text-celeste-oh/70" />
                  <span>PISO {brand.location?.floor} • LOCAL {brand.location?.localNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-[10px] text-alabaster/80 tracking-widest font-sans uppercase">
                 <Clock className="h-3.5 w-3.5 text-celeste-oh" />
                 <span>LUN - DOM | 10:00 A 22:00</span>
              </div>
              
              {/* Información de la promoción actual */}
              {brand.activePromotions?.[0] && (
                <div className="mt-4 p-3 rounded-xl bg-celeste-oh/5 border border-celeste-oh/20">
                  <p className="text-xs font-bold text-celeste-oh uppercase tracking-wider mb-1 line-clamp-1">
                    {brand.activePromotions[0].title}
                  </p>
                  {brand.activePromotions[0].validUntil && (
                    <p className="text-[9px] text-alabaster/40 uppercase tracking-widest" suppressHydrationWarning>
                      Válido hasta: {new Date(brand.activePromotions[0].validUntil).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href={`https://wa.me/5491100000000?text=Hola!%20Me%20contacto%20desde%20Oh!%20Buenos%20Aires%20para%20consultar%20por%20${brand.name}`}
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/30 rounded-xl"
            >
              <WhatsappIcon />
              <span className="font-sans tracking-[0.2em] text-[9px] uppercase font-bold">Asesor por WhatsApp</span>
            </a>

            {brand.activePromotions && brand.activePromotions.length > 0 && (
              <Button
                className="w-full h-12 bg-brand-accent hover:scale-105 transition-transform text-white font-bold tracking-[0.3em] text-[10px] uppercase border-none font-sans flex items-center justify-center cursor-pointer disabled:opacity-50"
                onClick={handleDownloadCoupon}
                disabled={isGenerating}
              >
                <div className="flex items-center justify-center">
                  <Ticket className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? "Generando..." : "Obtener Cupones"}
                </div>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
