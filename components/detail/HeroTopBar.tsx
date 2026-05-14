/*
Usage:
<HeroTopBar
  photoUrl={place.photoUrl}
  placeName={place.name}
  onShare={handleShare}
/>
*/

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing } from '@/styles/theme';

interface HeroTopBarProps {
  photoUrl?: string;
  placeName: string;
  onShare: () => void;
}

export const HeroTopBar = React.memo(function HeroTopBar({
  photoUrl,
  placeName,
  onShare,
}: HeroTopBarProps) {
  const insets = useSafeAreaInsets();

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

      {/* TOP ACTIONS ROW */}
      <View style={[styles.topActions, { paddingTop: Math.max(insets.top, Spacing.md) + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ChevronLeft size={22} color={Colors.text} strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionPill}
          onPress={onShare}
          activeOpacity={0.8}
        >
          <Share2 size={18} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.4,
    position: 'relative',
    backgroundColor: Colors.linen,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: Colors.linen,
  },
  topActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(250, 243, 232, 0.88)',
    borderRadius: Radius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionPill: {
    backgroundColor: 'rgba(250, 243, 232, 0.88)',
    borderRadius: Radius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
