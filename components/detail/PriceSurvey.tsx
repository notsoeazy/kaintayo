import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
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

export const PriceSurvey = React.memo(function PriceSurvey({ voteTally, userVote, isVoting, canVote, onVote }: PriceSurveyProps) {
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
          const isSelected = userVote === tier.id;

          return (
            <TouchableOpacity
              key={tier.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => canVote && !isVoting && onVote(tier.id)}
              activeOpacity={canVote ? 0.72 : 1}
              disabled={!canVote || isVoting}
            >
              {/* RADIO / CHECK */}
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <Check size={11} color={Colors.bg} strokeWidth={3} />}
              </View>

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

              {/* PROGRESS BAR */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${pct}%` as any },
                    isSelected && styles.barFillSelected,
                  ]}
                />
              </View>

              {/* VOTE COUNT */}
              <Text style={[styles.voteCount, isSelected && styles.voteCountSelected]}>
                {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* GATE HINT */}
      {!canVote && (
        <Text style={styles.gateHint}>
          {t.detailScreen.priceSurveyGateHint}
        </Text>
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    width: 56,
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
  gateHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
