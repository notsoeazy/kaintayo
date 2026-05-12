/* 
Usage: 
<FoodCard 
  place={item} 
  distance={item.distance} 
  onPress={(place) => console.log(place.name)} 
/>
*/

import React, { useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import { CategoryChip } from './ui/CategoryChip';
import { PriceBadge } from './ui/PriceBadge';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';
import { useListStore } from '@/store/list_store';
import { useAuthStore } from '@/store/auth_store';
import { useTranslation } from '@/hooks/useTranslation';
import { useDetailsNavigation } from '@/hooks/useDetailsNavigation';
import type { Place } from '@/types';

export interface FoodCardProps {
  place: Place;
  distance?: number;
}

const FoodCardComponent = ({ place, distance }: FoodCardProps) => {
  const { user } = useAuthStore();
  const { wishlistIds, addToWishlist, triedIds, addToTried } = useListStore();
  const { t } = useTranslation();
  const { openDetailsForPlace } = useDetailsNavigation();
  
  const isWishlisted = wishlistIds.includes(place.id);
  const isTried = triedIds.includes(place.id);
  
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
    if (user && !isWishlisted) {
      addToWishlist(user.uid, place.id);
    }
  };

  const handleTriedToggle = () => {
    if (user && !isTried) {
      addToTried(user.uid, place.id);
    }
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
              <CategoryChip category={place.categories[0]} />
              {place.categories.length > 1 && (
                <Text style={styles.extraCategories}>
                  +{place.categories.length - 1}
                </Text>
              )}
            </View>
            {!place.isSeeded && (
              <View style={styles.seedBadge}>
                <Text style={styles.seedBadgeText}>{t.foodCard.communityAdded}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {place.name}
          </Text>

          <View style={styles.detailsRow}>
            <PriceBadge priceMin={place.priceMin} priceMax={place.priceMax} />
            {distance !== undefined && (
              <Text style={styles.distanceText}>📍 {distance.toFixed(1)} {t.foodCard.distanceAway}</Text>
            )}
          </View>

          {/* FOOTER ACTIONS */}
          <View style={styles.footerRow}>
            <TouchableWithoutFeedback onPress={handleWishlistToggle}>
              <View style={styles.actionButton}>
                <FontAwesome 
                  name={isWishlisted ? "heart" : "heart-o"} 
                  size={16} 
                  color={isWishlisted ? Colors.secondary : Colors.muted} 
                />
                <Text style={[styles.actionText, isWishlisted && styles.actionTextActive]}>
                  {place.likes + (isWishlisted ? 1 : 0)}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleTriedToggle}>
              <View style={styles.actionButton}>
                <FontAwesome 
                  name={isTried ? "check-circle" : "check-circle-o"} 
                  size={16} 
                  color={isTried ? Colors.success : Colors.muted} 
                />
                <Text style={[styles.actionText, isTried && { color: Colors.success }]}>
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
  extraCategories: {
    ...Typography.caption,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.muted,
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
