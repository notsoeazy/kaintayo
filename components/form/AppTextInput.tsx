/* 
Usage: 
<AppTextInput
  placeholder="Enter spot name"
  value={step1.name}
  onChangeText={(v) => setStep1((s) => ({ ...s, name: v }))}
  maxLength={80}
/>
*/

import React from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';

interface AppTextInputProps extends TextInputProps {
  multiline?: boolean;
}

export function AppTextInput({ multiline, style, ...props }: AppTextInputProps) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline, style]}
      placeholderTextColor={Colors.muted}
      multiline={multiline}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.linen,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
