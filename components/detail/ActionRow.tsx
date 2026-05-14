/*
Usage:
<ActionRow
  isWishlisted={isWishlisted}
  isTried={isTried}
  onWishlist={handleWishlist}
  onTried={handleTried}
/>
*/

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, CheckCircle2 } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface ActionRowProps {
  isWishlisted: boolean;
  isTried: boolean;
  onWishlist: () => void;
  onTried: () => void;
}

export const ActionRow = React.memo(function ActionRow({
  isWishlisted,
  isTried,
  onWishlist,
  onTried,
}: ActionRowProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* WISHLIST CARD */}
      <TouchableOpacity
        style={[
          styles.card,
          isWishlisted ? styles.cardActiveWishlist : styles.cardInactiveWishlist
        ]}
        onPress={onWishlist}
        activeOpacity={0.7}
      >
        <Heart 
          size={24} 
          color={isWishlisted ? '#FFF' : Colors.secondary} 
          fill={isWishlisted ? '#FFF' : 'transparent'}
          strokeWidth={2}
        />
        <Text style={[
          styles.label,
          isWishlisted ? styles.labelActive : styles.labelInactiveWishlist
        ]}>
          {isWishlisted ? t.detailScreen.wishlistDone : t.detailScreen.wishlistButton}
        </Text>
      </TouchableOpacity>

      {/* TRIED CARD */}
      <TouchableOpacity
        style={[
          styles.card,
          isTried ? styles.cardActiveTried : styles.cardInactiveTried
        ]}
        onPress={onTried}
        activeOpacity={0.7}
      >
        <CheckCircle2 
          size={24} 
          color={isTried ? '#FFF' : Colors.success} 
          strokeWidth={2}
        />
        <Text style={[
          styles.label,
          isTried ? styles.labelActive : styles.labelInactiveTried
        ]}>
          {isTried ? t.detailScreen.triedDone : t.detailScreen.triedButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  card: {
    flex: 1,
    height: 90,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
  },
  cardInactiveWishlist: {
    backgroundColor: 'rgba(194, 91, 78, 0.08)',
    borderColor: 'rgba(194, 91, 78, 0.15)',
  },
  cardInactiveTried: {
    backgroundColor: 'rgba(94, 158, 106, 0.08)',
    borderColor: 'rgba(94, 158, 106, 0.15)',
  },
  cardActiveWishlist: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    elevation: 4,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardActiveTried: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
    elevation: 4,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  labelInactiveWishlist: {
    color: Colors.secondary,
    opacity: 0.8,
  },
  labelInactiveTried: {
    color: Colors.success,
    opacity: 0.8,
  },
  labelActive: {
    color: '#FFF',
  },
});
