import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, UtilStyles } from '@/styles/theme';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { User } from 'lucide-react-native';
import { styles } from '@/styles/screens/profile_screen.styles';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={UtilStyles.centered}>
        <EmptyState
          icon={<User color={Colors.muted} size={64} strokeWidth={1.5} />}
          title="Profile"
          description="Wait lang Yah, di pa keri ng Ferson."
          action={<KBadge label="COMING SOON" variant="secondary" />}
        />
      </View>
    </SafeAreaView>
  );
}
