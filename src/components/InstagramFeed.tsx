"use client";

import { motion } from "framer-motion";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { useQuery } from "@tanstack/react-query";

import { InstagramIcon } from "@/src/components/Icons";

export default function InstagramFeed() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instagram_posts")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 15, // Instagram feed doesn't change often
  });

  return (
    <section className="py-24 px-6 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-accent flex items-center justify-center shadow-lg group">
              <InstagramIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-onyx">@oh_buenosaires</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-onyx/40">Seguinos en Instagram</p>
            </div>
          </div>
          <a 
            href="https://www.instagram.com/oh_buenosaires" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 btn-liquid"
          >
            Ver Perfil Completo
          </a>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative group overflow-hidden">
        <div className="flex gap-6 animate-marquee group-hover:pause">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72 aspect-square rounded-3xl bg-onyx/5 animate-pulse" />
            ))
          ) : posts.length > 0 ? (
            // Duplicate posts to create a seamless loop
            [...posts, ...posts, ...posts].map((img, idx) => (
              <motion.a
                key={`${img.id}-${idx}`}
                href={img.link_url || "https://www.instagram.com/oh_buenosaires"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.05, 1] }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="flex-shrink-0 w-64 md:w-72 aspect-square rounded-[32px] overflow-hidden group shadow-xl relative border border-onyx/5"
              >
                <img 
                   src={img.image_url} 
                   alt="Instagram feed" 
                   referrerPolicy="no-referrer"
                   className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                />
                
                {/* Badge - Always visible Instagram Logo with brand colors */}
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg z-20 group-hover:scale-110 transition-transform">
                  <InstagramIcon className="w-4 h-4" mode="static" />
                </div>

                {/* Overlay - Visible on Hover (Desktop) or subtly on mobile when in view */}
                <div className="absolute inset-0 bg-onyx/20 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none md:pointer-events-auto">
                  <div className="p-4 bg-white/90 rounded-full shadow-2xl transform translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                    <InstagramIcon className="h-8 w-8" mode="hover" />
                  </div>
                </div>
              </motion.a>
            ))
          ) : (
            <div className="w-full text-center py-10 text-onyx/20 italic">No hay posts para mostrar</div>
          )}
        </div>

        {/* Gradient Fades for edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-33.33% - 1rem)); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }
          
          .group-hover\:pause:hover,
          .group-hover\:pause:active {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}
