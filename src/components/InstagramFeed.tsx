"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

import { InstagramIcon } from "@/src/components/Icons";

export default function InstagramFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("instagram_posts")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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
            className="px-8 py-3 rounded-full border border-onyx/10 text-[10px] font-bold uppercase tracking-widest text-onyx hover:bg-onyx hover:text-white transition-all duration-500"
          >
            Ver Perfil Completo
          </a>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative group overflow-hidden">
        <div className="flex gap-6 animate-marquee group-hover:pause">
          {loading ? (
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
                className="flex-shrink-0 w-64 md:w-72 aspect-square rounded-[32px] overflow-hidden group/item shadow-xl relative border border-onyx/5"
              >
                <img 
                  src={img.image_url} 
                  alt="Instagram feed" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
                
                {/* Badge - Instagram Icon with Liquid Fill */}
                {img.type === 'reel' && (
                  <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/30 shadow-lg transition-all duration-500">
                    <InstagramIcon className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                    <InstagramIcon className="h-8 w-8 text-white" />
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
          .group-hover\:pause:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
}
