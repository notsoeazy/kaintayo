import type { Place, PriceTier } from "@/types";

export interface RandomizerFilters {
  priceTier: PriceTier | null;
  excludeTriedIds: string[];
}

export function pickRandomPlace(
  places: Place[],
  filters: RandomizerFilters,
): Place | null {
  let candidates = places;

  if (filters.priceTier) {
    candidates = candidates.filter((p) => p.priceTier === filters.priceTier);
  }

  if (filters.excludeTriedIds.length > 0) {
    candidates = candidates.filter((p) => !filters.excludeTriedIds.includes(p.id));
  }

  if (candidates.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
