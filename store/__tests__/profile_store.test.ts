import { useProfileStore } from "../profile_store";
import { getUserProfile, updateUserProfile, isUsernameTaken } from "@/lib/firestore_service";
import { uploadAvatarToFirebase } from "@/lib/firebase_storage_service";

// MOCKS
jest.mock("@/lib/firestore_service", () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  isUsernameTaken: jest.fn(),
}));

jest.mock("@/lib/firebase_storage_service", () => ({
  uploadAvatarToFirebase: jest.fn(),
}));

describe("Profile Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProfileStore.setState({
      profile: null,
      isLoading: false,
      isSaving: false,
      error: null,
    });
  });

  it("should start with default values", () => {
    const state = useProfileStore.getState();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isSaving).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should fetch profile successfully", async () => {
    const mockProfile = {
      uid: "user123",
      username: "tastysilog",
      photoUrl: "https://example.com/avatar.jpg",
      updatedAt: null,
    };
    (getUserProfile as jest.Mock).mockResolvedValueOnce(mockProfile);

    await useProfileStore.getState().fetchProfile("user123");

    const state = useProfileStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.profile).toEqual(mockProfile);
    expect(getUserProfile).toHaveBeenCalledWith("user123");
  });

  it("should save username successfully if valid and unique", async () => {
    (isUsernameTaken as jest.Mock).mockResolvedValueOnce(false);
    (updateUserProfile as jest.Mock).mockResolvedValueOnce(undefined);

    await useProfileStore.getState().saveUsername("user123", "  Tasty_Silog123  ");

    const state = useProfileStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.profile?.username).toBe("tasty_silog123");
    expect(isUsernameTaken).toHaveBeenCalledWith("tasty_silog123", "user123");
    expect(updateUserProfile).toHaveBeenCalledWith("user123", { username: "tasty_silog123" });
  });

  it("should reject username if it is too short", async () => {
    await expect(
      useProfileStore.getState().saveUsername("user123", "ab")
    ).rejects.toThrow("username_too_short");

    const state = useProfileStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.error).toBe("username_too_short");
  });

  it("should reject username if it has invalid characters", async () => {
    await expect(
      useProfileStore.getState().saveUsername("user123", "tasty-silog")
    ).rejects.toThrow("username_invalid_chars");

    const state = useProfileStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.error).toBe("username_invalid_chars");
  });

  it("should reject username if it is already taken", async () => {
    (isUsernameTaken as jest.Mock).mockResolvedValueOnce(true);

    await expect(
      useProfileStore.getState().saveUsername("user123", "tastysilog")
    ).rejects.toThrow("username_taken");

    const state = useProfileStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.error).toBe("username_taken");
  });

  it("should upload and save avatar successfully", async () => {
    (uploadAvatarToFirebase as jest.Mock).mockResolvedValueOnce("https://example.com/avatar.jpg");
    (updateUserProfile as jest.Mock).mockResolvedValueOnce(undefined);

    await useProfileStore.getState().saveAvatar("user123", "ph://local/avatar.jpg");

    const state = useProfileStore.getState();
    expect(state.isSaving).toBe(false);
    expect(state.profile?.photoUrl).toContain("https://example.com/avatar.jpg");
    expect(uploadAvatarToFirebase).toHaveBeenCalledWith("ph://local/avatar.jpg", "user123");
  });
});
