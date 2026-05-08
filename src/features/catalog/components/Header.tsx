"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Marcas", href: "/marcas" },
  { label: "Gastronomía", href: "/gastronomia" },
  { label: "Agenda", href: "/agenda" },
  { label: "Promociones", href: "/promociones" },
  { label: "Visita", href: "/visita" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Ajustamos el umbral para que el cambio sea más natural
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-2xl border-b border-celeste-oh/30 shadow-2xl py-2" 
          : "bg-transparent py-4 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            className="relative h-10 w-44"
            initial={false}
            animate={{ scale: isScrolled ? 0.9 : 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/OH-Buenos-Aires-Logo-Blanco.png" 
              alt="Oh! Buenos Aires" 
              className={`h-full w-full object-contain transition-all duration-500 ${isScrolled ? "brightness-0" : "brightness-100"}`}
            />
          </motion.div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`text-[10px] font-bold uppercase tracking-[0.3em] font-sans transition-all duration-500 ${
                isScrolled ? "text-onyx" : "text-white hover:text-celeste-oh"
              }`}
            >
              <span className="relative group">
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${
                  isScrolled ? "bg-onyx" : "bg-celeste-oh"
                }`} />
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Indicator */}
        <div className="md:hidden">
            <div className={`h-1 w-8 rounded-full ${isScrolled ? 'bg-onyx' : 'bg-white'}`} />
        </div>
      </div>
    </header>
  );
}
