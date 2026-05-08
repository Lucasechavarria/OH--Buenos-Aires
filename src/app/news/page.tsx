
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/src/features/catalog/components/Header";
import ContactSection from "@/src/components/ContactSection";
import { ChevronLeft, X, Calendar, ArrowRight, Utensils, Star, Smartphone } from "lucide-react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  icon: React.ReactNode;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "marcas-lujo",
    title: "Confirmado: Nuevas Firmas de Lujo se Unen a Oh!",
    excerpt: "Las casas de moda más prestigiosas del mundo eligen Recoleta para sus nuevas tiendas flagship.",
    content: `
      <p>Nos enorgullece anunciar que Oh! Buenos Aires ha sido seleccionado como el hogar exclusivo de nuevas marcas internacionales de primer nivel. Estas confirmaciones consolidan nuestro compromiso de ofrecer una experiencia de retail sin precedentes en Argentina.</p>
      <p>Las nuevas boutiques no solo traerán sus últimas colecciones, sino que también presentarán diseños arquitectónicos únicos que respetan el espíritu de nuestro icónico edificio en Recoleta. Desde alta costura hasta joyería fina, la selección ha sido curada para satisfacer los gustos más sofisticados.</p>
      <p>Prepárate para redescubrir el lujo. Muy pronto revelaremos los nombres de las casas que cambiarán el panorama de la moda en la ciudad.</p>
    `,
    date: "18 ABRE 2026",
    image: "/happy-woman-shopping-bag-retail-fashion-package-as-customer-commerce-luxury-products-with-discount-sale-smile-friends-clothes-spending-money-client-commercial-goods-store-768x461.jpg",
    category: "RETAIL DE ALTO NIVEL",
    icon: <Star className="w-4 h-4" />
  },
  {
    id: "gastronomia-gourmet",
    title: "Un Viaje Sensorial: Nuestra Nueva Propuesta Gastronómica",
    excerpt: "Sabores internacionales y ambientes de ensueño te esperan en nuestro nuevo polo gourmet.",
    content: `
      <p>La gastronomía en Oh! Buenos Aires evoluciona. Estamos diseñando un espacio donde cada comida es una celebración de los sentidos. Desde bistrós franceses hasta sushi de autor, la variedad será el sello distintivo de nuestra propuesta.</p>
      <p>Nuestras terrazas y jardines de invierno ofrecerán el entorno perfecto para almuerzos de negocios, meriendas entre amigas o cenas románticas bajo las estrellas de Recoleta. La curaduría de chefs locales e internacionales asegura una calidad excepcional en cada plato.</p>
      <p>Te esperamos para vivir momentos inolvidables donde el buen comer se encuentra con el diseño de vanguardia.</p>
    `,
    date: "15 ABRE 2026",
    image: "/img2-300x200.png",
    category: "GASTRONOMÍA",
    icon: <Utensils className="w-4 h-4" />
  },
  {
    id: "sistema-beneficios",
    title: "Beneficios Oh!: Exclusividad en tu Smartphone",
    excerpt: "Lanzamos nuestro sistema inteligente de cupones y accesos VIP para una experiencia de shopping sin fricciones.",
    content: `
      <p>La tecnología y la exclusividad se unen en nuestro nuevo sistema de beneficios. Ahora, acceder a preventas, descuentos especiales y eventos privados es más fácil que nunca.</p>
      <p>A través de nuestra plataforma, podrás descargar cupones personalizados directamente a tu teléfono. Al presentarlos en nuestros locales, accederás a una atención preferencial y beneficios diseñados exclusivamente para nuestra comunidad.</p>
      <p>Queremos que cada visita sea especial. Con este sistema, la exclusividad te acompaña en todo momento.</p>
    `,
    date: "10 ABRE 2026",
    image: "/three-womans-with-shopping-bags-taking-selfie-with-their-smartphone-300x200.jpg",
    category: "EXPERIENCIA SMART",
    icon: <Smartphone className="w-4 h-4" />
  }
];

export default function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <main className="min-h-screen bg-alabaster selection:bg-celeste-oh selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-onyx overflow-hidden">
        <div className="absolute inset-0 ornament-bg opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-celeste-oh hover:text-brand-accent transition-all mb-12 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Inicio
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif text-white mb-6"
          >
            Oh! <span className="text-celeste-oh">News</span>
          </motion.h1>
          <p className="max-w-2xl text-alabaster/40 text-sm md:text-md uppercase tracking-[0.4em] font-bold">
            Crónicas de estilo, novedades y exclusividad.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {NEWS_DATA.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedNews(news)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-celeste-oh/10 hover:border-celeste-oh/40 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full"
            >
              <div className="relative h-72 md:h-80 w-full overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-onyx/80 backdrop-blur-md border border-celeste-oh/30 rounded-full flex items-center gap-2">
                   <div className="text-celeste-oh">{news.icon}</div>
                   <span className="text-[9px] font-bold text-white uppercase tracking-widest">{news.category}</span>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] text-onyx/40 font-bold uppercase tracking-widest mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  {news.date}
                </div>
                <h3 className="text-3xl font-serif text-onyx mb-4 group-hover:text-celeste-oh transition-colors duration-500 leading-tight">
                  {news.title}
                </h3>
                <p className="text-onyx/60 text-sm leading-relaxed mb-8 flex-1">
                  {news.excerpt}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-celeste-oh">
                  <span>Leer Crónica</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
              className="bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-onyx text-white rounded-full hover:bg-brand-accent transition-colors shadow-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-96 w-full relative">
                 <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              <div className="p-8 md:p-16 -mt-20 relative bg-white rounded-t-[3rem]">
                <div className="flex items-center gap-3 text-[11px] text-celeste-oh font-bold uppercase tracking-[0.3em] mb-6">
                   <div className="p-2 rounded-full bg-celeste-oh/10">{selectedNews.icon}</div>
                   <span>{selectedNews.category} • {selectedNews.date}</span>
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
                   <Link href="/#boutiques" onClick={() => setSelectedNews(null)} className="h-14 px-10 flex items-center justify-center bg-brand-accent text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-full hover:opacity-90 transition-all">
                      Explorar Locales
                   </Link>
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
