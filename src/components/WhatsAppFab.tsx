"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFab() {
  const whatsappNumber = "541140000000"; // Reemplazar con el real
  const message = encodeURIComponent("Hola! Quisiera obtener información sobre OH! Buenos Aires.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-8 right-8 z-[100]"
    >
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center h-16 w-16 bg-brand-accent rounded-full shadow-[0_10px_40px_rgba(107,204,216,0.5)] transition-all hover:scale-110 active:scale-95 border border-white/20 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-celeste-oh animate-ping opacity-20" />
        
        <MessageCircle className="h-7 w-7 text-white relative z-10" />
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-onyx/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
          Contactar Concierge
        </div>
      </a>
    </motion.div>
  );
}
