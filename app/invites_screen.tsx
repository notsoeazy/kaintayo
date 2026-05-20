import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, X, Calendar } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/invites_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/auth_store';
import { useSocialStore } from '@/store/social_store';
import { EmptyState } from '@/components/ui/EmptyState';
import type { InviteEntry } from '@/types';

type TabType = 'pending' | 'history';

export default function InvitesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    invites,
    isLoading,
    fetchInvites,
    respondToInvite,
  } = useSocialStore();

  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [refreshing, setRefreshing] = useState(false);

  // LIFECYCLE
  useEffect(() => {
    if (user) {
      fetchInvites(user.uid);
    }
  }, [user]);

  // HANDLERS
  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchInvites(user.uid);
      setRefreshing(false);
    }
  };

  const handleRespond = async (inviteId: string, status: 'accepted' | 'declined') => {
    if (!user) return;
    try {
      await respondToInvite(user.uid, inviteId, status);
    } catch (err) {
      // Error is handled in social store state
    }
  };

  // DATA SELECTORS
  const pendingInvites = invites.filter((inv) => inv.status === 'pending');
  const historyInvites = invites.filter((inv) => inv.status === 'accepted' || inv.status === 'declined');
  const pendingCount = pendingInvites.length;

  const getInviteDateString = (createdAt: any) => {
    if (!createdAt) return '';
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  };

  // RENDER
  const renderInviteItem = ({ item }: { item: InviteEntry }) => {
    const isPending = item.status === 'pending';

    return (
      <View style={styles.inviteCard}>
        <TouchableOpacity
          style={styles.cardTop}
          activeOpacity={0.7}
          onPress={() => router.push(`/detail/${item.placeId}`)}
        >
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🍽️</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.senderText}>
              Ininvite ka ni <Text style={styles.senderUsername}>@{item.fromUsername}</Text>
            </Text>
            <Text style={styles.placeName}>{item.placeName}</Text>
            <Text style={styles.timeText}>{getInviteDateString(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardBottom}>
          {isPending ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleRespond(item.id, 'declined')}
                activeOpacity={0.8}
              >
                <X size={16} color={Colors.muted} />
                <Text style={styles.declineButtonText}>
                  {t.invitesScreen.declineBtn}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleRespond(item.id, 'accepted')}
                activeOpacity={0.8}
              >
                <Check size={16} color={Colors.white} />
                <Text style={styles.acceptButtonText}>
                  {t.invitesScreen.acceptBtn}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statusTextContainer}>
              {item.status === 'accepted' ? (
                <>
                  <Check size={14} color={Colors.success} />
                  <Text style={[styles.statusText, styles.statusAccepted]}>
                    {t.invitesScreen.statusAccepted}
                  </Text>
                </>
              ) : (
                <>
                  <X size={14} color={Colors.muted} />
                  <Text style={[styles.statusText, styles.statusDeclined]}>
                    {t.invitesScreen.statusDeclined}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const getFilteredData = () => {
    return activeTab === 'pending' ? pendingInvites : historyInvites;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.invitesScreen.title}</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pending' && styles.tabItemActive]}
          onPress={() => setActiveTab('pending')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            {t.invitesScreen.tabPending}
          </Text>
          {pendingCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            {t.invitesScreen.tabHistory}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST OR EMPTY */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={(item) => item.id}
        renderItem={renderInviteItem}
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<Calendar size={48} color={Colors.muted} />}
              title={activeTab === 'pending' ? t.invitesScreen.pendingInvitesHeader : t.invitesScreen.pastInvitesHeader}
              description={t.invitesScreen.emptyInvitesList}
            />
          ) : (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: 40 }}
            />
          )
        }
      />
    </SafeAreaView>
  );
}
