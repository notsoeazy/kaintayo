import { computeWinningTier, getEffectivePriceTier, MIN_VOTES_THRESHOLD } from '@/lib/price_consensus_utils';
import type { PriceTier } from '@/types';

const emptyTally = (): Record<PriceTier, number> => ({
  'very-budget': 0,
  affordable: 0,
  moderate: 0,
  expensive: 0,
});

describe('price_consensus_utils - computeWinningTier', () => {
  it('returns null when all vote counts are zero', () => {
    const result = computeWinningTier(emptyTally());
    expect(result).toBeNull();
  });

  it('returns the tier with the most votes', () => {
    const tally = { ...emptyTally(), affordable: 5, moderate: 2 };
    expect(computeWinningTier(tally)).toBe('affordable');
  });

  it('on a tie, returns the highest-ranked tier', () => {
    // moderate (rank 2) beats affordable (rank 1) on a tie
    const tally = { ...emptyTally(), affordable: 3, moderate: 3 };
    expect(computeWinningTier(tally)).toBe('moderate');
  });

  it('returns the single voted tier when only one tier has votes', () => {
    const tally = { ...emptyTally(), 'very-budget': 1 };
    expect(computeWinningTier(tally)).toBe('very-budget');
  });

  it('on a three-way tie, returns the highest-ranked among them', () => {
    const tally = { ...emptyTally(), 'very-budget': 2, affordable: 2, moderate: 2 };
    expect(computeWinningTier(tally)).toBe('moderate');
  });
});

describe('price_consensus_utils - getEffectivePriceTier', () => {
  it('returns base priceTier with isCommunity false when totalVotes is below threshold', () => {
    const place = {
      priceTier: 'affordable' as PriceTier,
      communityPriceTier: 'moderate' as PriceTier,
      totalVotes: MIN_VOTES_THRESHOLD - 1,
    };
    const result = getEffectivePriceTier(place);
    expect(result.tier).toBe('affordable');
    expect(result.isCommunity).toBe(false);
  });

  it('returns communityPriceTier with isCommunity true when votes meet threshold', () => {
    const place = {
      priceTier: 'affordable' as PriceTier,
      communityPriceTier: 'moderate' as PriceTier,
      totalVotes: MIN_VOTES_THRESHOLD,
    };
    const result = getEffectivePriceTier(place);
    expect(result.tier).toBe('moderate');
    expect(result.isCommunity).toBe(true);
  });

  it('returns base priceTier when communityPriceTier is null even with enough votes', () => {
    const place = {
      priceTier: 'very-budget' as PriceTier,
      communityPriceTier: null,
      totalVotes: MIN_VOTES_THRESHOLD + 5,
    };
    const result = getEffectivePriceTier(place);
    expect(result.tier).toBe('very-budget');
    expect(result.isCommunity).toBe(false);
  });

  it('treats missing totalVotes as 0 — returns base tier', () => {
    const place = {
      priceTier: 'moderate' as PriceTier,
      communityPriceTier: 'affordable' as PriceTier,
    };
    const result = getEffectivePriceTier(place);
    expect(result.tier).toBe('moderate');
    expect(result.isCommunity).toBe(false);
  });
});
