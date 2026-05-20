/*
Usage:
<ProfileSidebar
  visible={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
*/

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { X, Globe, LogOut, Info, ExternalLink } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settings_store';
import { useAuthStore } from '@/store/auth_store';

interface ProfileSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = 310;

export function ProfileSidebar({ visible, onClose }: ProfileSidebarProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const { signOut } = useAuthStore();

  const [internalVisible, setInternalVisible] = useState(visible);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setInternalVisible(false));
    }
  }, [visible]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
  };

  return (
    <Modal
      visible={internalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* SIDEBAR PANEL */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.topContainer}>
          {/* SIDEBAR HEADER */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>{t.profileScreen.sidebarTitle}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* LANGUAGE SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={15} color={Colors.muted} />
              <Text style={styles.sectionLabel}>{t.settings.languageTitle}</Text>
            </View>
            <View style={styles.langButtons}>
              <TouchableOpacity
                style={[styles.langButton, language === 'en' && styles.langButtonActive]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    language === 'en' && styles.langButtonTextActive,
                  ]}
                >
                  {t.settings.englishOption}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langButton, language === 'tl' && styles.langButtonActive]}
                onPress={() => setLanguage('tl')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    language === 'tl' && styles.langButtonTextActive,
                  ]}
                >
                  {t.settings.tagalogOption}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ABOUT SECTION */}
          <View style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={15} color={Colors.muted} />
              <Text style={styles.sectionLabel}>About</Text>
            </View>
            <View style={styles.aboutCard}>
              <View style={styles.aboutLogoWrap}>
                <Image
                  source={require('@/assets/images/splash-icon.png')}
                  style={styles.aboutLogo}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.aboutAppName}>KainTayo</Text>
              <Text style={styles.aboutVersion}>v1.0.0</Text>
              <Text style={styles.aboutTagline}>{'Budget food discovery\nfor Filipino students 🇵🇭'}</Text>
              <View style={styles.aboutDividerThin} />
              <Text style={styles.aboutMadeByLabel}>Made with ❤️ by</Text>
              <View style={styles.aboutContributors}>
                <TouchableOpacity
                  style={styles.aboutContributorPill}
                  onPress={() => Linking.openURL('https://github.com/notsoeazy')}
                  activeOpacity={0.7}
                >
                  <ExternalLink size={12} color={Colors.primary} />
                  <Text style={styles.aboutLink}>notsoeazy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.aboutContributorPill}
                  onPress={() => Linking.openURL('https://github.com/MaTT-R4Yn0')}
                  activeOpacity={0.7}
                >
                  <ExternalLink size={12} color={Colors.primary} />
                  <Text style={styles.aboutLink}>MaTT-R4Yn0</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          activeOpacity={0.75}
        >
          <LogOut size={15} color={Colors.surface} />
          <Text style={styles.logoutText}>{t.settings.logout}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 26, 14, 0.45)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.surface,
    shadowColor: Colors.text,
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  topContainer: {},
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  sidebarTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  langButtons: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.linen,
  },
  langButtonActive: {
    backgroundColor: Colors.primary,
  },
  langButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
  },
  langButtonTextActive: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.surface,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    paddingVertical: 11,
    borderRadius: Radius.sm,
    backgroundColor: Colors.secondary,
  },
  logoutText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.surface,
  },
  aboutCard: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  aboutLogoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  aboutLogo: {
    width: 52,
    height: 52,
  },
  aboutAppName: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: 2,
  },
  aboutVersion: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    backgroundColor: Colors.primary + '15',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  aboutTagline: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: Spacing.sm,
  },
  aboutDividerThin: {
    height: 1,
    width: '80%',
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  aboutMadeByLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.muted,
    marginBottom: 6,
  },
  aboutContributors: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  aboutContributorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  aboutLink: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
});
