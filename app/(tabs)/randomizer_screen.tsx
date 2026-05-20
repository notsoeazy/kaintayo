import React, { useCallback, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shuffle, SlidersHorizontal } from 'lucide-react-native';

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

export default function RandomizerScreen() {
  const { places, filters } = useFeedStore();
  const { location } = useLocation();
  const { t } = useTranslation();
  const [pickedPlace, setPickedPlace] = useState<Place | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const hasActiveFilters = filters.categories.length > 0 || filters.priceTier !== null || filters.maxDistance !== 5;

  // Apply the same filter pipeline as home/map screens
  const filteredPlaces = useNearbyPlaces(places, filters, location);

  // Animation refs for button press feedback and card entrance
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(30)).current;

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

  const animateCardIn = () => {
    cardFadeAnim.setValue(0);
    cardSlideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(cardSlideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePick = useCallback(() => {
    animateButtonPress(() => {
      const result = pickRandomPlace(filteredPlaces, { priceTier: null, excludeTriedIds: [] });
      setPickedPlace(result);
      if (result) animateCardIn();
    });
  }, [filteredPlaces]);

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
          <Text style={styles.idleSubtitle}>{t.randomizerScreen.subtitle}</Text>
          {hasActiveFilters && (
            <Text style={styles.filterHint}>
              {t.randomizerScreen.filterHint(filteredPlaces.length)}
            </Text>
          )}

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
              opacity: cardFadeAnim,
              transform: [{ translateY: cardSlideAnim }],
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
