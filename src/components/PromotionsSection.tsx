
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Ticket, ExternalLink, Clock } from "lucide-react";
import { Brand, Promotion } from "@/src/lib/domain/entities";
import { generateCouponPDF } from "@/src/features/catalog/services/couponService";
import { useState } from "react";

const fetchActivePromotions = async (): Promise<Promotion[]> => {
  const response = await fetch("/api/v1/promotions/active");
  if (!response.ok) throw new Error("Failed to fetch promotions");
  return response.json();
};

export default function PromotionsSection() {
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["active-promotions"],
    queryFn: fetchActivePromotions,
    staleTime: 1000 * 60 * 5,
  });

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleDownload = async (promo: Promotion) => {
    if (!promo.brand || generatingId) return;
    
    setGeneratingId(promo.id);
    try {
      // Re-estructuramos el objeto brand para el servicio
      const brandObj: Brand = {
        id: promo.brandId,
        name: promo.brand.name,
        logoUrl: promo.brand.logoUrl,
      };
      await generateCouponPDF(brandObj, promo);
    } catch (err) {
      alert("Error al generar el cupón.");
    } finally {
      setGeneratingId(null);
    }
  };

  if (isLoading) return null; // O un skeleton decorativo
  if (!promotions || promotions.length === 0) return null;

  return (
    <section id="beneficios" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Elementos Decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-heritage/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-heritage/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.5em] text-gold-heritage font-bold mb-4 block"
          >
            Beneficios Exclusivos
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            Promociones del Mes
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 bg-gold-heritage mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-onyx/40 backdrop-blur-md rounded-3xl p-8 border border-gold-heritage/10 shadow-sm hover:shadow-2xl hover:border-gold-heritage/30 transition-all duration-500 flex flex-col justify-between h-full relative"
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-alabaster p-3 flex items-center justify-center border border-onyx/5 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
                    {promo.brand?.logoUrl ? (
                      <img src={promo.brand.logoUrl} alt={promo.brand.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="text-gold-heritage font-serif font-bold text-xl">{promo.brand?.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="p-2 rounded-full bg-gold-heritage/10 text-gold-heritage group-hover:bg-gold-heritage group-hover:text-white transition-colors duration-500">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-gold-heritage text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
                  {promo.brand?.name}
                </h3>
                <h4 className="text-2xl font-serif text-white group-hover:text-gold-heritage transition-colors duration-500">
                  {promo.title}
                </h4>
                <p className="text-alabaster/60 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                  {promo.description}
                </p>
              </div>

              <div className="mt-auto space-y-6">
                {promo.validUntil && (
                  <div className="flex items-center gap-2 text-[10px] text-onyx/40 font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Vence: {new Date(promo.validUntil).toLocaleDateString()}</span>
                  </div>
                )}
                
                <button
                  onClick={() => handleDownload(promo)}
                  disabled={generatingId === promo.id}
                  className="w-full h-14 rounded-2xl bg-gold-metallic text-background text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 group/btn"
                >
                  <Ticket className={`w-4 h-4 ${generatingId === promo.id ? 'animate-spin' : 'group-hover/btn:rotate-12 transition-transform'}`} />
                  {generatingId === promo.id ? "Generando..." : "Descargar Cupón"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
