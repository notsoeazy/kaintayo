import type { PriceTier } from "@/types";

export interface PriceRangeMeta {
  id: PriceTier;
  label: string;
  min: number;
  max: number;
}

export const PRICE_TIERS: PriceRangeMeta[] = [
  { id: "very-budget", label: "Very Budget", min: 50, max: 100 },
  { id: "affordable", label: "Affordable", min: 100, max: 200 },
  { id: "moderate", label: "Moderate", min: 200, max: 350 },
  { id: "expensive", label: "Expensive", min: 350, max: Infinity },
];

export function placeMatchesPriceTier(
  priceMin: number,
  priceMax: number,
  tier: PriceTier,
): boolean {
  const range = PRICE_TIERS.find((t) => t.id === tier);
  if (!range) return false;
  return priceMin <= range.max && priceMax >= range.min;
}

export function formatPriceRange(min: number, max: number): string {
  return `₱${min} – ₱${max}`;
}
