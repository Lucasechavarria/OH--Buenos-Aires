"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

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
            <div className="h-12 w-12 rounded-full bg-brand-accent flex items-center justify-center shadow-lg">
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

      {/* Carousel Container */}
      <div className="relative group px-4">
        <div 
          id="instagram-carousel"
          className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth"
        >
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-72 aspect-square rounded-3xl bg-onyx/5 animate-pulse" />
            ))
          ) : posts.length > 0 ? posts.map((img, idx) => (
            <motion.a
              key={img.id}
              href={img.link_url || "https://www.instagram.com/oh_buenosaires"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-64 md:w-72 aspect-square rounded-[32px] overflow-hidden group/item shadow-xl snap-center relative border border-onyx/5"
            >
              <img 
                src={img.image_url} 
                alt="Instagram feed" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
              />
              
              {/* Badge - Consistent with user preference (Instagram Icon for Reels) */}
              {img.type === 'reel' && (
                <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/30 shadow-lg group-hover/item:bg-pink-500 transition-colors duration-500">
                  <InstagramIcon className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                  <InstagramIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.a>
          )) : (
            <div className="w-full text-center py-10 text-onyx/20 italic">No hay posts para mostrar</div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => document.getElementById('instagram-carousel')?.scrollBy({ left: -300, behavior: 'smooth' })}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border border-onyx/5 shadow-xl flex items-center justify-center text-onyx opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 -translate-x-6 group-hover:translate-x-2"
        >
          <span className="text-xl leading-none">&larr;</span>
        </button>
        <button 
          onClick={() => document.getElementById('instagram-carousel')?.scrollBy({ left: 300, behavior: 'smooth' })}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border border-onyx/5 shadow-xl flex items-center justify-center text-onyx opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 translate-x-6 group-hover:-translate-x-2"
        >
          <span className="text-xl leading-none">&rarr;</span>
        </button>

        {/* Custom Styles for horizontal scroll */}
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}
