/* 
Usage: 
<FilterBar />
*/

import React from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { FOOD_CATEGORIES } from '@/constants/categories';
import { FilterChip } from './ui/FilterChip';
import { useFeedStore } from '@/store/feed_store';
import { Spacing } from '@/styles/theme';
import type { FoodCategory } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

export interface FilterBarProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export function FilterBar({ containerStyle }: FilterBarProps) {
  const { filters, toggleCategory, setFilter } = useFeedStore();
  const { t } = useTranslation();

  const handleCategoryPress = (id: FoodCategory) => {
    toggleCategory(id);
  };

  const handleShowAllPress = () => {
    setFilter('showAllDistances', !filters.showAllDistances);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.contentContainer}
    >
      <FilterChip
        label={t.home.showAllFilter}
        isActive={filters.showAllDistances}
        onPress={handleShowAllPress}
      />
      {FOOD_CATEGORIES.map((cat) => (
        <FilterChip
          key={cat.id}
          label={`${cat.emoji} ${cat.label}`}
          isActive={filters.categories.includes(cat.id)}
          onPress={() => handleCategoryPress(cat.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
});
