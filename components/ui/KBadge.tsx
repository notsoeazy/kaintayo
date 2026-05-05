/* 
Usage: 
<KBadge
  label="Badge"
  variant="primary"
  style={{}}
/>
*/

import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography, FontSize, FontFamily } from '@/styles/theme';

export type KBadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'muted' | 'accent';

interface KBadgeProps {
  label: string;
  variant?: KBadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const KBadge = ({ label, variant = 'primary', style }: KBadgeProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': return { bg: Colors.primary, text: Colors.text };
      case 'secondary': return { bg: Colors.secondary, text: Colors.bg };
      case 'success': return { bg: Colors.success, text: Colors.bg };
      case 'danger': return { bg: Colors.secondary, text: Colors.bg };
      case 'muted': return { bg: Colors.linen, text: Colors.muted };
      case 'accent': return { bg: Colors.accent, text: Colors.bg };
      default: return { bg: Colors.primary, text: Colors.text };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View style={[
      styles.container,
      { backgroundColor: vStyles.bg },
      style
    ]}>
      <Text style={[
        styles.text,
        { color: vStyles.text }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.title,
  },
});
