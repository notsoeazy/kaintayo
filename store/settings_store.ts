import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageOption } from '@/constants/strings';

interface SettingsState {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en', // Default to English/Taglish mix
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
