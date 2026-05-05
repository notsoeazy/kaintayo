import { Timestamp } from 'firebase/firestore';

// FOOD DOMAIN

export type FoodCategory =
  | 'silog'
  | 'merienda'
  | 'turo-turo'
  | 'karinderya'
  | 'snacks'
  | 'ulam'
  | 'street food'
  | 'fastfood'
  | 'empty';

export type PriceTier = 'very-budget' | 'affordable' | 'moderate' | 'expensive';

// FIRESTORE DOCUMENTS

export interface Place {
  id: string;
  name: string;
  category: FoodCategory;
  priceMin: number;       // Philippine Peso amounts
  priceMax: number;       // Philippine Peso amounts
  description: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  photoUrl?: string;
  likes: number;
  addedBy: string;        // Firebase user ID
  isSeeded: boolean;      // Admin seeded or community added
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
  category: FoodCategory | null;
  priceTier: PriceTier | null;
  nearMe: boolean;
}

// GEOCODING

export interface Coordinates {
  latitude: number;
  longitude: number;
}
