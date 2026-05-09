"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpTooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function HelpTooltip({ text, position = "top" }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  return (
    <div className="relative inline-block ml-2 group">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-alabaster/20 hover:text-celeste-oh transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            className={`absolute z-50 w-64 p-4 bg-onyx/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-none ${positionClasses[position]}`}
          >
            <div className="text-[11px] leading-relaxed text-alabaster/80 font-sans font-medium">
              {text}
            </div>
            <div className={`absolute w-2 h-2 bg-onyx border-white/10 border-b border-r rotate-45 ${
              position === "top" ? "top-full -translate-y-1/2 left-1/2 -translate-x-1/2 border-t-0 border-l-0" : 
              position === "bottom" ? "bottom-full translate-y-1/2 left-1/2 -translate-x-1/2 border-b-0 border-r-0 border-t border-l" : ""
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
