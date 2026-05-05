import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/map_screen.styles';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Map color={Colors.muted} size={64} strokeWidth={1.5} />}
        title="MAPA"
        description="Kalma kapatid, pagod pa si Google Maps eh."
        action={<KBadge label="COMING SOON" variant="secondary" />}
      />
    </SafeAreaView>
  );
}
