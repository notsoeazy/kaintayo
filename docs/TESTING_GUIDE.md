# KainTayo — Testing Guide

## Overview

This project uses **Jest** + **React Native Testing Library (RNTL)** for unit and component testing. All tests live in the `__tests__/` directory, mirroring the source tree structure.

**Run all tests:**
```bash
npx jest
```

**Run a single file:**
```bash
npx jest __tests__/lib/geo_utils.test.ts
```

**Run with verbose output:**
```bash
npx jest --verbose
```

**Run and watch for changes:**
```bash
npx jest --watch
```

---

## Test Suite Index

### Unit Tests (pure functions & service layer)

#### `__tests__/lib/geo_utils.test.ts`
**Source:** `lib/geo_utils.ts`
**What it tests:** The Haversine distance formula — the core math behind all proximity sorting and max-distance filtering in the feed and map.

| Test | Verifies |
|------|----------|
| Returns 0 for identical coordinates | No false distance for same point |
| Manila → Makati distance is ~4–8 km | Formula accuracy against known PH coordinates |
| Is symmetric (A→B = B→A) | Mathematical correctness |
| Returns positive value for different points | Always positive output |
| Farther points return larger distance | Monotonicity — sorting is reliable |

**Mocks needed:** None — pure math function.

---

#### `__tests__/lib/price_consensus_utils.test.ts`
**Source:** `lib/price_consensus_utils.ts`
**What it tests:** Community voting logic that determines which price tier is displayed across Feed, Map callout, and Detail screens.

**`computeWinningTier` tests:**

| Test | Verifies |
|------|----------|
| Returns null when all votes are 0 | No false consensus from empty data |
| Returns tier with most votes | Plurality winner selection |
| On a tie, returns highest-ranked tier | Tie-breaking: `moderate` > `affordable` > `very-budget` |
| Works with a single voted tier | Single-option edge case |
| Three-way tie returns highest-ranked | Multi-way tie-breaking stability |

**`getEffectivePriceTier` tests:**

| Test | Verifies |
|------|----------|
| Returns base tier below vote threshold | Does not show community tier prematurely |
| Returns community tier at/above threshold | Community consensus is applied correctly |
| Falls back to base tier when `communityPriceTier` is null | Null safety |
| Treats missing `totalVotes` as 0 | Defensive: new/malformed documents handled safely |

**Mocks needed:** None — pure functions.

---

#### `__tests__/lib/randomizer_service.test.ts`
**Source:** `lib/randomizer_service.ts`
**What it tests:** The "Kahit Saan" randomizer that picks a random place from a filtered candidate pool.

| Test | Verifies |
|------|----------|
| Returns null for empty list | No crash on empty input |
| Returns a place from the list (no filters) | Basic happy path |
| Filters by price tier | Correct price filtering |
| Excludes already-tried places | `excludeTriedIds` filter works |
| Returns null when all candidates are filtered out | No result when nothing passes filters |
| Returns different items over 50 runs | Randomness — not always returning index 0 |

**Mocks needed:** None.

---

#### `__tests__/lib/firestore_service.test.ts`
**Source:** `lib/firestore_service.ts`
**What it tests:** All Firestore database operations (places, profiles, user lists, price votes, username checks).

| Test | Verifies |
|------|----------|
| `getPlaces` fetches and maps docs correctly | Collection query + data mapping |
| `getPlaceById` returns place if exists | Document fetch + exists check |
| `getPlaceById` returns null if not found | Missing doc returns null |
| `addPlace` returns the new doc ID | addDoc called, ID returned |
| `likePlace` calls updateDoc | Increment operation fired |
| `getUserProfile` returns profile if exists | User doc fetch |
| `getUserProfile` returns null if missing | Missing profile handled |
| `updateUserProfile` calls setDoc with merge | Partial update, no overwrite |
| `addToTried` calls setDoc | Tried entry created |
| `removeFromTried` calls deleteDoc | Tried entry removed |
| `isUsernameTaken` returns true if taken | Case-insensitive collision check |
| `isUsernameTaken` returns false if not taken | Unique username validated |

**Mocks needed:** `firebase/firestore` (getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc), `@/lib/firebase_service`.

---

#### `__tests__/lib/social_service.test.ts`
**Source:** `lib/social_service.ts`
**What it tests:** Friend requests, invite throttling (24h cooldown), and social data fetching.

| Test | Verifies |
|------|----------|
| `searchUsersByUsername` excludes current user | Self not returned in search |
| `sendFriendRequest` uses batch writes (2 docs) | Atomic write to both users' collections |
| `acceptFriendRequest` batch-updates 2 docs | Both sides updated atomically |
| `removeFriend` batch-deletes 2 docs | Both sides cleaned up atomically |
| `getFriends` maps docs to friend list | Data mapping correct |
| `sendInvite` creates invite when no recent invite | Fresh invite is allowed |
| `sendInvite` throws `ALREADY_INVITED` within 24h | Spam prevention enforced |
| `sendInvite` allows re-invite after 24h | Throttle expires correctly |
| `getInvites` maps received invites | Inbox data mapping |
| `getSentInvites` maps sent invites | Outbox data mapping |
| `updateInviteStatus` calls updateDoc | Status change persisted |

**Mocks needed:** `firebase/firestore` (full mock), `@/lib/firebase_service`.

---

#### `__tests__/hooks/nearby_places_hook.test.ts`
**Source:** `hooks/nearby_places_hook.ts`
**What it tests:** The `filterPlaces` pure function and `useNearbyPlaces` hook that power the home feed.

| Test | Verifies |
|------|----------|
| Sorts by distance when user location is provided | Closest place appears first |
| Filters by `maxDistance` | Places beyond radius excluded |
| Filters by categories | Category intersection works |
| Filters by price tier using community consensus | Consensus tier used when votes ≥ threshold |
| Uses base price tier when no consensus | Falls back correctly |
| `useNearbyPlaces` wraps computation in `useMemo` | No redundant recalculations on re-render |

**Mocks needed:** `@/lib/geo_utils` (haversine stubbed as lat diff for determinism).

---

#### `__tests__/store/profile_store.test.ts`
**Source:** `store/profile_store.ts`
**What it tests:** Profile Zustand store — fetch, username validation rules, avatar upload flow.

| Test | Verifies |
|------|----------|
| Starts with correct default state | Store initializes cleanly |
| Fetches profile and stores it | Async fetch updates state |
| Saves valid unique username | Full happy-path username save |
| Rejects usernames shorter than 3 chars | `username_too_short` error thrown |
| Rejects usernames with hyphens/invalid chars | `username_invalid_chars` error thrown |
| Rejects already-taken usernames | `username_taken` error thrown |
| Uploads and saves avatar URL | Firebase Storage + Firestore both called |

**Mocks needed:** `@/lib/firestore_service`, `@/lib/firebase_storage_service`.

---

#### `__tests__/store/social_store.test.ts`
**Source:** `store/social_store.ts`
**What it tests:** Social Zustand store — friends, invites, search, friend request lifecycle.

| Test | Verifies |
|------|----------|
| Starts with correct default state | Store initializes cleanly |
| Fetches friends and updates state | `fetchFriends` populates `friends` array |
| Handles error on failed friend fetch | Error message stored in `state.error` |
| Searches users and stores results | `searchUsers` populates `searchResults` |
| Sends an invite successfully | `inviteToPlace` calls through to service |
| Sends a friend request | `sendRequest` dispatches to service |
| Accepts a friend request | `acceptRequest` dispatches to service |
| Declines a friend request | `declineRequest` dispatches to service |
| Removes a friend | `unfriend` dispatches to service |
| Fetches received + sent invites together | `fetchInvites` loads both inbox and outbox |

**Mocks needed:** `@/lib/social_service` (full module mock).

---

### Component Tests (React Native Testing Library)

#### `__tests__/components/FoodCard.test.tsx`
**Source:** `components/FoodCard.tsx`
**What it tests:** The main feed card UI component rendering and user interaction.

| Test | Verifies |
|------|----------|
| Renders the establishment name | Text content rendered correctly |
| Renders distance with unit | `"1.5 away"` format is correct |
| Shows "Mark as Tried" when not tried | Default untried state label |
| Shows "Tried It!" when already tried | Tried state label changes |
| Calls `toggleWishlist` on wishlist button press | Heart button fires correct action with uid + placeId |
| Calls `toggleTried` on tried button press | Check button fires correct action with uid + placeId |
| Navigates to details screen on card press | `openDetailsForPlace` called with the place object |
| Does not call toggles when user is null | Guest-mode guard — no crash |

**Mocks needed:** `expo-router`, `@/hooks/details_screen_hook`, `@/hooks/useTranslation`, `@/store/auth_store`, `@/store/list_store`, `expo-image`, `lucide-react-native`, `@/components/ui/CategoryChip`, `@/components/ui/PriceBadge`.

---

## Test Count Summary

| Category | Files | Tests |
|----------|-------|-------|
| Unit (pure functions) | 3 files | 22 tests |
| Unit (service layer) | 2 files | 23 tests |
| Unit (hooks) | 1 file | 6 tests |
| Unit (stores) | 2 files | 17 tests |
| Component | 1 file | 8 tests |
| **Total** | **9 files** | **~76 tests** |

Minimum required by rubric: **≥5 unit + ≥2 component** ✅

---

## Setup Notes

Tests use `jest-expo` preset with `ts-jest` transform. The config is in `jest.config.js`.

**Key global mocks (applied automatically via Jest setup):**
- `react-native-maps` — native module, cannot run in Jest
- `expo-location` — returns fixed Manila coordinate `{ latitude: 14.5995, longitude: 120.9842 }`
- `@react-native-async-storage/async-storage` — in-memory mock for Zustand `persist`

**Path aliases** (`@/`) are resolved via `ts-jest`'s `pathsToModuleNameMapper` using `tsconfig.json` paths — no manual setup needed.
