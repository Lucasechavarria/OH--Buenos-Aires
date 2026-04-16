"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCatalogStore } from "../store/useCatalogStore";

/**
 * Hook para sincronizar el estado de Zustand con los Search Params de la URL
 */
export const usePersistentFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { searchQuery, category, setSearchQuery, setCategory } = useCatalogStore();

  // 1. Hidratar desde la URL al montar
  useEffect(() => {
    const query = searchParams.get("q");
    const cat = searchParams.get("cat");

    if (query) setSearchQuery(query);
    if (cat) setCategory(cat);
  }, []);

  // 2. Sincronizar hacia la URL cuando cambie el estado
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (category !== "all") params.set("cat", category);
    else params.delete("cat");

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [searchQuery, category, pathname, router, searchParams]);
};
