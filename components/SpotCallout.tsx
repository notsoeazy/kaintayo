/* 
Usage: 
<SpotCallout place={place} onPress={(place) => router.push(`/detail/${place.id}`)} onClose={() => setSelected(null)} />
*/

import { useTranslation } from '@/hooks/useTranslation';
import { getEffectivePriceTier } from '@/lib/price_consensus_utils';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';
import type { Place } from '@/types';
import { Image } from 'expo-image';
import { ChevronRight, MapPin, Navigation } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PriceBadge } from './ui/PriceBadge';

interface SpotCalloutProps {
  place: (Place & { distance?: number }) | null;
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
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.cardContainer}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            {/* IMAGE */}
            <View style={styles.imageContainer}>
              {place.photoUrl ? (
                <Image
                  source={{ uri: place.photoUrl }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MapPin size={36} color={Colors.muted} />
                </View>
              )}

              {/* PRICE BADGE OVERLAY */}
              <View style={styles.priceBadgeOverlay}>
                <PriceBadge tier={effectiveTier} variant="on-image" />
              </View>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
              {/* NAME */}
              <Text style={styles.name} numberOfLines={2}>
                {place.name}
              </Text>

              {/* DESCRIPTION */}
              {place.description ? (
                <Text style={styles.description} numberOfLines={3}>
                  {place.description}
                </Text>
              ) : null}

              {/* ADDRESS */}
              {place.address ? (
                <View style={styles.metaRow}>
                  <Navigation size={12} color={Colors.muted} style={styles.metaIcon} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {place.address}
                  </Text>
                </View>
              ) : null}

              {/* DISTANCE */}
              {place.distance !== undefined ? (
                <View style={styles.metaRow}>
                  <MapPin size={12} color={Colors.muted} style={styles.metaIcon} />
                  <Text style={styles.metaText}>
                    {place.distance.toFixed(1)} {t.foodCard.distanceAway}
                  </Text>
                </View>
              ) : null}

              {/* DETAILS BUTTON */}
              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.8}
                onPress={() => onPress?.(place)}
              >
                <Text style={styles.detailsButtonText}>{t.spotCallout.detailsButton}</Text>
                <ChevronRight size={14} color={Colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </Pressable>

          {/* CALLOUT ARROW */}
          <View style={styles.arrow} />
        </View>
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
  cardContainer: {
    width: 290,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    zIndex: 10,
  },
  content: {
    padding: Spacing.md,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metaIcon: {
    marginRight: 4,
    flexShrink: 0,
  },
  metaText: {
    ...Typography.caption,
    flex: 1,
  },
  description: {
    ...Typography.caption,
    color: Colors.muted,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  detailsButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
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


