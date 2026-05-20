/*
Usage:
<PriceSurvey
  voteTally={voteTally}
  userVote={userVote}
  isVoting={isVoting}
  canVote={canVote}
  onVote={handleVote}
/>
*/
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Check, Utensils } from 'lucide-react-native';

import { PRICE_TIERS, type PriceRangeMeta } from '@/constants/price_ranges';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import type { PriceTier } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface PriceSurveyProps {
  voteTally: Record<PriceTier, number>;
  userVote: PriceTier | null;
  isVoting: boolean;
  canVote: boolean;
  onVote: (tier: PriceTier) => void;
}

// Animated progress bar for a single tier
function AnimatedBar({ pct, isSelected }: { pct: number; isSelected: boolean }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[
          styles.barFill,
          { width: widthInterpolated },
          isSelected && styles.barFillSelected,
        ]}
      />
    </View>
  );
}

export const PriceSurvey = React.memo(function PriceSurvey({
  voteTally,
  userVote,
  isVoting,
  canVote,
  onVote,
}: PriceSurveyProps) {
  const { t } = useTranslation();
  const totalVotes = Object.values(voteTally).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <Text style={styles.sectionLabel}>{t.detailScreen.priceSurveyLabel}</Text>
      <Text style={styles.title}>{t.detailScreen.priceSurveyTitle}</Text>
      {canVote ? (
        <Text style={styles.subtitle}>{t.detailScreen.priceSurveySubtitle}</Text>
      ) : (
        <Text style={styles.subtitle}>
          {totalVotes > 0
            ? t.detailScreen.priceSurveyCommunityVotes.replace('{{count}}', totalVotes.toString())
            : t.detailScreen.priceSurveyNoVotes}
        </Text>
      )}

      {/* SURVEY OPTIONS */}
      <View style={styles.optionsList}>
        {PRICE_TIERS.map((tier: PriceRangeMeta) => {
          const count = voteTally[tier.id] ?? 0;
          const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          const isSelected = canVote && userVote === tier.id;

          return (
            <TouchableOpacity
              key={tier.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => canVote && !isVoting && onVote(tier.id)}
              activeOpacity={canVote ? 0.72 : 1}
              disabled={!canVote || isVoting}
            >
              {/* LABEL + RANGE */}
              <View style={styles.labelGroup}>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {tier.id === 'very-budget' && t.common.priceTiers.veryBudget}
                  {tier.id === 'affordable' && t.common.priceTiers.affordable}
                  {tier.id === 'moderate' && t.common.priceTiers.moderate}
                  {tier.id === 'expensive' && t.common.priceTiers.expensive}
                </Text>
                <Text style={styles.range}>
                  ₱{tier.min}–{tier.max === Infinity ? '350+' : tier.max}
                </Text>
              </View>

              {/* ANIMATED PROGRESS BAR */}
              <AnimatedBar pct={pct} isSelected={isSelected} />

              {/* VOTE COUNT */}
              <Text style={[styles.voteCount, isSelected && styles.voteCountSelected]}>
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* VOTED CONFIRMATION */}
      {canVote && userVote && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md }}>
          <Check size={16} color={Colors.success} style={{ marginRight: 6 }} />
          <Text style={styles.votedConfirm}>{t.detailScreen.priceSurveyVoted}</Text>
        </View>
      )}


      {/* GATE HINT */}
      {!canVote && (
        <View style={styles.gateHintCard}>
          <Utensils size={14} color={Colors.muted} style={{ marginBottom: 4 }} />
          <Text style={styles.gateHint}>{t.detailScreen.priceSurveyGateHint}</Text>
        </View>
      )}

    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.lg,
    color: Colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing.md,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(232, 168, 56, 0.06)',
  },
  labelGroup: {
    flex: 1,
  },
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  labelSelected: {
    color: Colors.primary,
  },
  range: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  barTrack: {
    width: 80,
    height: 6,
    backgroundColor: Colors.linen,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
  },
  barFillSelected: {
    backgroundColor: Colors.primary,
  },
  voteCount: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.xs,
    color: Colors.muted,
    minWidth: 20,
    textAlign: 'right',
  },
  voteCountSelected: {
    color: Colors.primary,
    fontFamily: FontFamily.bodyMedium,
  },
  votedConfirm: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.success,
    textAlign: 'center',
  },

  gateHintCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.linen,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  gateHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
  },
});
