import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/styles/theme';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { User, LogOut } from 'lucide-react-native';
import { styles } from '@/styles/screens/profile_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settings_store';
import { useAuthStore } from '@/store/auth_store';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const { signOut } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.tabs.profile}</Text>
        </View>

        {/* SETTINGS SECTION */}
        <View style={styles.settingsSection}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t.settings.languageTitle}</Text>
            <View style={styles.langButtons}>
              <TouchableOpacity
                style={[styles.langButton, language === 'en' && styles.langButtonActive]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.7}
              >
                <Text style={[styles.langButtonText, language === 'en' && styles.langButtonTextActive]}>
                  {t.settings.englishOption}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langButton, language === 'tl' && styles.langButtonActive]}
                onPress={() => setLanguage('tl')}
                activeOpacity={0.7}
              >
                <Text style={[styles.langButtonText, language === 'tl' && styles.langButtonTextActive]}>
                  {t.settings.tagalogOption}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={signOut}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>{t.settings.logout}</Text>
          </TouchableOpacity>
        </View>

        {/* EMPTY STATE */}
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<User color={Colors.muted} size={64} strokeWidth={1.5} />}
            title={t.profileScreen.title}
            description={t.profileScreen.emptyDesc}
            action={<KBadge label={t.profileScreen.comingSoon} variant="secondary" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
