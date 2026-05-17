import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PRICE_TIERS, getTierRangeLabel, TIER_COLORS, TIER_TEXT_COLORS } from '@/constants/price_ranges';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import type { PriceTier } from '@/types';

interface PriceTierPickerProps {
  selected: PriceTier | null;
  onSelect: (tier: PriceTier) => void;
}

export function PriceTierPicker({ selected, onSelect }: PriceTierPickerProps) {
  return (
    <View style={styles.container}>
      {PRICE_TIERS.map((tier) => {
        const isActive = selected === tier.id;
        return (
          <TouchableOpacity
            key={tier.id}
            style={[
              styles.chip,
              isActive && {
                backgroundColor: TIER_COLORS[tier.id],
                borderColor: TIER_TEXT_COLORS[tier.id],
              },
            ]}
            onPress={() => onSelect(tier.id)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipLabel,
                isActive && { color: TIER_TEXT_COLORS[tier.id] },
              ]}
            >
              {tier.label}
            </Text>
            <Text
              style={[
                styles.chipRange,
                isActive && { color: TIER_TEXT_COLORS[tier.id], opacity: 0.8 },
              ]}
            >
              {getTierRangeLabel(tier.id)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.linen,
  },
  chipLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  chipRange: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
});
