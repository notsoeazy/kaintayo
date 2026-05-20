import { db } from "@/lib/firebase_service";
import type { FriendEntry, FriendStatus, InviteEntry, InviteStatus, UserProfile } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
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
  const q = query(
    usersRef,
    where("username", ">=", cleanQuery),
    where("username", "<=", cleanQuery + "\uf8ff")
  );
  const snap = await getDocs(q);
  const results: UserProfile[] = [];
  snap.forEach((docSnap) => {
    if (docSnap.id !== currentUid) {
      results.push({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
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
    photoUrl: receiver.photoUrl,
    status: "pending_sent",
    updatedAt: Timestamp.now(),
  });
  const receiverDocRef = doc(db, `users/${receiver.uid}/friends/${sender.uid}`);
  batch.set(receiverDocRef, {
    uid: sender.uid,
    username: sender.username,
    photoUrl: sender.photoUrl,
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

// INVITES

export async function sendInvite(
  senderUid: string,
  senderUsername: string,
  receiverUid: string,
  placeId: string,
  placeName: string
): Promise<string> {
  const inviteColRef = collection(db, `users/${receiverUid}/invites`);
  const docRef = await addDoc(inviteColRef, {
    fromUid: senderUid,
    fromUsername: senderUsername,
    toUid: receiverUid,
    placeId,
    placeName,
    status: "pending",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getInvites(userId: string): Promise<InviteEntry[]> {
  const snap = await getDocs(collection(db, `users/${userId}/invites`));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as InviteEntry);
}

export async function updateInviteStatus(
  userId: string,
  inviteId: string,
  status: InviteStatus
): Promise<void> {
  const inviteRef = doc(db, `users/${userId}/invites/${inviteId}`);
  await updateDoc(inviteRef, { status });
}
