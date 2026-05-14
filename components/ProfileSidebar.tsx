/*
Usage:
<ProfileSidebar
  visible={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
*/

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settings_store';
import { useAuthStore } from '@/store/auth_store';

interface ProfileSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = 280;

export function ProfileSidebar({ visible, onClose }: ProfileSidebarProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const { signOut } = useAuthStore();

  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 18,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropAnim }]}
        />
      </TouchableWithoutFeedback>

      {/* SIDEBAR PANEL */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
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
          <Text style={styles.sectionLabel}>{t.settings.languageTitle}</Text>
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

        {/* DIVIDER */}
        <View style={styles.divider} />

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
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
  },
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
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  langButtons: {
    gap: Spacing.sm,
  },
  langButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.linen,
  },
  langButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langButtonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  langButtonTextActive: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.surface,
  },
  logoutButton: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  logoutText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.md,
    color: Colors.secondary,
  },
});
