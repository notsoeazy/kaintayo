import { create } from 'zustand';
import { getPlaces } from '@/lib/firestore_service';
import type { FeedFilters, FoodCategory, Place } from '@/types';

// FEED STORE
const defaultFilters: FeedFilters = {
  categories: [],
  priceTier: null,
  maxDistance: 5, // Default to 5km
};

interface FeedState {
  places: Place[];
  filters: FeedFilters;
  isLoading: boolean;
  error: string | null;
  fetchPlaces: () => Promise<void>;
  setFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void;
  toggleCategory: (id: FoodCategory) => void;
  resetFilters: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  places: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchPlaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const places = await getPlaces();
      set({ places, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  },

  // Toggle a category in/out of the active filter set
  toggleCategory: (id) => {
    set((state) => {
      const active = state.filters.categories;
      const next = active.includes(id)
        ? active.filter((c) => c !== id)
        : [...active, id];
      return { filters: { ...state.filters, categories: next } };
    });
  },

  resetFilters: () => set({ filters: defaultFilters }),
}));
