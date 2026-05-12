import { db } from "@/lib/firebase_service";
import type { LikeEntry, Place, PriceTier, TriedEntry, WishlistEntry } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

// COLLECTION REFERENCES
const PLACES_COL = "places";
const userTriedCol = (uid: string) => `users/${uid}/tried`;
const userWishlistCol = (uid: string) => `users/${uid}/wishlist`;
const userLikesCol = (uid: string) => `users/${uid}/likes`;

// PLACES

// Fetch all places from Firestore ordered by newest first
export async function getPlaces(): Promise<Place[]> {
  const q = query(collection(db, PLACES_COL), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Place[];
}

// Fetch a single place by its document ID
export async function getPlaceById(id: string): Promise<Place | null> {
  const docSnap = await getDoc(doc(db, PLACES_COL, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Place;
}

// Add a community submitted place to Firestore
export async function addPlace(
  place: Omit<Place, "id" | "createdAt" | "likes">,
): Promise<string> {
  const docRef = await addDoc(collection(db, PLACES_COL), {
    ...place,
    likes: 0,
    isSeeded: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Increment like count for a place
export async function likePlace(placeId: string): Promise<void> {
  await updateDoc(doc(db, PLACES_COL, placeId), {
    likes: increment(1),
  });
}

// USER LISTS

// Record a place as tried by the user
export async function addToTried(uid: string, placeId: string): Promise<void> {
  const entry: Omit<TriedEntry, "placeId"> & { placeId: string } = {
    placeId,
    triedAt: Timestamp.now(),
  };
  await addDoc(collection(db, userTriedCol(uid)), entry);
}

// Add a place to the user's wishlist
export async function addToWishlist(
  uid: string,
  placeId: string,
): Promise<void> {
  const entry: Omit<WishlistEntry, "placeId"> & { placeId: string } = {
    placeId,
    savedAt: Timestamp.now(),
  };
  await addDoc(collection(db, userWishlistCol(uid)), entry);
}

// Like a place and update user likes and global count
export async function addLike(uid: string, placeId: string): Promise<void> {
  const entry: Omit<LikeEntry, "placeId"> & { placeId: string } = {
    placeId,
    likedAt: Timestamp.now(),
  };
  await Promise.all([
    addDoc(collection(db, userLikesCol(uid)), entry),
    likePlace(placeId),
  ]);
}

// Get all tried place IDs for a user
export async function getUserTried(uid: string): Promise<string[]> {
  const snapshot = await getDocs(collection(db, userTriedCol(uid)));
  return snapshot.docs.map((d) => (d.data() as TriedEntry).placeId);
}

// Get all wishlist place IDs for a user
export async function getUserWishlist(uid: string): Promise<string[]> {
  const snapshot = await getDocs(collection(db, userWishlistCol(uid)));
  return snapshot.docs.map((d) => (d.data() as WishlistEntry).placeId);
}

// PLACE PHOTOS

const placePhotosCol = (placeId: string) => `places/${placeId}/photos`;
const priceVotesCol = (placeId: string) => `places/${placeId}/priceVotes`;

// Fetch all user-submitted photo URLs newest first
export async function getPlacePhotos(placeId: string): Promise<string[]> {
  const q = query(collection(db, placePhotosCol(placeId)), orderBy("uploadedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => (d.data() as { url: string }).url);
}

// Save a newly uploaded photo URL
export async function addPlacePhoto(
  placeId: string,
  url: string,
  uid: string,
): Promise<void> {
  await addDoc(collection(db, placePhotosCol(placeId)), {
    url,
    uploadedBy: uid,
    uploadedAt: Timestamp.now(),
  });
}

// PRICE VOTES

// Upsert a price tier vote
export async function votePriceTier(
  placeId: string,
  uid: string,
  tier: PriceTier,
): Promise<void> {
  await setDoc(doc(db, priceVotesCol(placeId), uid), {
    tier,
    votedAt: Timestamp.now(),
  });
}

// Get the current vote
export async function getUserPriceVote(
  placeId: string,
  uid: string,
): Promise<PriceTier | null> {
  const docSnap = await getDoc(doc(db, priceVotesCol(placeId), uid));
  if (!docSnap.exists()) return null;
  return (docSnap.data() as { tier: PriceTier }).tier;
}

// Count votes per tier and return a tally
export async function getPriceVoteTally(
  placeId: string,
): Promise<Record<PriceTier, number>> {
  const snapshot = await getDocs(collection(db, priceVotesCol(placeId)));
  const tally: Record<PriceTier, number> = {
    'very-budget': 0,
    affordable: 0,
    moderate: 0,
    expensive: 0,
  };
  snapshot.docs.forEach((d) => {
    const tier = (d.data() as { tier: PriceTier }).tier;
    if (tier in tally) tally[tier]++;
  });
  return tally;
}
