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

export default function InstagramFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("instagram_posts")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true })
        .limit(6);
      
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.length > 0 ? posts.map((img, idx) => (
            <motion.a
              key={img.id}
              href={img.link_url || "https://www.instagram.com/oh_buenosaires"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xl"
            >
              <img 
                src={img.image_url} 
                alt="Instagram feed" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-celeste-oh/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <InstagramIcon className="h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500" />
              </div>
            </motion.a>
          )) : !loading && (
            <div className="col-span-full text-center py-10 text-onyx/20 italic">No hay posts para mostrar</div>
          )}
        </div>
      </div>
    </section>
  );
}
