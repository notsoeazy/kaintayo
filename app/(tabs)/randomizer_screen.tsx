import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shuffle, SlidersHorizontal } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { FoodCard } from '@/components/FoodCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterModal } from '@/components/ui/FilterModal';
import { pickRandomPlace } from '@/lib/randomizer_service';
import { useNearbyPlaces } from '@/hooks/nearby_places_hook';
import { useLocation } from '@/hooks/location_hook';
import { useFeedStore } from '@/store/feed_store';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/randomizer_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import type { Place } from '@/types';

const { width } = Dimensions.get('window');

export default function RandomizerScreen() {
  const { places, filters } = useFeedStore();
  const { location } = useLocation();
  const { t } = useTranslation();
  const [pickedPlace, setPickedPlace] = useState<Place | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Horizontal card animation ref
  const cardTranslateXAnim = useRef(new Animated.Value(0)).current;

  // Reset picked place to IDLE state when navigating away/back
  useFocusEffect(
    useCallback(() => {
      return () => {
        setPickedPlace(null);
        cardTranslateXAnim.setValue(0);
      };
    }, [])
  );

  const hasActiveFilters = filters.categories.length > 0 || filters.priceTier !== null || filters.maxDistance !== 5;

  // Apply the same filter pipeline as home/map screens
  const filteredPlaces = useNearbyPlaces(places, filters, location);

  // Animation refs for button press feedback and card entrance
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const animateButtonPress = (cb: () => void) => {
    Animated.sequence([
      Animated.spring(buttonScaleAnim, {
        toValue: 0.93,
        useNativeDriver: true,
        speed: 30,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
      }),
    ]).start(cb);
  };

  const handlePick = useCallback(() => {
    animateButtonPress(() => {
      // If a card is already visible, slide it out to the left first
      if (pickedPlace) {
        Animated.timing(cardTranslateXAnim, {
          toValue: -width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          const result = pickRandomPlace(filteredPlaces, { priceTier: null, excludeTriedIds: [] });
          setPickedPlace(result);
          
          if (result) {
            // Position the new card instantly off-screen to the right
            cardTranslateXAnim.setValue(width);
            // Slide the new card in from the right
            Animated.spring(cardTranslateXAnim, {
              toValue: 0,
              speed: 13,
              bounciness: 5,
              useNativeDriver: true,
            }).start();
          }
        });
      } else {
        // First selection (IDLE state to RESULT state transition)
        const result = pickRandomPlace(filteredPlaces, { priceTier: null, excludeTriedIds: [] });
        setPickedPlace(result);
        
        if (result) {
          // Position the new card instantly off-screen to the right
          cardTranslateXAnim.setValue(width);
          // Slide the new card in from the right
          Animated.spring(cardTranslateXAnim, {
            toValue: 0,
            speed: 13,
            bounciness: 5,
            useNativeDriver: true,
          }).start();
        }
      }
    });
  }, [filteredPlaces, pickedPlace]);

  // EMPTY STATE — no spots at all
  if (places.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<Shuffle color={Colors.muted} size={64} strokeWidth={1.5} />}
            title={t.randomizerScreen.emptyTitle}
            description={t.randomizerScreen.emptyDesc}
          />
        </View>
      </SafeAreaView>
    );
  }

  // NO RESULTS STATE — spots exist but filters eliminate all of them
  if (filteredPlaces.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t.randomizerScreen.title}</Text>
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color={hasActiveFilters ? Colors.bg : Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<SlidersHorizontal color={Colors.muted} size={64} strokeWidth={1.5} />}
            title={t.randomizerScreen.noResultsTitle}
            description={t.randomizerScreen.noResultsDesc}
          />
        </View>
        <FilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // IDLE STATE — no pick made yet, show big Kahit Saan button
  if (!pickedPlace) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t.randomizerScreen.title}</Text>
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color={hasActiveFilters ? Colors.bg : Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.idleContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.kahitSaanButton}
              onPress={handlePick}
              activeOpacity={1}
            >
              <View style={styles.kahitSaanIcon}>
                <Shuffle size={36} color={Colors.text} strokeWidth={2} />
              </View>
              <Text style={styles.kahitSaanButtonText}>
                {t.randomizerScreen.kahitSaanButton}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.idleSubtitle}>{t.randomizerScreen.subtitle}</Text>
          {hasActiveFilters && (
            <Text style={styles.filterHint}>
              {t.randomizerScreen.filterHint(filteredPlaces.length)}
            </Text>
          )}
        </View>

        <FilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // RESULT STATE — show picked spot card + re-roll button
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t.randomizerScreen.title}</Text>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setIsFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={20} color={hasActiveFilters ? Colors.bg : Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>{t.randomizerScreen.resultLabel}</Text>

        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ translateX: cardTranslateXAnim }],
            },
          ]}
        >
          <FoodCard place={pickedPlace} />
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <TouchableOpacity
            style={styles.pickAgainButton}
            onPress={handlePick}
            activeOpacity={1}
          >
            <Shuffle size={22} color={Colors.text} strokeWidth={2.5} />
            <Text style={styles.pickAgainButtonText}>
              {t.randomizerScreen.pickAgainButton}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
}
