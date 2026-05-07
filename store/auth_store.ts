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
    await createUserWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: async (idToken) => {
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
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
