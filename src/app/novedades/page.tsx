"use client";

import { useEffect, useState } from "react";
import Header from "@/src/features/catalog/components/Header";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Newspaper, CalendarDays, ImageIcon, X, ChevronLeft, Star, Utensils, Smartphone } from "lucide-react";
import Link from "next/link";
import ContactSection from "@/src/components/ContactSection";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string; 
  image_url: string;
  category: string;
  date: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  event_date: string;
  event_time: string;
  location: string;
}

export default function NovedadesPage() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [newsRes, eventsRes] = await Promise.all([
        supabase.from("news").select("*").eq("active", true).order("date", { ascending: false }),
        supabase.from("events").select("*").eq("active", true).order("event_date", { ascending: true })
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 bg-onyx overflow-hidden">
        <div className="absolute inset-0 opacity-20 ornament-bg mix-blend-overlay" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center md:text-left"
          >
             <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-12">
               <div>
                 <span className="text-celeste-oh text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Lifestyle & Events</span>
                 <h1 className="text-5xl md:text-8xl font-serif text-white leading-tight">
                   Novedades <br />
                   <span className="text-celeste-oh italic font-light">& Experiencias</span>
                 </h1>
               </div>
               <div className="hidden lg:block text-right pb-4">
                 <div className="text-9xl font-serif text-white/5 select-none leading-none">2026</div>
               </div>
             </div>
            <p className="max-w-2xl text-alabaster/60 text-lg md:text-xl font-medium font-sans italic mb-4">
              Mantenete al tanto de las últimas tendencias, aperturas y eventos exclusivos en OH! Buenos Aires.
            </p>
          </motion.div>
        </div>
        
        {/* Scroll Indicator Accent */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-60 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celeste-oh"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-onyx/40">Cargando la experiencia...</p>
        </div>
      ) : (
        <>
          {/* Oh! News Section */}
          <section id="news" className="py-32 px-6 lg:px-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-6 mb-16">
                <h2 className="text-4xl md:text-6xl font-serif text-onyx">Oh! News</h2>
                <div className="h-[1px] flex-grow bg-onyx/10 mt-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/30 mt-4">Actualidad</span>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                {news.length > 0 ? news.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => setSelectedNews(item)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-onyx flex items-center justify-center"><ImageIcon className="text-white/10 w-12 h-12"/></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-bold uppercase tracking-widest text-white">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-[9px] font-bold text-celeste-oh uppercase tracking-[0.2em] mb-3">
                      {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-2xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors duration-500">{item.title}</h3>
                    <p className="text-onyx/60 text-sm leading-relaxed mb-6 line-clamp-2">{item.excerpt}</p>
                    <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-celeste-oh transition-all">
                      <span>Leer artículo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-20 text-onyx/20 font-serif italic text-2xl">No hay noticias disponibles en este momento.</div>
                )}
              </motion.div>
            </div>
          </section>

          {/* Agenda Section */}
          <section id="agenda" className="py-32 px-6 lg:px-24 bg-white/40 border-y border-onyx/5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-6 mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/30 mt-4">Agenda</span>
                <div className="h-[1px] flex-grow bg-onyx/10 mt-4" />
                <h2 className="text-4xl md:text-6xl font-serif text-onyx">OH! Experience</h2>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              >
                {events.length > 0 ? events.map((event) => (
                  <motion.div 
                    key={event.id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-onyx flex items-center justify-center"><ImageIcon className="text-white/10 w-12 h-12"/></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute top-6 left-6">
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                          {event.category}
                        </div>
                      </div>
                      
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-4 text-white">
                          <div className="text-center">
                            <span className="block text-2xl font-serif leading-none">{event.event_date.split('-')[2]}</span>
                            <span className="block text-[8px] font-bold uppercase tracking-tighter opacity-60">
                              {new Date(event.event_date).toLocaleString('es-AR', { month: 'short' }).toUpperCase()}
                            </span>
                          </div>
                          <div className="h-8 w-[1px] bg-white/20" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{event.event_time}</p>
                            <p className="text-[10px] opacity-60 flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors duration-500">{event.title}</h3>
                    <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-celeste-oh transition-all">
                      <span>Ver detalles</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-20 text-onyx/20 font-serif italic text-2xl">Próximamente más eventos exclusivos.</div>
                )}
              </motion.div>

              {/* Agenda CTA Integration */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mt-32 p-12 md:p-20 rounded-[3rem] bg-onyx text-center relative overflow-hidden group shadow-3xl"
              >
                 <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                 <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <div className="p-4 rounded-full bg-white/5 border border-white/10">
                        <Sparkles className="w-8 h-8 text-celeste-oh" />
                      </div>
                    </div>
                    <h4 className="text-4xl md:text-5xl font-serif text-white mb-6">¿Querés organizar tu evento aquí?</h4>
                    <p className="text-alabaster/40 text-lg md:text-xl font-sans italic max-w-2xl mx-auto mb-12">
                      Contamos con espacios exclusivos y una curaduría integral para que tu marca o celebración personal sea inolvidable en el corazón de Recoleta.
                    </p>
                    <button className="h-16 px-12 bg-white text-onyx text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-celeste-oh hover:text-white hover:scale-105 transition-all duration-500 shadow-xl">
                      Contactar al Concierge
                    </button>
                 </div>
                 
                 {/* Decorative background elements */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-celeste-oh/5 blur-[100px] -mr-32 -mt-32" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -ml-32 -mb-32" />
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* Modal - Reader Experience */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 bg-onyx/90 backdrop-blur-xl"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-8 right-8 z-20 p-4 bg-onyx text-white rounded-full hover:bg-brand-accent transition-all duration-500 shadow-2xl hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-[30rem] w-full relative">
                 {selectedNews.image_url ? (
                   <img src={selectedNews.image_url} alt={selectedNews.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-onyx flex items-center justify-center text-white/10">
                     <ImageIcon className="w-20 h-20" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              </div>

              <div className="p-8 md:p-20 -mt-24 relative bg-white rounded-t-[4rem]">
                <div className="flex items-center gap-4 text-[11px] text-celeste-oh font-bold uppercase tracking-[0.4em] mb-8">
                   <div className="p-2.5 rounded-full bg-celeste-oh/10"><Star className="w-4 h-4" /></div>
                   <span>{selectedNews.category} • {new Date(selectedNews.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-serif text-onyx mb-12 leading-[1.05] tracking-tight">
                  {selectedNews.title}
                </h2>

                <div 
                  className="prose prose-onyx max-w-none text-onyx/70 text-xl leading-relaxed space-y-8 font-medium font-sans"
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />

                <div className="mt-24 pt-12 border-t border-onyx/5 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-celeste-oh animate-pulse" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-onyx/40">Exclusivo OH! Buenos Aires</p>
                   </div>
                   <button onClick={() => setSelectedNews(null)} className="h-16 px-12 flex items-center justify-center bg-onyx text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:bg-brand-accent transition-all duration-500 shadow-xl">
                      Cerrar Lectura
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactSection />
    </main>
  );
}
