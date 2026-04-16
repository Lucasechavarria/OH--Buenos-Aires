import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CatalogState {
  searchQuery: string;
  category: string;
  isGridMode: boolean;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  toggleGridMode: () => void;
  resetFilters: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      searchQuery: '',
      category: 'all',
      isGridMode: true,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ category }),
      toggleGridMode: () => set((state) => ({ isGridMode: !state.isGridMode })),
      resetFilters: () => set({ searchQuery: '', category: 'all' }),
    }),
    {
      name: 'oh-buenos-aires-catalog-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
