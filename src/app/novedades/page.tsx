"use client";

import { useEffect, useState } from "react";
import Header from "@/src/features/catalog/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Newspaper, CalendarDays, ImageIcon, X, ChevronLeft, Star, Utensils, Smartphone } from "lucide-react";
import Link from "next/link";
import ContactSection from "@/src/components/ContactSection";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Añadido para el lector modal
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
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null); // Estado para el modal
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

  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-onyx overflow-hidden">
        <div className="absolute inset-0 opacity-20 ornament-bg mix-blend-overlay" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8">
              Novedades <br />
              <span className="text-celeste-oh italic font-light">& Experiencias</span>
            </h1>
            <p className="max-w-2xl mx-auto text-alabaster/60 text-lg md:text-xl font-medium font-sans italic mb-12">
              Mantenete al tanto de las últimas tendencias, aperturas y eventos exclusivos en OH! Buenos Aires.
            </p>

            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setActiveTab("news")}
                className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                  activeTab === "news" 
                    ? "bg-celeste-oh text-onyx shadow-lg shadow-celeste-oh/20" 
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                <Newspaper className="w-4 h-4" />
                Noticias
              </button>
              <button 
                onClick={() => setActiveTab("events")}
                className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                  activeTab === "events" 
                    ? "bg-celeste-oh text-onyx shadow-lg shadow-celeste-oh/20" 
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Agenda de Eventos
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celeste-oh"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-onyx/40">Cargando experiencias...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "news" ? (
                <motion.div 
                  key="news-grid"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                >
                  {news.length > 0 ? news.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-onyx flex items-center justify-center"><ImageIcon className="text-white/10 w-12 h-12"/></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-onyx/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-6 left-6">
                          <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-bold uppercase tracking-widest text-white">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-celeste-oh uppercase tracking-[0.2em] mb-3">
                        {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                      <h3 className="text-2xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors">{item.title}</h3>
                      <p className="text-onyx/60 text-sm leading-relaxed mb-6 line-clamp-2">{item.excerpt}</p>
                      <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-celeste-oh transition-all">
                        <span>Leer artículo</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </button>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-20 text-onyx/20 font-serif italic text-2xl">No hay noticias disponibles.</div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="events-grid"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                >
                  {events.length > 0 ? events.map((event, index) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-onyx flex items-center justify-center"><ImageIcon className="text-white/10 w-12 h-12"/></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
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
                      <h3 className="text-2xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors">{event.title}</h3>
                      <button className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-celeste-oh transition-all">
                        <span>Ver detalles</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </button>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-20 text-onyx/20 font-serif italic text-2xl">No hay eventos programados.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Modal - Reader Experience (Importado de /news) */}
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
              className="bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-onyx text-white rounded-full hover:bg-brand-accent transition-colors shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-96 w-full relative">
                 {selectedNews.image_url ? (
                   <img src={selectedNews.image_url} alt={selectedNews.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-onyx flex items-center justify-center text-white/10">
                     <ImageIcon className="w-20 h-20" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              <div className="p-8 md:p-16 -mt-20 relative bg-white rounded-t-[3rem]">
                <div className="flex items-center gap-3 text-[11px] text-celeste-oh font-bold uppercase tracking-[0.3em] mb-6">
                   <div className="p-2 rounded-full bg-celeste-oh/10"><Star className="w-4 h-4" /></div>
                   <span>{selectedNews.category} • {new Date(selectedNews.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-serif text-onyx mb-10 leading-[1.1]">
                  {selectedNews.title}
                </h2>

                <div 
                  className="prose prose-onyx max-w-none text-onyx/70 text-lg leading-relaxed space-y-6 font-medium"
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />

                <div className="mt-16 pt-10 border-t border-onyx/5 flex flex-col md:flex-row items-center justify-between gap-6">
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/40">Visítanos en Oh! Buenos Aires</p>
                   <button onClick={() => setSelectedNews(null)} className="h-14 px-10 flex items-center justify-center bg-brand-accent text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:opacity-90 transition-all">
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
