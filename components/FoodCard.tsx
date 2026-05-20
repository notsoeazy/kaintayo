/* 
Usage: 
<FoodCard 
  place={item} 
  distance={item.distance} 
  onPress={(place) => console.log(place.name)} 
/>
*/

import { Image } from 'expo-image';
import { CheckCircle2, Heart, MapPin } from 'lucide-react-native';
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
  const initialIsTried = useRef(isTried).current;
  const { tier: effectiveTier } = getEffectivePriceTier(place);
  
  const baseTriedCount = Math.max(0, place.triedCount || 0);
  const displayTriedCount = Math.max(0, baseTriedCount + (isTried && !initialIsTried ? 1 : (!isTried && initialIsTried ? -1 : 0)));
  
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
          
          {/* TOP ACTIONS ROW */}
          <View style={styles.topActionsRow}>
            <TouchableWithoutFeedback testID="wishlist-button" onPress={handleWishlistToggle}>
              <View style={styles.wishlistBadge}>
                <Heart 
                  size={18} 
                  color={isWishlisted ? Colors.secondary : Colors.text} 
                  fill={isWishlisted ? Colors.secondary : 'transparent'}
                  strokeWidth={2}
                />
              </View>
            </TouchableWithoutFeedback>

            <PriceBadge 
              tier={effectiveTier}
              variant="on-image"
              containerStyle={styles.priceBadgeShadow}
            />
          </View>
        </View>

        {/* CONTENT SECTION */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {place.name}
          </Text>

          {place.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {place.description}
            </Text>
          ) : null}

          {place.categories.length > 0 && (
            <View style={styles.categoriesRow}>
              {place.categories.map((cat) => (
                <CategoryChip key={cat} category={cat} />
              ))}
            </View>
          )}

          {/* FOOTER ACTIONS */}
          <View style={[styles.footerRow, { justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm }]}>
            {distance !== undefined ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={14} color={Colors.muted} style={{ marginRight: 4 }} />
                <Text style={styles.distanceText}>{distance.toFixed(1)} {t.foodCard.distanceAway}</Text>
              </View>
            ) : (
              <View />
            )}

            <TouchableWithoutFeedback testID="tried-button" onPress={handleTriedToggle}>
              <View style={styles.actionButton}>
                <CheckCircle2 
                  size={18} 
                  color={isTried ? Colors.success : Colors.muted} 
                  strokeWidth={2}
                />
                <Text style={[styles.actionText, isTried && { color: Colors.success, fontFamily: FontFamily.bodyMedium }]}>
                  {isTried ? t.foodCard.triedItYes : t.foodCard.triedItNo} ({displayTriedCount})
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
  content: {
    padding: Spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  topActionsRow: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  wishlistBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Radius.sm,
    elevation: 2,
  },
  priceBadgeShadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Radius.sm,
    elevation: 2,
  },
  title: {
    ...Typography.title,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    color: Colors.muted,
    lineHeight: 18,
  },
  distanceText: {
    ...Typography.caption,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
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
