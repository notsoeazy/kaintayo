/*
Usage:
<InfoSection place={place} />
*/

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { PriceBadge } from '@/components/ui/PriceBadge';
import { Colors, FontFamily, FontSize, Radius, Spacing, Typography } from '@/styles/theme';
import type { Place } from '@/types';

const VISIBLE_TAG_COUNT = 3;

interface InfoSectionProps {
  place: Place;
}

export const InfoSection = React.memo(function InfoSection({ place }: InfoSectionProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const visibleCategories = tagsExpanded
    ? place.categories
    : place.categories.slice(0, VISIBLE_TAG_COUNT);
  const overflow = place.categories.length - VISIBLE_TAG_COUNT;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{place.name}</Text>
          {place.address ? (
            <View style={styles.addressRow}>
              <MapPin size={12} color={Colors.muted} strokeWidth={2.5} />
              <Text style={styles.address} numberOfLines={2}>{place.address}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceContainer}>
          <PriceBadge 
            tier={place.priceTier} 
            variant="pill" 
          />
        </View>
      </View>

      {/* DESCRIPTION */}
      {place.description ? (
        <Text style={styles.description}>{place.description}</Text>
      ) : null}

      {/* CATEGORY CHIPS */}
      <TouchableOpacity
        style={styles.chipsRow}
        onPress={() => setTagsExpanded(!tagsExpanded)}
        activeOpacity={0.7}
        disabled={place.categories.length <= VISIBLE_TAG_COUNT}
      >
        {visibleCategories.map((cat) => (
          <CategoryChip key={cat} category={cat} />
        ))}
        {!tagsExpanded && overflow > 0 && (
          <View style={styles.overflowPill}>
            <Text style={styles.overflowText}>+{overflow}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xxl,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: 2,
    lineHeight: 32,
  },
  priceContainer: {
    marginTop: 4,
  },
  description: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  overflowPill: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
  },
  overflowText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.bg,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  address: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    flex: 1,
    lineHeight: 18,
  },
});
