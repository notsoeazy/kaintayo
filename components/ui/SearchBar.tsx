/*
Usage:
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
/>
*/

import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Radius, Spacing, FontFamily, FontSize } from '@/styles/theme';

export const SearchBar = (props: TextInputProps) => {
  return (
    <View style={styles.container} testID="home-search-container">
      <Search size={20} color={Colors.muted} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Maghanap ng kape, sisig, o spot..."
        placeholderTextColor={Colors.muted}
        testID="home-search-input"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.text,
    padding: 0,
  },
});
