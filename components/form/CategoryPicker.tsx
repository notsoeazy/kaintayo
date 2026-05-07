/* 
Usage: 
<CategoryPicker
  selected={step1.categories}
  onToggle={toggleCategory}
/>
*/

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FOOD_CATEGORIES } from '@/constants/categories';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import type { FoodCategory } from '@/types';

interface CategoryPickerProps {
  selected: FoodCategory[];
  onToggle: (id: FoodCategory) => void;
}

export function CategoryPicker({ selected, onToggle }: CategoryPickerProps) {
  return (
    <View style={styles.categoryGrid}>
      {FOOD_CATEGORIES.map((cat) => {
        const isActive = selected.includes(cat.id);
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            onPress={() => onToggle(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
              {cat.emoji} {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.linen,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  categoryChipTextActive: {
    color: Colors.text,
  },
});
