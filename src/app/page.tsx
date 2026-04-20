import { Suspense } from "react";
import * as motion from "framer-motion/client";
import Header from "@/src/features/catalog/components/Header";
import { CatalogGrid } from "@/src/features/catalog/components/CatalogGrid";
import { MapPin } from "lucide-react";
import ContactSection from "@/src/components/ContactSection";
import MarketingSplash from "@/src/components/MarketingSplash";
import BannersSlider from "@/src/components/BannersSlider";
import LatestNewsSnippet from "@/src/components/LatestNewsSnippet";
import CustomerServiceChatbot from "@/src/components/CustomerServiceChatbot";
import HeroCarousel from "@/src/components/HeroCarousel";


const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-gold-leaf selection:text-midnight-blue">
      <MarketingSplash />
      <Header />
      
      {/* Hero Section - Boutique Gold Experience */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-onyx">
        {/* Immersive Cinematic Backdrop - Scraped Images */}
        <HeroCarousel />

        <div className="relative z-10 text-center px-6 mt-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <div className="relative h-36 md:h-64 w-full max-w-5xl mx-auto mb-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
              <img 
                src="/OH-Buenos-Aires-Logo-Blanco.png" 
                alt="Oh! Buenos Aires" 
                className="h-full w-full object-contain"
              />
            </div>
            
            <p className="max-w-3xl mx-auto text-alabaster/70 text-sm md:text-xl font-medium leading-relaxed mb-16 font-sans italic tracking-[0.1em] drop-shadow-md">
              Descubrí OH! Buenos Aires, tu destino definitivo de Luxury Shopping en el corazón de Recoleta. 
              El epicentro de las tendencias internacionales y experiencias exclusivas diseñadas para vos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a href="#boutiques" className="h-16 px-12 flex items-center justify-center bg-gold-metallic text-onyx text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-gold-heritage/20 font-sans border border-white/10">
                Explorar Marcas & Locales
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative Luxury Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[5%] h-[1px] w-64 bg-gold-heritage/20 rotate-45 blur-[1px]" />
          <div className="absolute bottom-[25%] right-[10%] h-[1px] w-96 bg-gold-heritage/20 -rotate-12 blur-[1px]" />
        </div>
      </section>

      <BannersSlider />

      {/* Main Catalog Section */}
      <section id="boutiques" className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-serif text-onyx mb-8 leading-tight">Nuestros Locales</h2>
              <p className="text-onyx/60 text-base leading-loose font-medium">
                Descubrí la variedad de nuestras marcas y locales comerciales. Una experiencia completa diseñada para vos en el corazón de Buenos Aires.
              </p>
            </div>
            
            <a href="https://maps.app.goo.gl/8Z1QYSy1anWy5jY96" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-gold-heritage hover:text-gold-shine transition-colors group cursor-pointer">
              <div className="h-0.5 w-6 group-hover:w-12 bg-gold-heritage transition-all duration-300" />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Av Pueyrredon y Azcuenaga</span>
            </a>
          </div>

          <Suspense fallback={<div className="h-screen bg-alabaster" />}>
            <CatalogGrid />
          </Suspense>
        </div>
      </section>

      <LatestNewsSnippet />

      <ContactSection />

      <CustomerServiceChatbot />

      {/* Brand Ethos / Footer Preview */}
      <footer className="py-20 px-6 border-t border-onyx/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full border border-gold-heritage/30 flex items-center justify-center mb-12 shadow-inner">
             <div className="h-3 w-3 rounded-full bg-gold-metallic animate-pulse" />
          </div>
          <h4 className="text-4xl font-serif tracking-tight text-onyx mb-8">
            Visitanos en Recoleta
          </h4>
          <a 
            href="https://maps.app.goo.gl/8Z1QYSy1anWy5jY96" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center justify-center gap-3 text-onyx/60 hover:text-gold-heritage transition-colors text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.6em] mb-12 font-sans relative"
          >
            <div className="bg-gold-heritage/10 p-2 rounded-full group-hover:bg-gold-heritage/20 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <span className="mt-1">Av Pueyrredon y Azcuenaga, Buenos Aires</span>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gold-heritage group-hover:w-full transition-all duration-700" />
          </a>
          
          <div className="flex items-center gap-10 mb-12">
            <a 
              href="https://www.instagram.com/oh_buenosaires" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-all"
            >
              <div className="h-14 w-14 rounded-full border border-gold-heritage/20 flex items-center justify-center group-hover:border-gold-heritage group-hover:bg-gold-metallic transition-all shadow-sm">
                <InstagramIcon />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-onyx transition-colors">Instagram</span>
            </a>

            <a 
              href="https://www.linkedin.com/company/ohbuenosaires" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-all"
            >
              <div className="h-14 w-14 rounded-full border border-gold-heritage/20 flex items-center justify-center group-hover:border-gold-heritage group-hover:bg-gold-metallic transition-all shadow-sm">
                <LinkedinIcon />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-onyx/40 group-hover:text-onyx transition-colors">LinkedIn</span>
            </a>
          </div>
          
          {/* LDE-System Signature Block */}
          <div className="w-full max-w-4xl pt-10 border-t border-onyx/5 flex justify-center">
             <a 
               href="https://lde-system.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-[9px] font-bold uppercase tracking-[0.4em] text-onyx/40 hover:text-onyx transition-all duration-300 font-sans group"
             >
               Diseñado y Desarrollado por <span className="text-gold-heritage group-hover:text-gold-shine group-hover:drop-shadow-sm transition-all ml-1">LDE-System</span>
             </a>
          </div>
          
          <p className="mt-6 text-onyx/50 text-[9px] font-normal tracking-[0.2em]">
            © 2026 OH! BUENOS AIRES EXPERIENCE. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </footer>

    </main>
  );
}
