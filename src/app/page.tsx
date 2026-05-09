"use client";

import * as motion from "framer-motion/client";
import Header from "@/src/features/catalog/components/Header";

import { MapPin } from "lucide-react";
import ContactSection from "@/src/components/ContactSection";
import MarketingSplash from "@/src/components/MarketingSplash";
import BannersSlider from "@/src/components/BannersSlider";
import LatestNewsSnippet from "@/src/components/LatestNewsSnippet";
import Link from "next/link";
import InstagramFeed from "@/src/components/InstagramFeed";
import HeroCarousel from "@/src/components/HeroCarousel";
import { useSettings } from "@/src/hooks/useSettings";
import Footer from "@/src/components/Footer";


export default function Home() {
  const { data: settings = {} } = useSettings();

  return (
    <main className="min-h-screen selection:bg-celeste-oh selection:text-white">
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
              <Link href="/marcas" className="h-16 px-12 flex items-center justify-center bg-brand-accent text-white text-[11px] font-bold uppercase tracking-[0.4em] rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-premium font-sans border border-onyx/20 text-shadow-hero">
                Explorar Marcas & Locales
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Luxury Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[5%] h-[1px] w-64 bg-celeste-oh/20 rotate-45 blur-[1px]" />
          <div className="absolute bottom-[25%] right-[10%] h-[1px] w-96 bg-celeste-oh/20 -rotate-12 blur-[1px]" />
        </div>
      </section>

      <BannersSlider />



      <LatestNewsSnippet />
      <InstagramFeed />
      <ContactSection />

      {/* Brand Ethos / Footer Preview */}
      <footer className="py-20 px-6 border-t border-onyx/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full border border-celeste-oh/30 flex items-center justify-center mb-12 shadow-inner">
             <div className="h-3 w-3 rounded-full bg-brand-accent animate-pulse" />
          </div>
          <h4 className="text-4xl font-serif tracking-tight text-onyx mb-8">
            Visitanos en Recoleta
          </h4>
          <a 
            href={settings.social_google_maps || "https://maps.app.goo.gl/8Z1QYSy1anWy5jY96"} 
            target="_blank" 
            rel="noopener noreferrer"
      <Footer />
    </main>
  );
}
