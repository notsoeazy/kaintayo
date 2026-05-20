import { db } from "@/lib/firebase_service";
import type { FriendEntry, FriendStatus, InviteEntry, InviteStatus, UserProfile } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

// USERS

export async function searchUsersByUsername(
  queryText: string,
  currentUid: string
): Promise<UserProfile[]> {
  const usersRef = collection(db, "users");
  const cleanQuery = queryText.trim().toLowerCase();
  if (!cleanQuery) return [];
  const snap = await getDocs(usersRef);
  const results: UserProfile[] = [];
  snap.forEach((docSnap) => {
    if (docSnap.id !== currentUid) {
      const data = docSnap.data();
      const username = (data.username || "").toLowerCase();
      if (username.includes(cleanQuery)) {
        results.push({ uid: docSnap.id, ...data } as UserProfile);
      }
    }
  });
  return results;
}

// FRIENDS

export async function sendFriendRequest(
  sender: Pick<UserProfile, "uid" | "username" | "photoUrl">,
  receiver: Pick<UserProfile, "uid" | "username" | "photoUrl">
): Promise<void> {
  const batch = writeBatch(db);
  const senderDocRef = doc(db, `users/${sender.uid}/friends/${receiver.uid}`);
  batch.set(senderDocRef, {
    uid: receiver.uid,
    username: receiver.username,
    photoUrl: receiver.photoUrl || "",
    status: "pending_sent",
    updatedAt: Timestamp.now(),
  });
  const receiverDocRef = doc(db, `users/${receiver.uid}/friends/${sender.uid}`);
  batch.set(receiverDocRef, {
    uid: sender.uid,
    username: sender.username,
    photoUrl: sender.photoUrl || "",
    status: "pending_received",
    updatedAt: Timestamp.now(),
  });
  await batch.commit();
}

export async function acceptFriendRequest(
  userId: string,
  friendId: string
): Promise<void> {
  const batch = writeBatch(db);
  const userFriendRef = doc(db, `users/${userId}/friends/${friendId}`);
  batch.update(userFriendRef, {
    status: "accepted",
    updatedAt: Timestamp.now(),
  });
  const friendUserRef = doc(db, `users/${friendId}/friends/${userId}`);
  batch.update(friendUserRef, {
    status: "accepted",
    updatedAt: Timestamp.now(),
  });
  await batch.commit();
}

export async function removeFriend(
  userId: string,
  friendId: string
): Promise<void> {
  const batch = writeBatch(db);
  const userFriendRef = doc(db, `users/${userId}/friends/${friendId}`);
  batch.delete(userFriendRef);
  const friendUserRef = doc(db, `users/${friendId}/friends/${userId}`);
  batch.delete(friendUserRef);
  await batch.commit();
}

export async function getFriends(userId: string): Promise<FriendEntry[]> {
  const snap = await getDocs(collection(db, `users/${userId}/friends`));
  return snap.docs.map((d) => d.data() as FriendEntry);
}

export function subscribeToFriends(
  userId: string,
  onUpdate: (friends: FriendEntry[]) => void,
  onError?: (error: Error) => void
): () => void {
  let unsubscribe: (() => void) | null = null;
  let retryCount = 0;
  const maxRetries = 5;
  let timeoutId: any;
  let isUnsubscribed = false;

  function start() {
    if (isUnsubscribed) return;
    const friendsColRef = collection(db, `users/${userId}/friends`);
    unsubscribe = onSnapshot(
      friendsColRef,
      (snapshot) => {
        const friends: FriendEntry[] = [];
        snapshot.forEach((docSnap) => {
          friends.push(docSnap.data() as FriendEntry);
        });
        onUpdate(friends);
      },
      (error) => {
        if (
          (error.code === "permission-denied" || error.message?.includes("permission")) &&
          retryCount < maxRetries &&
          !isUnsubscribed
        ) {
          retryCount++;
          const delay = retryCount * 1000;
          timeoutId = setTimeout(start, delay);
        } else if (onError) {
          onError(error);
        }
      }
    );
  }

  start();

  return () => {
    isUnsubscribed = true;
    if (unsubscribe) unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
  };
}

// INVITES

export async function sendInvite(
  senderUid: string,
  senderUsername: string,
  receiverUid: string,
  toUsername: string,
  placeId: string,
  placeName: string
): Promise<string> {
  const inviteColRef = collection(db, "invites");

  // Prevent spamming multiple invites to the same place/friend within 24 hours
  const q = query(
    inviteColRef,
    where("fromUid", "==", senderUid),
    where("toUid", "==", receiverUid),
    where("placeId", "==", placeId)
  );

  const snap = await getDocs(q);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  let hasRecentInvite = false;

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.createdAt) {
      const createdAtMs = data.createdAt.toMillis
        ? data.createdAt.toMillis()
        : new Date(data.createdAt).getTime();
      if (createdAtMs > oneDayAgo) {
        hasRecentInvite = true;
      }
    }
  });

  if (hasRecentInvite) {
    throw new Error("ALREADY_INVITED");
  }

  const docRef = await addDoc(inviteColRef, {
    fromUid: senderUid,
    fromUsername: senderUsername,
    toUid: receiverUid,
    toUsername,
    placeId,
    placeName,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getInvites(userId: string): Promise<InviteEntry[]> {
  const invitesCol = collection(db, "invites");
  const q = query(invitesCol, where("toUid", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InviteEntry);
}

export function subscribeToInvites(
  userId: string,
  onUpdate: (invites: InviteEntry[]) => void,
  onError?: (error: Error) => void
): () => void {
  let unsubscribe: (() => void) | null = null;
  let retryCount = 0;
  const maxRetries = 5;
  let timeoutId: any;
  let isUnsubscribed = false;

  function start() {
    if (isUnsubscribed) return;
    const invitesCol = collection(db, "invites");
    const q = query(invitesCol, where("toUid", "==", userId));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invites: InviteEntry[] = [];
        snapshot.forEach((docSnap) => {
          invites.push({ id: docSnap.id, ...docSnap.data() } as InviteEntry);
        });
        onUpdate(invites);
      },
      (error) => {
        if (
          (error.code === "permission-denied" || error.message?.includes("permission")) &&
          retryCount < maxRetries &&
          !isUnsubscribed
        ) {
          retryCount++;
          const delay = retryCount * 1000;
          timeoutId = setTimeout(start, delay);
        } else if (onError) {
          onError(error);
        }
      }
    );
  }

  start();

  return () => {
    isUnsubscribed = true;
    if (unsubscribe) unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
  };
}

export async function getSentInvites(userId: string): Promise<InviteEntry[]> {
  const invitesCol = collection(db, "invites");
  const q = query(invitesCol, where("fromUid", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InviteEntry);
}

export function subscribeToSentInvites(
  userId: string,
  onUpdate: (invites: InviteEntry[]) => void,
  onError?: (error: Error) => void
): () => void {
  let unsubscribe: (() => void) | null = null;
  let retryCount = 0;
  const maxRetries = 5;
  let timeoutId: any;
  let isUnsubscribed = false;

  function start() {
    if (isUnsubscribed) return;
    const invitesCol = collection(db, "invites");
    const q = query(invitesCol, where("fromUid", "==", userId));
    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invites: InviteEntry[] = [];
        snapshot.forEach((docSnap) => {
          invites.push({ id: docSnap.id, ...docSnap.data() } as InviteEntry);
        });
        onUpdate(invites);
      },
      (error) => {
        if (
          (error.code === "permission-denied" || error.message?.includes("permission")) &&
          retryCount < maxRetries &&
          !isUnsubscribed
        ) {
          retryCount++;
          const delay = retryCount * 1000;
          timeoutId = setTimeout(start, delay);
        } else if (onError) {
          onError(error);
        }
      }
    );
  }

  start();

  return () => {
    isUnsubscribed = true;
    if (unsubscribe) unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
  };
}

export async function updateInviteStatus(
  userId: string,
  inviteId: string,
  status: InviteStatus
): Promise<void> {
  const inviteRef = doc(db, `invites/${inviteId}`);
  await updateDoc(inviteRef, { status });
}
