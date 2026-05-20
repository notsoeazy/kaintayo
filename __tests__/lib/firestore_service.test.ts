import {
  getPlaces,
  getPlaceById,
  addPlace,
  likePlace,
  getUserProfile,
  updateUserProfile,
  addToTried,
  removeFromTried,
  isUsernameTaken,
  generateUniqueUsername,
} from "@/lib/firestore_service";
import {
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// MOCKS
jest.mock("@/lib/firebase_service", () => ({
  db: {},
}));

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
    increment: jest.fn((val) => ({ type: "increment", val })),
    Timestamp: {
      now: jest.fn(() => ({ toMillis: () => 12345 })),
    },
  };
});

describe("Firestore Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPlaces", () => {
    it("should fetch all places", async () => {
      const mockDocs = [
        { id: "1", data: () => ({ name: "Naga Garden", isSeeded: true }) },
        { id: "2", data: () => ({ name: "Geewan", isSeeded: true }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });

      const result = await getPlaces();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: "1", name: "Naga Garden", isSeeded: true });
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe("getPlaceById", () => {
    it("should return a place by ID if it exists", async () => {
      const mockDoc = {
        exists: () => true,
        id: "place123",
        data: () => ({ name: "Naga Garden" }),
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await getPlaceById("place123");

      expect(result).toEqual({ id: "place123", name: "Naga Garden" });
      expect(getDoc).toHaveBeenCalled();
    });

    it("should return null if place does not exist", async () => {
      const mockDoc = {
        exists: () => false,
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await getPlaceById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("addPlace", () => {
    it("should add a place and return doc ID", async () => {
      (addDoc as jest.Mock).mockResolvedValueOnce({ id: "new_place_id" });

      const placeInput = {
        name: "Bigg's Diner",
        categories: ["fastfood" as const],
        priceTier: "affordable" as const,
        priceMin: 100,
        priceMax: 200,
        description: "Famous local diner",
        latitude: 13.6,
        longitude: 123.1,
        googleMapsUrl: "https://maps.google.com",
        createdBy: "user123",
        isSeeded: false,
      };

      const result = await addPlace(placeInput);

      expect(result).toBe("new_place_id");
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe("likePlace", () => {
    it("should update like count", async () => {
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await likePlace("place123");

      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe("getUserProfile", () => {
    it("should return profile if exists", async () => {
      const mockDoc = {
        exists: () => true,
        data: () => ({ username: "tastysilog", photoUrl: "avatar.png" }),
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await getUserProfile("user123");

      expect(result).toEqual({ uid: "user123", username: "tastysilog", photoUrl: "avatar.png" });
    });

    it("should return null if profile does not exist", async () => {
      const mockDoc = {
        exists: () => false,
      };
      (getDoc as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await getUserProfile("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("should update/merge user profile", async () => {
      (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await updateUserProfile("user123", { username: "newusername" });

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ username: "newusername" }),
        { merge: true }
      );
    });
  });

  describe("addToTried & removeFromTried", () => {
    it("should set tried entry", async () => {
      (setDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await addToTried("user123", "place123");

      expect(setDoc).toHaveBeenCalled();
    });

    it("should delete tried entry", async () => {
      (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await removeFromTried("user123", "place123");

      expect(deleteDoc).toHaveBeenCalled();
    });
  });

  describe("username checks", () => {
    it("should return true if username is taken", async () => {
      const mockDocs = [
        { id: "userA", data: () => ({ username: "TastySilog" }) },
        { id: "userB", data: () => ({ username: "CrispyPata" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });

      const isTaken = await isUsernameTaken("tastysilog", "userB");

      expect(isTaken).toBe(true);
    });

    it("should return false if username is not taken", async () => {
      const mockDocs = [
        { id: "userA", data: () => ({ username: "TastySilog" }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        forEach: (callback: any) => mockDocs.forEach(callback),
      });

      const isTaken = await isUsernameTaken("CrispyPata");

      expect(isTaken).toBe(false);
    });

    it("should generate a unique username", async () => {
      // First isUsernameTaken will return true, second will return false
      const mockDocsForFirstAttempt = [
        { id: "userA", data: () => ({ username: "firstcandidate" }) },
      ];
      const mockDocsForSecondAttempt = [];

      (getDocs as jest.Mock)
        .mockResolvedValueOnce({
          // Mocking the check for the first random candidate
          forEach: (callback: any) => {
            callback({ id: "userA", data: () => ({ username: "taho123" }) });
          },
        })
        .mockResolvedValueOnce({
          // Mocking the check for the second random candidate (not taken)
          forEach: (callback: any) => {},
        });

      jest.mock("@/lib/username_utils", () => ({
        generateRandomUsername: jest
          .fn()
          .mockReturnValueOnce("taho123")
          .mockReturnValueOnce("lumpia456"),
      }));

      const uniqueUsername = await generateUniqueUsername();
      expect(uniqueUsername).toBeDefined();
      expect(typeof uniqueUsername).toBe("string");
    });
  });
});
