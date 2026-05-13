/* 
Usage: 
<PriceBadge priceMin={50} priceMax={100} />
<PriceBadge priceMin={50} priceMax={100} variant="pill" />
*/

import React from 'react';
import { Text, View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';

export interface PriceBadgeProps {
  priceMin: number;
  priceMax: number;
  variant?: 'default' | 'pill';
  containerStyle?: StyleProp<ViewStyle>;
}

export function PriceBadge({ priceMin, priceMax, variant = 'default', containerStyle }: PriceBadgeProps) {
  const formattedPrice = `₱${priceMin} - ₱${priceMax}`;

  return (
    <View style={[
      styles.badge, 
      variant === 'pill' && styles.pillBadge,
      containerStyle
    ]}>
      <Text style={[
        styles.text,
        variant === 'pill' && styles.pillText
      ]}>{formattedPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  text: {
    ...Typography.price,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  pillText: {
    color: Colors.white,
    fontFamily: FontFamily.mono,
    fontSize: FontSize.md,
  },
});
