/* 
Usage: 
<CategoryChip category="silog" />
*/

import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  type StyleProp, 
  type ViewStyle 
} from 'react-native';
import { FOOD_CATEGORIES } from '@/constants/categories';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';

import type { FoodCategory } from '@/types';

export interface CategoryChipProps {
  category: FoodCategory;
  style?: StyleProp<ViewStyle>;
}

export function CategoryChip({ category, style }: CategoryChipProps) {
  const meta = FOOD_CATEGORIES.find((c) => c.id === category);
  const label = meta ? `${meta.emoji} ${meta.label}` : category;

  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs - 2,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.bg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: FontSize.sm,
  },
});
