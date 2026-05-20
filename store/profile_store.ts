import { create } from 'zustand';
import { getUserProfile, updateUserProfile } from '@/lib/firestore_service';
import { uploadAvatarToFirebase } from '@/lib/firebase_storage_service';
import type { UserProfile } from '@/types';

// PROFILE STORE
// Non-persisted — fetched fresh from Firestore on login.
interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchProfile: (uid: string) => Promise<void>;
  saveUsername: (uid: string, username: string) => Promise<void>;
  saveAvatar: (uid: string, localUri: string) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProfile: async (uid) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await getUserProfile(uid);
      set({ profile, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  saveUsername: async (uid, username) => {
    set({ isSaving: true, error: null });
    try {
      const lowerUsername = username.trim().toLowerCase();
      await updateUserProfile(uid, { username: lowerUsername });
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, username: lowerUsername }
          : { uid, username: lowerUsername, photoUrl: '', updatedAt: null },
        isSaving: false,
      }));
    } catch (err) {
      console.error("ZUSTAND ERROR:", err); set({ error: (err as Error).message, isSaving: false });
    }
  },

  // Uploads avatar image to Cloud Storage then persists the download URL in Firestore
  saveAvatar: async (uid, localUri) => {
    set({ isSaving: true, error: null });
    try {
      let photoUrl = await uploadAvatarToFirebase(localUri, uid);
      // Bypass cache by appending a timestamp
      if (photoUrl.includes('?')) {
        photoUrl += `&t=${Date.now()}`;
      } else {
        photoUrl += `?t=${Date.now()}`;
      }
      await updateUserProfile(uid, { photoUrl });
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, photoUrl }
          : { uid, username: '', photoUrl, updatedAt: null },
        isSaving: false,
      }));
    } catch (err) {
      console.error("ZUSTAND ERROR:", err); set({ error: (err as Error).message, isSaving: false });
    }
  },

  clearProfile: () => set({ profile: null, error: null }),
}));
