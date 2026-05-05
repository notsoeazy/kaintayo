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

export interface FilterBarProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export function FilterBar({ containerStyle }: FilterBarProps) {
  const { filters, setFilter } = useFeedStore();

  const handleCategoryPress = (categoryId: FoodCategory) => {
    if (filters.category === categoryId) {
      setFilter('category', null);
    } else {
      setFilter('category', categoryId);
    }
  };

  const handleNearMePress = () => {
    setFilter('nearMe', !filters.nearMe);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, containerStyle]}
      contentContainerStyle={styles.contentContainer}
    >
      <FilterChip
        label="Near Me"
        isActive={filters.nearMe}
        onPress={handleNearMePress}
      />
      
      {FOOD_CATEGORIES.map((cat) => (
        <FilterChip
          key={cat.id}
          label={cat.label}
          isActive={filters.category === cat.id}
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
