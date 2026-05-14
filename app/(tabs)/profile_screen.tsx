import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/profile_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { ProfileSidebar } from '@/components/ProfileSidebar';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.tabs.profile}</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSidebarOpen(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Settings size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* SIDEBAR */}
      <ProfileSidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </SafeAreaView>
  );
}
