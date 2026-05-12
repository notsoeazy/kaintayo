import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { PriceBadge } from '@/components/ui/PriceBadge';
import { Colors, FontFamily, FontSize, Spacing, Typography } from '@/styles/theme';
import type { Place } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface InfoSectionProps {
  place: Place;
}

export const InfoSection = React.memo(function InfoSection({ place }: InfoSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* CATEGORY CHIPS */}
      <View style={styles.chipsRow}>
        {place.categories.map((cat) => (
          <CategoryChip key={cat} category={cat} />
        ))}
        {!place.isSeeded && (
          <View style={styles.communityBadge}>
            <Text style={styles.communityBadgeText}>{t.foodCard.communityAdded}</Text>
          </View>
        )}
      </View>

      {/* PLACE NAME */}
      <Text style={styles.name}>{place.name}</Text>

      {/* PRICE + ADDRESS ROW */}
      <View style={styles.metaRow}>
        <PriceBadge priceMin={place.priceMin} priceMax={place.priceMax} />
        {place.address ? (
          <View style={styles.addressRow}>
            <MapPin size={13} color={Colors.muted} strokeWidth={2} />
            <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
          </View>
        ) : null}
      </View>

      {/* DESCRIPTION */}
      {place.description ? (
        <Text style={styles.description}>{place.description}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  communityBadge: {
    backgroundColor: 'rgba(232, 168, 56, 0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  communityBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xxl,
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  address: {
    ...Typography.caption,
    flex: 1,
  },
  description: {
    ...Typography.subtitle,
    marginTop: Spacing.xs,
  },
});
