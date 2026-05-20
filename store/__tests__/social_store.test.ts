import { useSocialStore } from "../social_store";
import {
  getFriends,
  getInvites,
  searchUsersByUsername,
  sendInvite,
} from "@/lib/social_service";

// MOCKS
jest.mock("@/lib/social_service", () => ({
  getFriends: jest.fn(),
  getInvites: jest.fn(),
  searchUsersByUsername: jest.fn(),
  sendFriendRequest: jest.fn(),
  acceptFriendRequest: jest.fn(),
  removeFriend: jest.fn(),
  sendInvite: jest.fn(),
  updateInviteStatus: jest.fn(),
}));

describe("Social Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset state before each test
    useSocialStore.setState({
      friends: [],
      invites: [],
      searchResults: [],
      isLoading: false,
      isSearching: false,
      error: null,
    });
  });

  it("should start with default values", () => {
    const state = useSocialStore.getState();
    expect(state.friends).toEqual([]);
    expect(state.invites).toEqual([]);
    expect(state.searchResults).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.isSearching).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should fetch friends successfully", async () => {
    const mockFriends = [
      { uid: "friend1", username: "adobo_lover", status: "accepted" as const, updatedAt: new Date() },
    ];
    (getFriends as jest.Mock).mockResolvedValueOnce(mockFriends);

    await useSocialStore.getState().fetchFriends("user123");

    const state = useSocialStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.friends).toEqual(mockFriends);
    expect(getFriends).toHaveBeenCalledWith("user123");
  });

  it("should handle error when fetching friends fails", async () => {
    (getFriends as jest.Mock).mockRejectedValueOnce(new Error("Firebase Error"));

    await useSocialStore.getState().fetchFriends("user123");

    const state = useSocialStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.friends).toEqual([]);
    expect(state.error).toBe("Firebase Error");
  });

  it("should search users successfully", async () => {
    const mockResults = [
      { uid: "user2", username: "sinigang_king", photoUrl: "" },
    ];
    (searchUsersByUsername as jest.Mock).mockResolvedValueOnce(mockResults);

    await useSocialStore.getState().searchUsers("sini", "user1");

    const state = useSocialStore.getState();
    expect(state.isSearching).toBe(false);
    expect(state.searchResults).toEqual(mockResults);
    expect(searchUsersByUsername).toHaveBeenCalledWith("sini", "user1");
  });

  it("should send an invite to a place successfully", async () => {
    (sendInvite as jest.Mock).mockResolvedValueOnce(undefined);

    await useSocialStore
      .getState()
      .inviteToPlace("user1", "adobo_master", "user2", "place_abc", "Jollibee");

    const state = useSocialStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(sendInvite).toHaveBeenCalledWith(
      "user1",
      "adobo_master",
      "user2",
      "place_abc",
      "Jollibee"
    );
  });
});
