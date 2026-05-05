/* 
Usage: 
<CategoryChip category="Karinderya" />
*/

import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  type StyleProp, 
  type ViewStyle 
} from 'react-native';
import { Colors, FontFamily, Radius, Spacing, Typography } from '@/styles/theme';

export interface CategoryChipProps {
  category: string;
  style?: StyleProp<ViewStyle>;
}

export function CategoryChip({
  category,
  style,
}: CategoryChipProps) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.text}>
        {category}
      </Text>
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
