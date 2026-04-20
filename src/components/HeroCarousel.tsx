"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "/assets/hero/architecture.jpg",
  "/assets/hero/lifestyle-1.jpg",
  "/assets/hero/lifestyle-2.jpg",
  "/assets/hero/Shopping.webp",
  "/assets/hero/Shopping1.webp",
  "/assets/hero/Shopping2.webp",
  "/assets/hero/Shopping3.webp",
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // Cambio cada 6 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 2, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" } 
          }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGES[index]}
            alt="Oh! Buenos Aires Experience"
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-onyx/90 via-onyx/40 to-onyx" />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/40 via-transparent to-onyx/40" />
      
      {/* Decorative Noise / Texture (Optional but adds premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
    </div>
  );
}
