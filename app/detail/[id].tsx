import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Store } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/detail_screen.styles';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';

import { useTranslation } from '@/hooks/useTranslation';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Store color={Colors.muted} size={64} strokeWidth={1.5} />}
        title={t.detailScreen.title}
        description={t.detailScreen.emptyDesc}
        action={<KBadge label={t.detailScreen.comingSoon} variant="secondary" />}
      />
    </SafeAreaView>
  );
}
