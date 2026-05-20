import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/auth_store';
import { useProfileStore } from '@/store/profile_store';

// PROFILE SCREEN HOOK
// Manages avatar upload, username editing, sidebar, and tab state for ProfileScreen.
export function useProfileScreen() {
  const { user } = useAuthStore();
  const { profile, isLoading, isSaving, fetchProfile, saveUsername, saveAvatar } =
    useProfileStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tried' | 'wishlist'>('tried');
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  // Load the profile when the screen mounts or the user changes
  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
    }
  }, [user?.uid]);

  // Sync local input whenever profile loads
  useEffect(() => {
    if (profile?.username) {
      setUsernameInput(profile.username);
    }
  }, [profile?.username]);

  const handleOpenSidebar = useCallback(() => setSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleStartEditUsername = useCallback(() => {
    setUsernameInput(profile?.username ?? '');
    setEditingUsername(true);
  }, [profile?.username]);

  const handleCancelEditUsername = useCallback(() => {
    setEditingUsername(false);
  }, []);

  const handleSaveUsername = useCallback(async () => {
    if (!user) return;
    const trimmed = usernameInput.trim();
    if (!trimmed) return;
    await saveUsername(user.uid, trimmed);
    setEditingUsername(false);
  }, [user, usernameInput, saveUsername]);

  const handlePickAvatar = useCallback(async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Gallery permission is needed to change your photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await saveAvatar(user.uid, result.assets[0].uri);
    }
  }, [user, saveAvatar]);

  return {
    user,
    profile,
    isLoading,
    isSaving,
    sidebarOpen,
    activeTab,
    editingUsername,
    usernameInput,
    setUsernameInput,
    setActiveTab,
    handleOpenSidebar,
    handleCloseSidebar,
    handleStartEditUsername,
    handleCancelEditUsername,
    handleSaveUsername,
    handlePickAvatar,
  };
}
