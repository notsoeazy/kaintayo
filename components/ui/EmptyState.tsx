/* 
Usage: 
<EmptyState
  icon={<Coffee size={64} color={Colors.muted} />}
  title="No places found"
  description="Try adjusting your filters or searching for something else."
  action={<KButton title="Reset Filters" onPress={handleReset} />}
/>
*/

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, UtilStyles } from '@/styles/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      
      <Text style={styles.description}>
        {description}
      </Text>

      {action && (
        <View style={styles.action}>
          {action}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...UtilStyles.centered,
    flex: 1,
    padding: Spacing.sm,
  },
  icon: {
    marginBottom: Spacing.md,
    opacity: 0.8,
  },
  title: {
    ...Typography.title,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  action: {
    marginTop: Spacing.sm,
  },
});
