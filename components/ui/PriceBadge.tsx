/* 
Usage: 
<PriceBadge
  priceMin={50}
  priceMax={100}
/>
*/

import React from 'react';
import { Text, View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Colors, FontSize, Radius, Spacing, Typography } from '@/styles/theme';

export interface PriceBadgeProps {
  priceMin: number;
  priceMax: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function PriceBadge({ priceMin, priceMax, containerStyle }: PriceBadgeProps) {
  const formattedPrice = `₱${priceMin} - ₱${priceMax}`;

  return (
    <View style={[styles.badge, containerStyle]}>
      <Text style={styles.text}>{formattedPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.price,
    fontSize: FontSize.sm,
  },
});
