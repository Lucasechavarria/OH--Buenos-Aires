"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  ShoppingBag, 
  UtensilsCrossed, 
  Sparkles, 
  MapPin,
  TicketPercent
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Marcas", href: "/marcas", icon: ShoppingBag },
  { label: "Gastro", href: "/gastronomia", icon: UtensilsCrossed },
  { label: "Novedades", href: "/novedades", icon: Sparkles },
  { label: "Promos", href: "/promociones", icon: TicketPercent },
  { label: "Visita", href: "/visita", icon: MapPin },
];

export default function MobileDock() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 md:hidden pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
        className="pointer-events-auto relative flex items-center gap-1 p-2 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-300"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-celeste-oh/10 rounded-2xl shadow-[0_0_15px_rgba(var(--celeste-oh-rgb),0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative flex flex-col items-center gap-1 z-10">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`transition-all duration-500 ${
                    isActive 
                      ? "text-celeste-oh drop-shadow-[0_0_8px_rgba(var(--celeste-oh-rgb),0.8)]" 
                      : "text-onyx/40"
                  }`}
                />
                <span className={`text-[8px] font-bold uppercase tracking-[0.1em] transition-all duration-500 ${
                  isActive ? "text-onyx opacity-100" : "text-onyx/30 opacity-60"
                }`}>
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-celeste-oh rounded-full shadow-[0_0_5px_var(--celeste-oh)]"
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
