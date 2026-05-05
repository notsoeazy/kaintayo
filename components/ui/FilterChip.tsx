/* 
Usage: 
<FilterChip
  label="Karinderya"
  isActive={true}
  onPress={() => console.log('Filter toggled')}
/>
*/

import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  type StyleProp, 
  type ViewStyle 
} from 'react-native';
import { Colors, FontFamily, Radius, Spacing, Typography } from '@/styles/theme';

export interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function FilterChip({
  label,
  isActive = false,
  onPress,
  style,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isActive && styles.chipActive,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isActive && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  text: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textActive: {
    color: Colors.bg,
  },
});
