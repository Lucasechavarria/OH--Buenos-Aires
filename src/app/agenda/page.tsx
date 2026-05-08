"use client";

import Header from "@/src/features/catalog/components/Header";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import ContactSection from "@/src/components/ContactSection";

const EVENTS = [
  {
    id: "1",
    title: "After Office Luxury: Jazz & Cocktails",
    date: "15 MAY",
    time: "19:00 HS",
    location: "Rooftop Piso 3",
    image: "https://images.unsplash.com/photo-1514525253361-bee8a187499b?auto=format&fit=crop&q=80&w=1000",
    category: "Música & Bebidas"
  },
  {
    id: "2",
    title: "Workshop: Tendencias Invierno 2026",
    date: "22 MAY",
    time: "17:00 HS",
    location: "Main Hall",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000",
    category: "Moda"
  },
  {
    id: "3",
    title: "Degustación: Vinos de Altura",
    date: "05 JUN",
    time: "20:00 HS",
    location: "The Wine Cellar",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1000",
    category: "Gastronomía"
  }
];

export default function AgendaPage() {
  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Sección Agenda */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-onyx/10 pb-16">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-celeste-oh mb-6 animate-pulse">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Experiencias Exclusivas</span>
              </div>
              <h1 className="text-4xl md:text-8xl font-serif text-onyx mb-8 leading-tight">
                Agenda <br />
                <span className="text-celeste-oh italic">OH! Experience</span>
              </h1>
              <p className="text-onyx/60 text-lg md:text-xl font-medium leading-relaxed font-sans max-w-xl">
                Descubrí los eventos más exclusivos de Buenos Aires. Una selección curada de momentos diseñados para inspirarte.
              </p>
            </div>
            
            <div className="hidden lg:block text-right">
              <div className="text-9xl font-serif text-onyx/5 select-none leading-none">2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {EVENTS.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-4 text-white">
                      <div className="text-center">
                        <span className="block text-2xl font-serif leading-none">{event.date.split(' ')[0]}</span>
                        <span className="block text-[8px] font-bold uppercase tracking-tighter opacity-60">{event.date.split(' ')[1]}</span>
                      </div>
                      <div className="h-8 w-[1px] bg-white/20" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{event.time}</p>
                        <p className="text-[10px] opacity-60 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors">
                  {event.title}
                </h3>
                <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-celeste-oh transition-all">
                  <span>Ver detalles del evento</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-24 p-12 rounded-3xl bg-onyx text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
             <h4 className="text-3xl font-serif text-white mb-6 relative z-10">¿Querés organizar tu evento aquí?</h4>
             <p className="text-alabaster/40 max-w-xl mx-auto mb-10 relative z-10">
               Contamos con espacios exclusivos y una curaduría integral para que tu marca o celebración personal sea inolvidable.
             </p>
             <button className="px-10 py-5 bg-white text-onyx text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-celeste-oh hover:text-white transition-all relative z-10">
               Contactar al Concierge
             </button>
          </div>
        </div>
      </section>

      <ContactSection />
      
      <footer className="py-10 px-6 border-t border-onyx/5 text-center">
        <p className="text-onyx/40 text-[9px] font-bold uppercase tracking-[0.2em]">
          © 2026 OH! BUENOS AIRES EXPERIENCE. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </main>
  );
}
