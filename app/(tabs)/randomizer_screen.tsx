import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/styles/theme';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { Plus } from 'lucide-react-native';
import { styles } from '@/styles/screens/randomizer_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';

export default function RandomizerScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Plus color={Colors.muted} size={64} strokeWidth={3} />}
        title={t.randomizerScreen.title}
        description={t.randomizerScreen.emptyDesc}
        action={<KBadge label={t.randomizerScreen.comingSoon} variant="secondary" />}
      />
    </SafeAreaView>
  );
}
