import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { removeFromTried, removeFromWishlist, addToTried, addToWishlist, getUserTried, getUserWishlist } from '@/lib/firestore_service';

// LIST STORE
// Persisted to AsyncStorage for offline support and session survival
interface ListState {
  triedIds: string[];
  wishlistIds: string[];
  toggleTried: (uid: string, placeId: string) => Promise<void>;
  toggleWishlist: (uid: string, placeId: string) => Promise<void>;
  syncFromFirestore: (uid: string) => Promise<void>;
  clearLists: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      triedIds: [],
      wishlistIds: [],

      toggleTried: async (uid, placeId) => {
        const isTried = get().triedIds.includes(placeId);
        
        // Optimistic update
        set((state) => ({ 
          triedIds: isTried 
            ? state.triedIds.filter(id => id !== placeId) 
            : [...state.triedIds, placeId] 
        }));

        try {
          if (isTried) {
            await removeFromTried(uid, placeId);
          } else {
            await addToTried(uid, placeId);
          }
        } catch (err) {
          console.error('[list_store] toggleTried failed:', err);
          // Rollback on error
          set((state) => ({
            triedIds: isTried 
              ? [...state.triedIds, placeId] 
              : state.triedIds.filter(id => id !== placeId)
          }));
        }
      },

      toggleWishlist: async (uid, placeId) => {
        const isWishlisted = get().wishlistIds.includes(placeId);
        
        // Optimistic update
        set((state) => ({ 
          wishlistIds: isWishlisted 
            ? state.wishlistIds.filter(id => id !== placeId) 
            : [...state.wishlistIds, placeId] 
        }));

        try {
          if (isWishlisted) {
            await removeFromWishlist(uid, placeId);
          } else {
            await addToWishlist(uid, placeId);
          }
        } catch (err) {
          console.error('[list_store] toggleWishlist failed:', err);
          // Rollback on error
          set((state) => ({
            wishlistIds: isWishlisted 
              ? [...state.wishlistIds, placeId] 
              : state.wishlistIds.filter(id => id !== placeId)
          }));
        }
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
