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
  communityPriceTier: PriceTier | null;
  totalVotes: number;
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

// User profile document stored at users/{uid}
export interface UserProfile {
  uid: string;
  username: string;
  photoUrl: string;            // Cloud Storage download URL
  updatedAt: Timestamp | null;
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
  maxDistance?: number | null; // e.g. 3, 5, 10, or null for limitless
}

// GEOCODING

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// SOCIAL

export type FriendStatus = 'pending_sent' | 'pending_received' | 'accepted';

export interface FriendEntry {
  uid: string;
  username: string;
  photoUrl: string;
  status: FriendStatus;
  updatedAt: Timestamp | null;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface InviteEntry {
  id: string;
  fromUid: string;
  fromUsername: string;
  toUid: string;
  toUsername: string;
  placeId: string;
  placeName: string;
  status: InviteStatus;
  createdAt: Timestamp | null;
}

