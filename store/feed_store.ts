import { create } from 'zustand';
import { getPlaces } from '@/lib/firestore_service';
import type { FeedFilters, Place } from '@/types';
import { MOCK_PLACES } from '@/constants/mock_places';

// FEED STORE
const defaultFilters: FeedFilters = {
  category: null,
  priceTier: null,
  nearMe: false,
};

interface FeedState {
  places: Place[];
  filters: FeedFilters;
  isLoading: boolean;
  error: string | null;
  fetchPlaces: () => Promise<void>;
  setFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void;
  resetFilters: () => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  places: MOCK_PLACES,
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

  resetFilters: () => set({ filters: defaultFilters }),
}));
