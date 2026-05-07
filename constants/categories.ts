import type { FoodCategory } from "@/types";

export interface CategoryMeta {
  id: FoodCategory;
  label: string;
  emoji: string;
}

export const FOOD_CATEGORIES: CategoryMeta[] = [
  { id: "silog",       label: "Silog",           emoji: "🍳" },
  { id: "turo-turo",   label: "Turo-Turo",        emoji: "👆" },
  { id: "carinderia",  label: "Carinderia",       emoji: "🍱" },
  { id: "street-food", label: "Street Food",      emoji: "🍢" },
  { id: "ihaw-ihaw",   label: "Ihaw",             emoji: "🔥" },
  { id: "merienda",    label: "Merienda",         emoji: "🧁" },
  { id: "fastfood",    label: "Fast Food",        emoji: "🍔" },
  { id: "kape-inumin", label: "Kape & Inumin",    emoji: "☕" },
  { id: "bakery",      label: "Tinapay & Pastry", emoji: "🥐" },
  { id: "seafood",     label: "Seafood",          emoji: "🦐" },
];
