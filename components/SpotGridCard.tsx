/*
Usage:
<SpotGridCard place={place} />
*/

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import type { Place } from '@/types';

interface SpotGridCardProps {
  place: Place;
}

export function SpotGridCard({ place }: SpotGridCardProps) {
  return (
    <View style={styles.card}>
      {place.photoUrl ? (
        <Image
          source={place.photoUrl}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      {/* NAME OVERLAY */}
      <View style={styles.overlay}>
        <Text style={styles.name} numberOfLines={2}>
          {place.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.9,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.linen,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.linen,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(44, 26, 14, 0.55)',
  },
  name: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.surface,
    lineHeight: 15,
  },
});
