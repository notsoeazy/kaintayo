import type { PriceTier } from '@/types';

export const MIN_VOTES_THRESHOLD = 1;

const TIER_RANK: Record<PriceTier, number> = {
  'very-budget': 0,
  affordable: 1,
  moderate: 2,
  expensive: 3,
};

// Returns the tier with the most votes.
// On a tie, picks the highest-ranked tier among the tied ones.
export function computeWinningTier(
  tally: Record<PriceTier, number>,
): PriceTier | null {
  let max = 0;
  const tied: PriceTier[] = [];

  for (const [tier, count] of Object.entries(tally) as [PriceTier, number][]) {
    if (count > max) {
      max = count;
      tied.length = 0;
      tied.push(tier);
    } else if (count === max && max > 0) {
      tied.push(tier);
    }
  }

  if (max === 0) return null;
  return tied.reduce((a, b) => (TIER_RANK[a] >= TIER_RANK[b] ? a : b));
}

// Returns the effective tier to display across all UI surfaces
export function getEffectivePriceTier(place: {
  priceTier: PriceTier;
  communityPriceTier?: PriceTier | null;
  totalVotes?: number;
}): { tier: PriceTier; isCommunity: boolean } {
  const hasConsensus =
    (place.totalVotes ?? 0) >= MIN_VOTES_THRESHOLD &&
    place.communityPriceTier != null;

  return hasConsensus
    ? { tier: place.communityPriceTier!, isCommunity: true }
    : { tier: place.priceTier, isCommunity: false };
}
