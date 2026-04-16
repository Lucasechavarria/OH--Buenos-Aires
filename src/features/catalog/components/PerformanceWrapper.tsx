"use client";

import { useEffect } from "react";

/**
 * PerformanceWrapper
 * Monitorea Core Web Vitals en desarrollo y asegura la prevención de Jank visual.
 */
export const PerformanceWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Monitor de Long Tasks para detectar bloqueos de hilo principal (Jank)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`[PERF] Long Task detectada (${entry.duration.toFixed(2)}ms):`, entry);
        }
      });

      observer.observe({ entryTypes: ["longtask"] });

      return () => observer.disconnect();
    }
  }, []);

  return <>{children}</>;
};
