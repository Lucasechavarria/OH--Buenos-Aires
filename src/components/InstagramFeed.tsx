"use client";

import { motion } from "framer-motion";
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
  </svg>
);

const FEED_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600" },
  { id: 2, url: "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&q=80&w=600" },
  { id: 3, url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600" },
  { id: 4, url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" },
  { id: 5, url: "https://images.unsplash.com/photo-1566150905458-1bf1fd11396c?auto=format&fit=crop&q=80&w=600" },
  { id: 6, url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" },
];

export default function InstagramFeed() {
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
          {FEED_IMAGES.map((img, idx) => (
            <motion.a
              key={img.id}
              href="https://www.instagram.com/oh_buenosaires"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-xl"
            >
              <img 
                src={img.url} 
                alt={`Instagram feed ${img.id}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-celeste-oh/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <InstagramIcon className="h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
