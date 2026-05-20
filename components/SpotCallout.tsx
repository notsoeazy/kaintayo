/* 
Usage: 
<SpotCallout place={place} onPress={(place) => router.push(`/detail/${place.id}`)} onClose={() => setSelected(null)} />
*/

import { useTranslation } from '@/hooks/useTranslation';
import { getEffectivePriceTier } from '@/lib/price_consensus_utils';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';
import type { Place } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryChip } from './ui/CategoryChip';
import { PriceBadge } from './ui/PriceBadge';

interface SpotCalloutProps {
  place: Place | null;
  onPress?: (place: Place) => void;
  onClose?: () => void;
}

export const SpotCallout = ({ place, onPress, onClose }: SpotCalloutProps) => {
  const { t } = useTranslation();
  if (!place) return null;

  const { tier: effectiveTier } = getEffectivePriceTier(place);

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* BACKDROP — tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>

          {/* IMAGE */}
          {place.photoUrl ? (
            <Image
              source={{ uri: place.photoUrl }}
              style={styles.image}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}

          {/* CONTENT */}
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <View style={styles.categoriesRow}>
                <CategoryChip category={place.categories[0]} />
                {place.categories.length > 1 && (
                  <Text style={styles.extraCategories}>+{place.categories.length - 1}</Text>
                )}
              </View>
            </View>

            <Text style={styles.name} numberOfLines={1}>{place.name}</Text>

            {place.address ? (
              <Text style={styles.address} numberOfLines={1}>📍 {place.address}</Text>
            ) : null}

            <View style={styles.footer}>
              <PriceBadge tier={effectiveTier} />
              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.8}
                onPress={() => onPress?.(place)}
              >
                <Text style={styles.detailsButtonText}>{t.spotCallout.detailsButton}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CALLOUT ARROW */}
          <View style={styles.arrow} />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: 280,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.linen,
  },
  imagePlaceholder: {
    backgroundColor: Colors.linen,
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    marginBottom: Spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraCategories: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.muted,
    fontSize: FontSize.xs,
    marginLeft: Spacing.xs,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  address: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  detailsButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.text,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.border,
    alignSelf: 'center',
    marginBottom: -1,
  },
});
