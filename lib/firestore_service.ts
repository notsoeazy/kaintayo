import { db } from "@/lib/firebase_service";
import type { LikeEntry, Place, PriceTier, TriedEntry, WishlistEntry } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
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
const priceVotesCol = (placeId: string) => `places/${placeId}/priceVotes`;
const placePhotosCol = (placeId: string) => `places/${placeId}/photos`;

// PLACES

// Fetch all places from Firestore ordered by newest first
export async function getPlaces(): Promise<Place[]> {
  const q = query(collection(db, PLACES_COL), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Place);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const docSnap = await getDoc(doc(db, PLACES_COL, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Place;
}

// Add a community submitted place to Firestore
export async function addPlace(place: Omit<Place, "id" | "createdAt" | "likes">): Promise<string> {
  const docRef = await addDoc(collection(db, PLACES_COL), {
    ...place,
    createdAt: Timestamp.now(),
    likes: 0,
  });
  return docRef.id;
}

// Increment like count for a place
export async function likePlace(id: string): Promise<void> {
  await updateDoc(doc(db, PLACES_COL, id), {
    likes: increment(1),
  });
}

// PHOTOS

export async function getPlacePhotos(placeId: string): Promise<string[]> {
  const q = query(collection(db, placePhotosCol(placeId)), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().url as string);
}

export async function addPlacePhoto(
  placeId: string,
  url: string,
  userId: string,
): Promise<void> {
  await addDoc(collection(db, placePhotosCol(placeId)), {
    url,
    userId,
    createdAt: Timestamp.now(),
  });
}

// USER LISTS

// Record a place as tried by the user
export async function addToTried(uid: string, placeId: string): Promise<void> {
  await setDoc(doc(db, userTriedCol(uid), placeId), {
    placeId,
    triedAt: Timestamp.now(),
  });
}

export async function removeFromTried(uid: string, placeId: string): Promise<void> {
  await deleteDoc(doc(db, userTriedCol(uid), placeId));
}

// Add a place to the user's wishlist
export async function addToWishlist(
  uid: string,
  placeId: string,
): Promise<void> {
  await setDoc(doc(db, userWishlistCol(uid), placeId), {
    placeId,
    savedAt: Timestamp.now(),
  });
}

export async function removeFromWishlist(uid: string, placeId: string): Promise<void> {
  await deleteDoc(doc(db, userWishlistCol(uid), placeId));
}

// Get all tried place IDs for a user
export async function getUserTried(uid: string): Promise<string[]> {
  const snapshot = await getDocs(collection(db, userTriedCol(uid)));
  return snapshot.docs.map((d) => d.data().placeId as string);
}

// Get all wishlist place IDs for a user
export async function getUserWishlist(uid: string): Promise<string[]> {
  const snapshot = await getDocs(collection(db, userWishlistCol(uid)));
  return snapshot.docs.map((d) => d.data().placeId as string);
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

export async function removePriceVote(
  placeId: string,
  uid: string,
): Promise<void> {
  await deleteDoc(doc(db, priceVotesCol(placeId), uid));
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
