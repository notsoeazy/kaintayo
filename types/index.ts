import { Timestamp } from 'firebase/firestore';

// FOOD DOMAIN

export type FoodCategory =
  | 'silog'
  | 'turo-turo'
  | 'carinderia'
  | 'street-food'
  | 'ihaw-ihaw'
  | 'merienda'
  | 'fastfood'
  | 'kape-inumin'
  | 'bakery'
  | 'seafood';

export type PriceTier = 'very-budget' | 'affordable' | 'moderate' | 'expensive';

// FIRESTORE DOCUMENTS

export interface Place {
  id: string;
  name: string;
  categories: FoodCategory[];
  priceTier: PriceTier;
  priceMin?: number;
  priceMax?: number;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  photoUrl?: string;
  likes: number;
  createdBy: string;
  isSeeded: boolean;
  createdAt: Timestamp | null;
}

export interface TriedEntry {
  placeId: string;
  triedAt: Timestamp | null;
}

export interface WishlistEntry {
  placeId: string;
  savedAt: Timestamp | null;
}

export interface LikeEntry {
  placeId: string;
  likedAt: Timestamp | null;
}

// STATE

export interface FeedFilters {
  categories: FoodCategory[];  // multi-select; empty = show all
  priceTier: PriceTier | null;
  showAllDistances?: boolean;
}

// GEOCODING

export interface Coordinates {
  latitude: number;
  longitude: number;
}
