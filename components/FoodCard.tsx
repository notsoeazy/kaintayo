/* 
Usage: 
<FoodCard 
  place={item} 
  distance={item.distance} 
  onPress={(place) => console.log(place.name)} 
/>
*/

import { Image } from 'expo-image';
import { CheckCircle2, Heart, MapPin, Star } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';


import { useDetailsNavigation } from '@/hooks/details_screen_hook';
import { useTranslation } from '@/hooks/useTranslation';
import { getEffectivePriceTier } from '@/lib/price_consensus_utils';
import { useAuthStore } from '@/store/auth_store';
import { useListStore } from '@/store/list_store';
import { Colors, FontFamily, Radius, Spacing, Typography } from '@/styles/theme';
import type { Place } from '@/types';
import { CategoryChip } from './ui/CategoryChip';
import { PriceBadge } from './ui/PriceBadge';

export interface FoodCardProps {
  place: Place;
  distance?: number;
}

const FoodCardComponent = ({ place, distance }: FoodCardProps) => {
  const { user } = useAuthStore();
  const { wishlistIds, toggleWishlist, triedIds, toggleTried } = useListStore();
  const { t } = useTranslation();
  const { openDetailsForPlace } = useDetailsNavigation();
  
  const isWishlisted = wishlistIds.includes(place.id);
  const isTried = triedIds.includes(place.id);
  const { tier: effectiveTier } = getEffectivePriceTier(place);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handleWishlistToggle = () => {
    if (user) toggleWishlist(user.uid, place.id);
  };


  const handleTriedToggle = () => {
    if (user) toggleTried(user.uid, place.id);
  };


  return (
    <TouchableWithoutFeedback
      onPress={() => openDetailsForPlace(place)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* IMAGE SECTION */}
        <View style={styles.imageContainer}>
          {place.photoUrl ? (
            <Image
              source={place.photoUrl}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.image, { backgroundColor: Colors.linen }]} />
          )}
          <View style={styles.imageOverlay} />
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.categoriesRow}>
              {place.categories.length > 0 ? (
                <CategoryChip category={place.categories[0]} />
              ) : null}
              {place.categories.length > 1 && (
                <View style={styles.extraCategoriesPill}>
                  <Text style={styles.extraCategoriesText}>
                    +{place.categories.length - 1}
                  </Text>
                </View>
              )}
            </View>
            {!place.isSeeded && (
              <View style={styles.seedBadge}>
                <Star size={10} color={Colors.primary} fill={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.seedBadgeText}>{t.foodCard.communityAdded}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {place.name}
          </Text>

          <View style={styles.detailsRow}>
            <PriceBadge 
              tier={effectiveTier}
            />
            {distance !== undefined && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={14} color={Colors.muted} style={{ marginRight: 4 }} />
                <Text style={styles.distanceText}>{distance.toFixed(1)} {t.foodCard.distanceAway}</Text>
              </View>
            )}
          </View>

          {/* FOOTER ACTIONS */}
          <View style={styles.footerRow}>
            <TouchableWithoutFeedback onPress={handleWishlistToggle}>
              <View style={styles.actionButton}>
                <Heart 
                  size={18} 
                  color={isWishlisted ? Colors.secondary : Colors.muted} 
                  fill={isWishlisted ? Colors.secondary : 'transparent'}
                  strokeWidth={2}
                />
                <Text style={[styles.actionText, isWishlisted && styles.actionTextActive]}>
                  {place.likes + (isWishlisted ? 1 : 0)}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleTriedToggle}>
              <View style={styles.actionButton}>
                <CheckCircle2 
                  size={18} 
                  color={isTried ? Colors.success : Colors.muted} 
                  strokeWidth={2}
                />
                <Text style={[styles.actionText, isTried && { color: Colors.success, fontFamily: FontFamily.bodyMedium }]}>
                  {isTried ? t.foodCard.triedItYes : t.foodCard.triedItNo}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const FoodCard = React.memo(FoodCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: Radius.sm,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: Colors.linen,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(250, 243, 232, 0.4)', // Capiz Cream with opacity for signage effect
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  extraCategoriesPill: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 1,
  },
  extraCategoriesText: {
    fontFamily: FontFamily.bodyMedium,
    color: Colors.bg,
    fontSize: 11,
  },
  title: {
    ...Typography.title,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  distanceText: {
    ...Typography.caption,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.xs,
  },
  actionText: {
    ...Typography.caption,
  },
  actionTextActive: {
    color: Colors.secondary,
  },
  seedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 168, 56, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  seedBadgeText: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 10,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
});
