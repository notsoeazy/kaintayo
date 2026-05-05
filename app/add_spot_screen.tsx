import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/screens/add_spot_screen.styles';
import { EmptyState } from '@/components/ui/EmptyState';
import { KBadge } from '@/components/ui/KBadge';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/styles/theme';

export default function AddSpotScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon={<Plus color={Colors.muted} size={64} strokeWidth={3} />}
        title="Add a Spot"
        description="Wala pa munang spot idol."
        action={<KBadge label="COMING SOON" variant="secondary" />}
      />
    </SafeAreaView>
  );
}
