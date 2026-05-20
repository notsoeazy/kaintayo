/* 
Usage: 
<PriceBadge
  tier={place.priceTier}
  fallbackMin={place.priceMin}
  variant="default" // or "pill"
/>
*/

import { getTierMeta, getTierRangeLabel, TIER_COLORS, TIER_SOLID_COLORS, TIER_SOLID_TEXT_COLORS, TIER_TEXT_COLORS } from '@/constants/price_ranges';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import type { PriceTier } from '@/types';
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface PriceBadgeProps {
  tier?: PriceTier;
  variant?: 'default' | 'pill' | 'on-image';
  containerStyle?: StyleProp<ViewStyle>;
}

export function PriceBadge({ tier, variant = 'default', containerStyle }: PriceBadgeProps) {
  const resolvedTier = tier ?? 'very-budget';

  const meta = getTierMeta(resolvedTier);
  const label = meta?.label ?? resolvedTier;
  const range = getTierRangeLabel(resolvedTier);

  const isOnImage = variant === 'on-image';
  const bgColor = isOnImage ? TIER_SOLID_COLORS[resolvedTier] : TIER_COLORS[resolvedTier];
  const textColor = isOnImage ? TIER_SOLID_TEXT_COLORS[resolvedTier] : TIER_TEXT_COLORS[resolvedTier];

  return (
    <View
      style={[
        styles.badge,
        variant === 'pill' && styles.pillBadge,
        { backgroundColor: bgColor },
        containerStyle,
      ]}
    >
      {variant === 'pill' ? (
        <Text style={[
          styles.pillRange,
          { color: textColor }
        ]}>
          {range}
        </Text>
      ) : (
        <>
          <Text style={[
            styles.symbol,
            { color: textColor }
          ]}>
            {meta?.symbol}
          </Text>
          <Text style={[
            styles.label,
            { color: textColor }
          ]}>
            {label}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  },
  pillBadge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  range: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  symbol: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xs,
    lineHeight: 16,
    fontWeight: '700',
  },
  pillRange: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
