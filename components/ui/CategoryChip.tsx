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
import { Colors, FontFamily, Radius, Spacing, Typography } from '@/styles/theme';
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
    backgroundColor: Colors.secondary,
    borderWidth: 0,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.surface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
