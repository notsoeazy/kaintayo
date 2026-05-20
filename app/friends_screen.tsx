import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ChevronLeft, User, UserPlus, UserMinus, Check, X, Users } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/friends_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/auth_store';
import { useProfileStore } from '@/store/profile_store';
import { useSocialStore } from '@/store/social_store';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FriendEntry, UserProfile } from '@/types';

type TabType = 'my_friends' | 'requests';

export default function FriendsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const {
    friends,
    searchResults,
    isLoading,
    isSearching,
    fetchFriends,
    searchUsers,
    clearSearchResults,
    sendRequest,
    acceptRequest,
    declineRequest,
    unfriend,
  } = useSocialStore();

  const [activeTab, setActiveTab] = useState<TabType>('my_friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // LIFECYCLE
  useEffect(() => {
    if (user) {
      fetchFriends(user.uid);
    }
  }, [user]);

  // DATA SELECTORS
  const acceptedFriends = friends.filter((f) => f.status === 'accepted');
  const pendingReceived = friends.filter((f) => f.status === 'pending_received');
  const pendingSent = friends.filter((f) => f.status === 'pending_sent');
  const pendingReceivedCount = pendingReceived.length;

  // HANDLERS
  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchFriends(user.uid);
      setRefreshing(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setHasSearched(false);
    if (!text.trim()) {
      clearSearchResults();
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && user) {
      if (profile?.username && searchQuery.trim().toLowerCase() === profile.username.toLowerCase()) {
        Alert.alert('Ops!', t.profileScreen.cannotAddSelf);
        return;
      }
      setHasSearched(true);
      searchUsers(searchQuery.trim(), user.uid);
    }
  };

  const handleSendRequest = async (receiver: UserProfile) => {
    if (!profile || !user) return;
    await sendRequest(
      { uid: user.uid, username: profile.username, photoUrl: profile.photoUrl },
      { uid: receiver.uid, username: receiver.username, photoUrl: receiver.photoUrl }
    );
    setSearchQuery('');
    setHasSearched(false);
    clearSearchResults();
    Alert.alert('Success!', t.profileScreen.friendRequestSent);
  };

  const handleAcceptRequest = async (friendId: string) => {
    if (!user) return;
    await acceptRequest(user.uid, friendId);
  };

  const handleDeclineRequest = async (friendId: string) => {
    if (!user) return;
    await declineRequest(user.uid, friendId);
  };

  const handleUnfriend = async (friendId: string) => {
    if (!user) return;
    const friendObj = friends.find((f) => f.uid === friendId);
    Alert.alert(
      t.friendsScreen.unfriendButton,
      t.friendsScreen.unfriendConfirm.replace('{{username}}', friendObj?.username || ''),
      [
        { text: t.addSpot.cancelButton, style: 'cancel' },
        {
          text: t.friendsScreen.unfriendButton,
          style: 'destructive',
          onPress: () => unfriend(user.uid, friendId),
        },
      ]
    );
  };

  // RENDERERS
  const renderFriendItem = ({ item }: { item: FriendEntry }) => (
    <View style={styles.friendItem}>
      <View style={styles.userRow}>
        {item.photoUrl ? (
          <Image source={item.photoUrl} style={styles.friendAvatar} />
        ) : (
          <View style={styles.friendAvatarPlaceholder}>
            <User size={20} color={Colors.muted} />
          </View>
        )}
        <Text style={styles.friendUsername}>@{item.username}</Text>
      </View>
      <TouchableOpacity
        style={styles.unfriendButton}
        onPress={() => handleUnfriend(item.uid)}
        activeOpacity={0.7}
      >
        <UserMinus size={18} color={Colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderRequestItem = ({ item, isReceived }: { item: any; isReceived: boolean }) => (
    <View style={styles.requestItem}>
      <View style={styles.userRow}>
        {item.photoUrl ? (
          <Image source={item.photoUrl} style={styles.smallAvatar} />
        ) : (
          <View style={styles.smallAvatarPlaceholder}>
            <User size={16} color={Colors.muted} />
          </View>
        )}
        <Text style={styles.requestUsername}>@{item.username}</Text>
      </View>
      {isReceived ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptBtn]}
            onPress={() => handleAcceptRequest(item.uid)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>G!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineBtn]}
            onPress={() => handleDeclineRequest(item.uid)}
            activeOpacity={0.8}
          >
            <X size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.statusLabel}>{t.profileScreen.friendRequestSent}</Text>
      )}
    </View>
  );

  const getRequestsListData = () => {
    const data: any[] = [];
    if (pendingReceived.length > 0) {
      data.push({ type: 'header', title: t.friendsScreen.requestsReceivedHeader });
      data.push(...pendingReceived.map((item) => ({ type: 'received', item })));
    }
    if (pendingSent.length > 0) {
      data.push({ type: 'header', title: t.friendsScreen.requestsSentHeader });
      data.push(...pendingSent.map((item) => ({ type: 'sent', item })));
    }
    return data;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.friendsScreen.title}</Text>
      </View>

      {/* SEARCH SECTION */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder={t.profileScreen.addFriendPlaceholder}
            placeholderTextColor={Colors.muted}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            onSubmitEditing={handleSearchSubmit}
          />
          {isSearching ? (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.searchIndicator} />
          ) : (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonText}>{t.profileScreen.addFriendButton}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH RESULTS */}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {searchResults.map((userResult) => {
              const relationship = friends.find((f) => f.uid === userResult.uid);
              const isFriend = relationship?.status === 'accepted';
              const isSent = relationship?.status === 'pending_sent';
              const isReceived = relationship?.status === 'pending_received';

              return (
                <View key={userResult.uid} style={styles.searchResultItem}>
                  <View style={styles.userRow}>
                    {userResult.photoUrl ? (
                      <Image source={userResult.photoUrl} style={styles.smallAvatar} />
                    ) : (
                      <View style={styles.smallAvatarPlaceholder}>
                        <User size={16} color={Colors.muted} />
                      </View>
                    )}
                    <Text style={styles.searchResultUsername}>@{userResult.username}</Text>
                  </View>

                  {isFriend ? (
                    <Text style={styles.statusLabel}>{t.profileScreen.alreadyFriends}</Text>
                  ) : isSent ? (
                    <Text style={styles.statusLabel}>{t.profileScreen.friendRequestSent}</Text>
                  ) : isReceived ? (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptBtn]}
                        onPress={() => handleAcceptRequest(userResult.uid)}
                      >
                        <Check size={16} color={Colors.white} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.declineBtn]}
                        onPress={() => handleDeclineRequest(userResult.uid)}
                      >
                        <X size={16} color={Colors.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleSendRequest(userResult)}
                    >
                      <UserPlus size={16} color={Colors.white} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {hasSearched && !isSearching && searchResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {t.profileScreen.userNotFound}
            </Text>
          </View>
        )}
      </View>

      {/* SUB-TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'my_friends' && styles.tabItemActive]}
          onPress={() => setActiveTab('my_friends')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'my_friends' && styles.tabTextActive]}>
            {t.friendsScreen.tabMyFriends}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'requests' && styles.tabItemActive]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
            {t.friendsScreen.tabRequests}
          </Text>
          {pendingReceivedCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingReceivedCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* MAIN LIST */}
      {activeTab === 'my_friends' ? (
        <FlatList<FriendEntry>
          data={acceptedFriends}
          keyExtractor={(item) => item.uid}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon={<Users size={56} color={Colors.muted} strokeWidth={1.5} />}
                title={t.friendsScreen.tabMyFriends}
                description={t.profileScreen.emptyFriendsList}
              />
            </View>
          }
        />
      ) : (
        <FlatList<any>
          data={getRequestsListData()}
          keyExtractor={(item, index) => item.item?.uid || `header-${index}`}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                </View>
              );
            }
            return renderRequestItem({
              item: item.item,
              isReceived: item.type === 'received',
            });
          }}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyState
                icon={<Users size={56} color={Colors.muted} strokeWidth={1.5} />}
                title={t.friendsScreen.tabRequests}
                description={t.profileScreen.emptyRequestsList}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
