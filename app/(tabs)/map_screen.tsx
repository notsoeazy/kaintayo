import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Map } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/map_screen.styles';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { useTranslation } from '@/hooks/useTranslation';

export default function MapScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Map color={Colors.muted} size={64} strokeWidth={1.5} />}
        title={t.mapScreen.title}
        description={t.mapScreen.emptyDesc}
        action={<KBadge label={t.mapScreen.comingSoon} variant="secondary" />}
      />
    </SafeAreaView>
  );
}
