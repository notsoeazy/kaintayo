import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { create } from 'zustand';
import { auth } from '@/lib/firebase_service';
import { getUserProfile, updateUserProfile } from '@/lib/firestore_service';
import { generateRandomUsername } from '@/lib/username_utils';

// AUTH STORE
interface AuthState {
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  signInWithEmail: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signUpWithEmail: async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Seed a Firestore profile with a random placeholder username
    await updateUserProfile(credential.user.uid, {
      username: generateRandomUsername(),
    });
  },

  signInWithGoogle: async (idToken) => {
    const firebaseCredential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, firebaseCredential);
    // Only seed a profile for brand-new Google sign-ins
    const existing = await getUserProfile(result.user.uid);
    if (!existing) {
      await updateUserProfile(result.user.uid, {
        username: generateRandomUsername(),
      });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
  },

  init: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, isLoading: false });
    });
    return unsubscribe;
  },
}));
