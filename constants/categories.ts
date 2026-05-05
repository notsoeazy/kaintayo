import type { FoodCategory } from "@/types";

export interface CategoryMeta {
  id: FoodCategory;
  label: string;
}

export const FOOD_CATEGORIES: CategoryMeta[] = [
  { id: "silog", label: "Silog" },
  { id: "merienda", label: "Merienda" },
  { id: "turo-turo", label: "Turo-Turo" },
  { id: "karinderya", label: "Karinderya" },
  { id: "snacks", label: "Snacks" },
  { id: "ulam", label: "Ulam" },
  { id: "street food", label: "Street Food" },
  { id: "fastfood", label: "Fast Food" },
  { id: "empty", label: "Empty" }
];
