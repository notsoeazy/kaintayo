/* 
Usage: 
<PriceRangeInput
  minLabel="Min Price"
  maxLabel="Max Price"
  minValue={step1.priceMin}
  maxValue={step1.priceMax}
  onMinChange={(v) => setStep1((s) => ({ ...s, priceMin: v }))}
  onMaxChange={(v) => setStep1((s) => ({ ...s, priceMax: v }))}
/>
*/

import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { AppTextInput } from './AppTextInput';

interface PriceRangeInputProps {
  minLabel: string;
  maxLabel: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function PriceRangeInput({
  minLabel,
  maxLabel,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceRangeInputProps) {
  return (
    <View style={styles.priceRow}>
      <View style={styles.priceInputWrapper}>
        <Text style={styles.inputLabel}>{minLabel}</Text>
        <View>
          <Text style={styles.pricePrefix}>₱</Text>
          <AppTextInput
            style={styles.priceInput}
            placeholder="50"
            value={minValue}
            onChangeText={(v) => onMinChange(v.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>
      <View style={styles.priceInputWrapper}>
        <Text style={styles.inputLabel}>{maxLabel}</Text>
        <View>
          <Text style={styles.pricePrefix}>₱</Text>
          <AppTextInput
            style={styles.priceInput}
            placeholder="150"
            value={maxValue}
            onChangeText={(v) => onMaxChange(v.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceInputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pricePrefix: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.md,
    color: Colors.muted,
    position: 'absolute',
    left: Spacing.sm,
    top: Spacing.sm + 2,
    zIndex: 1,
  },
  priceInput: {
    paddingLeft: Spacing.lg,
  },
});
