import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart, Settings, UtensilsCrossed, User, Users } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/profile_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfileScreen } from '@/hooks/profile_screen_hook';
import { useFeedStore } from '@/store/feed_store';
import { useListStore } from '@/store/list_store';
import { useSocialStore } from '@/store/social_store';
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { SpotGridCard } from '@/components/SpotGridCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Place } from '@/types';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
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
  } = useProfileScreen();

  const { places } = useFeedStore();
  const { triedIds, wishlistIds } = useListStore();
  const { friends } = useSocialStore();

  const pendingReceivedCount = friends.filter((f) => f.status === 'pending_received').length;

  // Filter global places feed to the user's tried / wishlist lists
  const triedPlaces: Place[] = places.filter((p) => triedIds.includes(p.id));
  const wishlistPlaces: Place[] = places.filter((p) => wishlistIds.includes(p.id));

  // RENDERERS
  const renderGridItem = ({ item, index }: { item: Place; index: number }) => (
    <View style={[styles.gridColumn, index % 2 === 0 ? styles.gridColumnLeft : styles.gridColumnRight]}>
      <SpotGridCard place={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList<Place>
        key="grid"
        data={activeTab === 'tried' ? triedPlaces : wishlistPlaces}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>{t.tabs.profile}</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => router.push('/friends_screen')}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Users size={22} color={Colors.text} />
                  {pendingReceivedCount > 0 && (
                    <View style={styles.headerBadge}>
                      <Text style={styles.headerBadgeText}>{pendingReceivedCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleOpenSidebar}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Settings size={22} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* HERO SECTION */}
            <View style={styles.heroSection}>
              {/* AVATAR */}
              <TouchableOpacity
                style={styles.avatarRing}
                onPress={handlePickAvatar}
                activeOpacity={0.8}
                disabled={isSaving}
              >
                {profile?.photoUrl ? (
                  <Image
                    source={profile.photoUrl}
                    style={styles.avatarImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                      <User size={40} color={Colors.muted} strokeWidth={1.5} />
                    )}
                  </View>
                )}
              </TouchableOpacity>

              {/* SAVING INDICATOR */}
              {isSaving && (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={styles.savingIndicator}
                />
              )}

              {/* USERNAME */}
              {editingUsername ? (
                <View style={styles.usernameEditRow}>
                  <TextInput
                    style={styles.usernameInput}
                    value={usernameInput}
                    onChangeText={setUsernameInput}
                    placeholder={t.profileScreen.usernamePlaceholder}
                    placeholderTextColor={Colors.muted}
                    autoFocus
                    autoCapitalize="none"
                    maxLength={30}
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveUsername}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonText}>{t.profileScreen.saveUsername}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancelEditUsername} activeOpacity={0.7}>
                    <Text style={styles.cancelButtonText}>{t.profileScreen.cancelEdit}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={handleStartEditUsername} activeOpacity={0.8}>
                  {profile?.username ? (
                    <Text style={styles.usernameText}>@{profile.username}</Text>
                  ) : (
                    <Text style={styles.usernameHint}>{t.profileScreen.usernamePlaceholder}</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* TAB BAR */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'tried' && styles.tabItemActive]}
                onPress={() => setActiveTab('tried')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'tried' && styles.tabTextActive]}>
                  {t.profileScreen.tabTried}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'wishlist' && styles.tabItemActive]}
                onPress={() => setActiveTab('wishlist')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'wishlist' && styles.tabTextActive]}>
                  {t.profileScreen.tabWishlist}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={renderGridItem}
        ListEmptyComponent={
          activeTab === 'tried' ? (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon={<UtensilsCrossed size={56} color={Colors.muted} strokeWidth={1.5} />}
                title={t.profileScreen.triedEmptyTitle}
                description={t.profileScreen.triedEmptyDesc}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <EmptyState
                icon={<Heart size={56} color={Colors.muted} strokeWidth={1.5} />}
                title={t.profileScreen.wishlistEmptyTitle}
                description={t.profileScreen.wishlistEmptyDesc}
              />
            </View>
          )
        }
      />

      {/* SIDEBAR */}
      <ProfileSidebar visible={sidebarOpen} onClose={handleCloseSidebar} />
    </SafeAreaView>
  );
}
