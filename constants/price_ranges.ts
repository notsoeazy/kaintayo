import { Colors } from "@/styles/theme";
import type { PriceTier } from "@/types";

// Per-tier background tints using the existing palette
export const TIER_COLORS: Record<PriceTier, string> = {
  'very-budget': 'rgba(94, 158, 106, 0.15)',   // Pandan Sage tint
  'affordable':  'rgba(74, 155, 148, 0.15)',   // Tindahan Teal tint
  'moderate':    'rgba(232, 168, 56, 0.15)',   // Sorbetes Yellow tint
  'expensive':   'rgba(194, 91, 78, 0.15)',    // Ribbon Red tint
};

// Solid opaque colors for use on-image overlays
export const TIER_SOLID_COLORS: Record<PriceTier, string> = {
  'very-budget': '#4a8a58',
  'affordable':  '#2e7d78',
  'moderate':    '#b87d10',
  'expensive':   '#a83828',
};

export const TIER_TEXT_COLORS: Record<PriceTier, string> = {
  'very-budget': Colors.success,
  'affordable':  Colors.accent,
  'moderate':    Colors.primary,
  'expensive':   Colors.secondary,
};

// White text for all tiers on dark solid backgrounds
export const TIER_SOLID_TEXT_COLORS: Record<PriceTier, string> = {
  'very-budget': '#ffffff',
  'affordable':  '#ffffff',
  'moderate':    '#ffffff',
  'expensive':   '#ffffff',
};

export interface PriceRangeMeta {
  id: PriceTier;
  label: string;
  min: number;
  max: number;
  symbol: string;
}

export const PRICE_TIERS: PriceRangeMeta[] = [
  { id: "very-budget", label: "Very Budget", min: 50, max: 100, symbol: '₱' },
  { id: "affordable", label: "Affordable", min: 100, max: 200, symbol: '₱₱' },
  { id: "moderate", label: "Moderate", min: 200, max: 350, symbol: '₱₱₱' },
  { id: "expensive", label: "Expensive", min: 350, max: Infinity, symbol: '₱₱₱₱' },
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

// Returns the PriceRangeMeta for a given tier id
export function getTierMeta(id: PriceTier): PriceRangeMeta | undefined {
  return PRICE_TIERS.find((t) => t.id === id);
}

// Returns a compact range string e.g. "₱50–₱100" or "₱350+" for expensive
export function getTierRangeLabel(id: PriceTier): string {
  const tier = getTierMeta(id);
  if (!tier) return '';
  const max = tier.max === Infinity ? '₱350+' : `₱${tier.max}`;
  return `₱${tier.min}–${max}`;
}


