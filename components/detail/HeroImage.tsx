/*
Usage:
<HeroImage photoUrl={photoUrl} />
*/
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing } from '@/styles/theme';

interface HeroImageProps {
  photoUrl?: string;
}

export const HeroImage = React.memo(function HeroImage({ photoUrl }: HeroImageProps) {
  return (
    <View style={styles.container}>
      {photoUrl ? (
        <Image
          source={photoUrl}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.gradientBottom} />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
        <ChevronLeft size={22} color={Colors.text} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Colors.linen,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(250, 243, 232, 0.8)',
  },
  backButton: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(250, 243, 232, 0.88)',
    borderRadius: Radius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
