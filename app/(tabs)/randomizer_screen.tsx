import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/styles/theme';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { Plus } from 'lucide-react-native';
import { styles } from '@/styles/screens/randomizer_screen.styles';

export default function RandomizerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Plus color={Colors.muted} size={64} strokeWidth={3} />}
        title="Randomizer"
        description="Wala pa munang randomizer idol."
        action={<KBadge label="COMING SOON" variant="secondary" />}
      />
    </SafeAreaView>
  );
}
