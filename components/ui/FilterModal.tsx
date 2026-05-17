/*
Usage:
<FilterModal
  visible={isFilterVisible}
  onClose={() => setIsFilterVisible(false)}
/>
*/

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography, FontFamily, FontSize } from '@/styles/theme';
import { useFeedStore } from '@/store/feed_store';
import { FOOD_CATEGORIES } from '@/constants/categories';
import { PRICE_TIERS } from '@/constants/price_ranges';
import { useTranslation } from '@/hooks/useTranslation';
import type { FoodCategory, PriceTier } from '@/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function FilterModal({ visible, onClose }: FilterModalProps) {
  const { filters, setFilter, toggleCategory, resetFilters } = useFeedStore();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [internalVisible, setInternalVisible] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const DISTANCE_OPTIONS = [
    { label: t.filterModal.distance3km, value: 3 },
    { label: t.filterModal.distance5km, value: 5 },
    { label: t.filterModal.distance10km, value: 10 },
    { label: t.filterModal.distanceAnywhere, value: null },
  ];

  const PRICE_LABEL_MAP: Record<PriceTier, string> = {
    'very-budget': t.filterModal.priceVeryBudget,
    'affordable':  t.filterModal.priceAffordable,
    'moderate':    t.filterModal.priceModerate,
    'expensive':   t.filterModal.priceExpensive,
  };

  const PRICE_OPTIONS = PRICE_TIERS.map((tier) => ({
    label: PRICE_LABEL_MAP[tier.id],
    value: tier.id,
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > SCREEN_HEIGHT / 4 || gs.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 12,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 12,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setInternalVisible(false));
    }
  }, [visible, opacity, translateY]);

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* BACKDROP */}
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* BOTTOM SHEET */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>

          {/* DRAG AREA — only this zone activates the pan gesture */}
          <Animated.View {...panResponder.panHandlers} style={styles.dragArea}>
            <View style={styles.dragHandle} />
          </Animated.View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{t.filterModal.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={12}>
              <X size={20} color={Colors.muted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* FILTER CONTENT */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* DISTANCE */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t.filterModal.distanceLabel}</Text>
              <View style={styles.chipRow}>
                {DISTANCE_OPTIONS.map((opt) => {
                  const isActive = filters.maxDistance === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setFilter('maxDistance', opt.value)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* PRICE */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t.filterModal.priceLabel}</Text>
              <View style={styles.chipRow}>
                {PRICE_OPTIONS.map((opt) => {
                  const isActive = filters.priceTier === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setFilter('priceTier', isActive ? null : opt.value)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* CATEGORIES */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t.filterModal.categoryLabel}</Text>
              <View style={styles.chipRow}>
                {FOOD_CATEGORIES.map((cat) => {
                  const isActive = filters.categories.includes(cat.id);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleCategory(cat.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                        {cat.emoji} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.sm }]}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters} activeOpacity={0.7}>
              <Text style={styles.resetText}>{t.filterModal.resetButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.applyText}>{t.filterModal.applyButton}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 26, 14, 0.45)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: '88%',
  },

  // DRAG HANDLE ZONE
  dragArea: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.text,
    letterSpacing: 1,
  },
  closeButton: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.full,
    padding: Spacing.xs,
  },

  // CONTENT
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.linen,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.white,
    fontFamily: FontFamily.bodyMedium,
  },

  // FOOTER
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  resetButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.md,
    color: Colors.muted,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.white,
    letterSpacing: 1,
  },
});
