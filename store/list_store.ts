import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addToTried, addToWishlist, getUserTried, getUserWishlist } from '@/lib/firestore_service';

// LIST STORE
// Persisted to AsyncStorage for offline support and session survival
interface ListState {
  triedIds: string[];
  wishlistIds: string[];
  addToTried: (uid: string, placeId: string) => Promise<void>;
  addToWishlist: (uid: string, placeId: string) => Promise<void>;
  syncFromFirestore: (uid: string) => Promise<void>;
  clearLists: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      triedIds: [],
      wishlistIds: [],

      addToTried: async (uid, placeId) => {
        if (get().triedIds.includes(placeId)) return;
        await addToTried(uid, placeId);
        set((state) => ({ triedIds: [...state.triedIds, placeId] }));
      },

      addToWishlist: async (uid, placeId) => {
        if (get().wishlistIds.includes(placeId)) return;
        await addToWishlist(uid, placeId);
        set((state) => ({ wishlistIds: [...state.wishlistIds, placeId] }));
      },

      // Pull current lists from Firestore on login and sync local state
      syncFromFirestore: async (uid) => {
        const [triedIds, wishlistIds] = await Promise.all([
          getUserTried(uid),
          getUserWishlist(uid),
        ]);
        set({ triedIds, wishlistIds });
      },

      clearLists: () => set({ triedIds: [], wishlistIds: [] }),
    }),
    {
      name: 'kaintayo-lists',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
