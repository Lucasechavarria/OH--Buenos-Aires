"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/infrastructure/supabase-client";

export function useSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      
      if (error) throw error;
      
      // Convert array to a more useful key-value object
      return (data || []).reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache for global settings
  });
}
