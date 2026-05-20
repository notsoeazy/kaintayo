import {
  searchUsersByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  sendInvite,
  getInvites,
  getSentInvites,
  updateInviteStatus,
} from "@/lib/social_service";
import {
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

// MOCKS
jest.mock("@/lib/firebase_service", () => ({
  db: {},
}));

const mockBatch = {
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

jest.mock("firebase/firestore", () => {
  return {
    collection: jest.fn(() => ({ id: "mock_col_id" })),
    doc: jest.fn(() => ({ id: "mock_doc_id" })),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    writeBatch: jest.fn(() => mockBatch),
    Timestamp: {
      now: jest.fn(() => ({
        toMillis: () => 1000000000000,
      })),
    },
  };
});

describe("Social Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsersByUsername", () => {
    it("should return users matching query, excluding current user", async () => {
      const mockDocs = [
        { id: "userA", data: () => ({ username: "TastySilog" }) },
        { id: "userB", data: () => ({ username: "CrispyPata" }) },
        { id: "userC", data: () => ({ username: "TastySoup" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });

      const results = await searchUsersByUsername("tasty", "userC");
      expect(results).toHaveLength(1);
      expect(results[0].uid).toBe("userA");
    });
  });

  describe("friend requests", () => {
    it("should send a friend request using batch writes", async () => {
      await sendFriendRequest(
        { uid: "sender1", username: "sender", photoUrl: "" },
        { uid: "receiver1", username: "receiver", photoUrl: "" }
      );
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.set).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should accept a friend request", async () => {
      await acceptFriendRequest("user1", "user2");
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.update).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should remove a friend relationship", async () => {
      await removeFriend("user1", "user2");
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.delete).toHaveBeenCalledTimes(2);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should get friends", async () => {
      const mockDocs = [
        { data: () => ({ uid: "friend1", username: "friendA", status: "accepted" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockDocs,
      });

      const result = await getFriends("user1");
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe("friendA");
    });
  });

  describe("invites", () => {
    it("should send an invite when no recent invite exists", async () => {
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => {},
      });
      (addDoc as jest.Mock).mockResolvedValueOnce({ id: "new_invite_id" });

      const inviteId = await sendInvite(
        "user1",
        "sender",
        "user2",
        "receiver",
        "place123",
        "Bigg Diner"
      );

      expect(inviteId).toBe("new_invite_id");
      expect(addDoc).toHaveBeenCalled();
    });

    it("should throw ALREADY_INVITED when an invite was sent within 24 hours", async () => {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const mockDocs = [
        {
          id: "invite1",
          data: () => ({
            fromUid: "user1",
            toUid: "user2",
            placeId: "place123",
            createdAt: {
              toMillis: () => oneHourAgo,
            },
          }),
        },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });

      await expect(
        sendInvite("user1", "sender", "user2", "receiver", "place123", "Bigg Diner")
      ).rejects.toThrow("ALREADY_INVITED");

      expect(addDoc).not.toHaveBeenCalled();
    });

    it("should send invite if the previous invite was older than 24 hours", async () => {
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
      const mockDocs = [
        {
          id: "invite1",
          data: () => ({
            fromUid: "user1",
            toUid: "user2",
            placeId: "place123",
            createdAt: {
              toMillis: () => twoDaysAgo,
            },
          }),
        },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });
      (addDoc as jest.Mock).mockResolvedValueOnce({ id: "new_invite_id" });

      const inviteId = await sendInvite(
        "user1",
        "sender",
        "user2",
        "receiver",
        "place123",
        "Bigg Diner"
      );

      expect(inviteId).toBe("new_invite_id");
      expect(addDoc).toHaveBeenCalled();
    });

    it("should fetch received invites", async () => {
      const mockDocs = [
        { id: "inv1", data: () => ({ fromUid: "user2", toUid: "user1", placeName: "Bigg" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockDocs,
      });

      const results = await getInvites("user1");
      expect(results).toHaveLength(1);
      expect(results[0].placeName).toBe("Bigg");
    });

    it("should fetch sent invites", async () => {
      const mockDocs = [
        { id: "inv2", data: () => ({ fromUid: "user1", toUid: "user2", placeName: " Bigg" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockDocs,
      });

      const results = await getSentInvites("user1");
      expect(results).toHaveLength(1);
    });

    it("should update invite status", async () => {
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);
      await updateInviteStatus("user1", "invite1", "accepted");
      expect(updateDoc).toHaveBeenCalled();
    });
  });
});
