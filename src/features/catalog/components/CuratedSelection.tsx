"use client";

import { motion } from "framer-motion";
import { FlipCard } from "./FlipCard/FlipCard";
import { Brand } from "@/src/lib/domain/entities";

interface CuratedSelectionProps {
  curatedItems: Brand[];
}

export const CuratedSelection = ({ curatedItems }: CuratedSelectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-20 text-center"
    >
      <div className="mb-12 max-w-2xl">
        <h3 className="mb-4 font-serif text-3xl italic text-slate-800">
          Una selección curada para ti
        </h3>
        <p className="text-slate-500 font-sans">
          No hemos encontrado exactamente lo que buscabas, pero quizás te interese 
          nuestra exclusiva selección editorial de esta semana.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {curatedItems.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FlipCard brand={brand} />
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="mt-16 px-8 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-serif italic"
      >
        Explorar todo el catálogo
      </motion.button>
    </motion.div>
  );
};
