"use client";

import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function BannersSlider() {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return (
    <div className="w-full bg-onyx py-20 px-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        {[1,2,3].map(i => <div key={i} className="min-w-[500px] h-[350px] bg-white/5 rounded-[2.5rem] animate-pulse" />)}
      </div>
    </div>
  );

  if (banners.length === 0) return null;

  return (
    <section className="w-full bg-onyx py-20 px-6 overflow-hidden border-t border-celeste-oh/10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-celeste-oh text-[10px] uppercase tracking-[0.5em] font-bold mb-3">Exclusivo</h3>
            <h2 className="text-4xl font-serif text-white">Novedades & Eventos</h2>
          </div>
          <div className="hidden md:block h-[1px] flex-1 bg-celeste-oh/10 mx-10 mb-4" />
        </header>

        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-10 scrollbar-hide">
          {banners.map((banner: any) => (
            <motion.a 
              key={banner.id} 
              href={banner.link_url || '#'} 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative min-w-[80vw] md:min-w-[500px] h-[250px] md:h-[350px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden snap-center group shadow-xl flex-shrink-0 border border-white/5 block"
            >
              <img 
                src={banner.image_url} 
                alt={banner.title} 
                className="w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-white font-serif text-2xl md:text-3xl mb-3 drop-shadow-xl leading-tight uppercase tracking-tight">
                    {banner.title}
                  </h4>
                  {banner.link_url && (
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-celeste-oh border-b border-celeste-oh/30 pb-1 group-hover:opacity-80 group-hover:border-celeste-oh transition-all">
                      Descubrir más
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
