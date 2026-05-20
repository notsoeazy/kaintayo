import { create } from "zustand";
import {
  acceptFriendRequest,
  getFriends,
  getInvites,
  getSentInvites,
  removeFriend,
  searchUsersByUsername,
  sendFriendRequest,
  sendInvite,
  subscribeToFriends,
  subscribeToInvites,
  subscribeToSentInvites,
  updateInviteStatus,
} from "@/lib/social_service";
import type { FriendEntry, InviteEntry, InviteStatus, UserProfile } from "@/types";

interface SocialState {
  friends: FriendEntry[];
  invites: InviteEntry[];
  sentInvites: InviteEntry[];
  searchResults: UserProfile[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  fetchFriends: (userId: string) => Promise<void>;
  fetchInvites: (userId: string) => Promise<void>;
  fetchSentInvites: (userId: string) => Promise<void>;
  searchUsers: (queryText: string, currentUid: string) => Promise<void>;
  clearSearchResults: () => void;
  sendRequest: (
    sender: Pick<UserProfile, "uid" | "username" | "photoUrl">,
    receiver: Pick<UserProfile, "uid" | "username" | "photoUrl">
  ) => Promise<void>;
  acceptRequest: (userId: string, friendId: string) => Promise<void>;
  declineRequest: (userId: string, friendId: string) => Promise<void>;
  unfriend: (userId: string, friendId: string) => Promise<void>;
  inviteToPlace: (
    senderUid: string,
    senderUsername: string,
    receiverUid: string,
    receiverUsername: string,
    placeId: string,
    placeName: string
  ) => Promise<void>;
  respondToInvite: (userId: string, inviteId: string, status: InviteStatus) => Promise<void>;
  subscribeSocial: (userId: string) => void;
  unsubscribeSocial: () => void;
  clearSocial: () => void;
}

let unsubscribeFriends: (() => void) | null = null;
let unsubscribeInvites: (() => void) | null = null;
let unsubscribeSentInvites: (() => void) | null = null;

export const useSocialStore = create<SocialState>((set, get) => ({
  friends: [],
  invites: [],
  sentInvites: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,

  fetchFriends: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const friends = await getFriends(userId);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchInvites: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const invites = await getInvites(userId);
      const sentInvites = await getSentInvites(userId);
      set({ invites, sentInvites, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchSentInvites: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const sentInvites = await getSentInvites(userId);
      set({ sentInvites, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  searchUsers: async (queryText, currentUid) => {
    if (!queryText.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true, error: null });
    try {
      const results = await searchUsersByUsername(queryText, currentUid);
      set({ searchResults: results, isSearching: false });
    } catch (err) {
      set({ error: (err as Error).message, isSearching: false });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),

  sendRequest: async (sender, receiver) => {
    set({ isLoading: true, error: null });
    try {
      await sendFriendRequest(sender, receiver);
      const friends = await getFriends(sender.uid);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  acceptRequest: async (userId, friendId) => {
    set({ isLoading: true, error: null });
    try {
      await acceptFriendRequest(userId, friendId);
      const friends = await getFriends(userId);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  declineRequest: async (userId, friendId) => {
    set({ isLoading: true, error: null });
    try {
      await removeFriend(userId, friendId);
      const friends = await getFriends(userId);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  unfriend: async (userId, friendId) => {
    set({ isLoading: true, error: null });
    try {
      await removeFriend(userId, friendId);
      const friends = await getFriends(userId);
      set({ friends, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  inviteToPlace: async (senderUid, senderUsername, receiverUid, receiverUsername, placeId, placeName) => {
    set({ isLoading: true, error: null });
    try {
      await sendInvite(senderUid, senderUsername, receiverUid, receiverUsername, placeId, placeName);
      set({ isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  respondToInvite: async (userId, inviteId, status) => {
    set({ isLoading: true, error: null });
    try {
      await updateInviteStatus(userId, inviteId, status);
      const invites = await getInvites(userId);
      set({ invites, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  subscribeSocial: (userId) => {
    get().unsubscribeSocial();
    set({ isLoading: true });

    unsubscribeFriends = subscribeToFriends(
      userId,
      (friends) => {
        set({ friends, isLoading: false, error: null });
      },
      (err) => {
        set({ error: err.message, isLoading: false });
      }
    );

    unsubscribeInvites = subscribeToInvites(
      userId,
      (invites) => {
        set({ invites, error: null });
      },
      (err) => {
        set({ error: err.message });
      }
    );

    unsubscribeSentInvites = subscribeToSentInvites(
      userId,
      (sentInvites) => {
        set({ sentInvites, error: null });
      },
      (err) => {
        set({ error: err.message });
      }
    );
  },

  unsubscribeSocial: () => {
    if (unsubscribeFriends) {
      unsubscribeFriends();
      unsubscribeFriends = null;
    }
    if (unsubscribeInvites) {
      unsubscribeInvites();
      unsubscribeInvites = null;
    }
    if (unsubscribeSentInvites) {
      unsubscribeSentInvites();
      unsubscribeSentInvites = null;
    }
  },

  clearSocial: () => {
    get().unsubscribeSocial();
    set({
      friends: [],
      invites: [],
      sentInvites: [],
      searchResults: [],
      isLoading: false,
      isSearching: false,
      error: null,
    });
  },
}));
