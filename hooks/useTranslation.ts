import { useSettingsStore } from '@/store/settings_store';
import { strings, AppStrings } from '@/constants/strings';

export const useTranslation = () => {
  const { language } = useSettingsStore();

  const t: AppStrings = strings[language] || strings['en'];

  return { t, language };
};
