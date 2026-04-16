
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

const LATEST_NEWS = [
  {
    id: "gastronomia-gourmet",
    title: "Un Viaje Sensorial: Propuesta Gastronómica",
    date: "15 ABRE 2026",
    category: "GASTRONOMÍA",
    image: "/img2-300x200.png"
  }
];

export default function LatestNewsSnippet() {
  return (
    <section id="news" className="py-24 px-6 bg-background border-y border-onyx/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-heritage mb-4 block">Novedades</span>
             <h2 className="text-4xl md:text-5xl font-serif text-onyx leading-tight">Oh! News</h2>
          </div>
          <Link href="/news" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-onyx hover:text-gold-heritage transition-all mb-2">
             Ver Todas las Noticias
             <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {LATEST_NEWS.map((news) => (
            <Link key={news.id} href="/news" className="group relative overflow-hidden rounded-3xl block shadow-xl border border-onyx/5">
               <div className="h-80 w-full overflow-hidden">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-80" />
               <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest mb-4">
                     <span className="px-2 py-1 bg-gold-heritage text-onyx rounded-sm">{news.category}</span>
                     <span>{news.date}</span>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-gold-heritage transition-colors">{news.title}</h3>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                     Continuar leyendo
                     <ArrowRight className="w-3 h-3" />
                  </div>
               </div>
            </Link>
          ))}
          
          <div className="space-y-8 pl-0 md:pl-10">
             <p className="text-onyx/60 text-lg leading-relaxed font-medium italic">
                "Oh! Buenos Aires no es solo un destino de compras; es una narrativa en constante evolución sobre el buen vivir en el corazón de Recoleta."
             </p>
             <div className="flex gap-4">
                <div className="h-1 w-12 bg-gold-heritage" />
                <div className="h-1 w-4 bg-onyx/10" />
                <div className="h-1 w-4 bg-onyx/10" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
