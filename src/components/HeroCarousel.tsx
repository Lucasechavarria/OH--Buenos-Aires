"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/src/lib/infrastructure/supabase-client";
import { useQuery } from "@tanstack/react-query";

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const { data: images = [] } = useQuery({
    queryKey: ["hero-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev: number) => (prev + 1) % images.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [images]);

  if (images.length === 0) return (
    <div className="absolute inset-0 bg-onyx" />
  );

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
            src={images[index].image_url}
            alt={images[index].title || "Oh! Buenos Aires Experience"}
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
