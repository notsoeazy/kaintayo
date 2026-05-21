import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { ChevronLeft, Check, X, Calendar } from 'lucide-react-native';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/invites_screen.styles';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/auth_store';
import { useSocialStore } from '@/store/social_store';
import { EmptyState } from '@/components/ui/EmptyState';
import type { InviteEntry } from '@/types';

type TabType = 'inbox' | 'outbox';

export default function InvitesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    invites,
    sentInvites,
    isLoading,
    fetchInvites,
    respondToInvite,
  } = useSocialStore();

  if (!authLoading && !user) {
    return <Redirect href="/(auth)/login_screen" />;
  }

  const [activeTab, setActiveTab] = useState<TabType>('inbox');
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
  const sortedIncoming = [...invites].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  const sortedSent = [...sentInvites].sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  const pendingIncomingCount = invites.filter((inv) => inv.status === 'pending').length;

  const getInviteDateString = (createdAt: import('firebase/firestore').Timestamp | null | undefined) => {
    if (!createdAt) return '';
    try {
      const date = createdAt.toDate();
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
    const isInbox = activeTab === 'inbox';
    const isPending = item.status === 'pending';

    return (
      <View style={styles.inviteCard}>
        <TouchableOpacity
          style={styles.cardTop}
          activeOpacity={0.7}
          onPress={() => {
            if (isInbox) {
              router.push(`/detail/${item.placeId}?invitedBy=${item.fromUsername}&inviteStatus=${item.status}&inviteId=${item.id}`);
            } else {
              router.push(`/detail/${item.placeId}`);
            }
          }}
        >
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🍽️</Text>
          </View>
          <View style={styles.cardInfo}>
            {isInbox ? (
              <Text style={styles.senderText}>
                {t.invitesScreen.inviteBody
                  .replace('{{username}}', item.fromUsername || '')
                  .replace('{{placeName}}', item.placeName)}
              </Text>
            ) : (
              <Text style={styles.senderText}>
                {t.invitesScreen.invitedUser.replace('{{username}}', item.toUsername || 'Tropa')}
              </Text>
            )}
            <Text style={styles.placeName}>{item.placeName}</Text>
            <Text style={styles.timeText}>{getInviteDateString(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardBottom}>
          {isInbox ? (
            isPending ? (
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
            )
          ) : (
            <View style={styles.statusTextContainer}>
              {item.status === 'pending' && (
                <>
                  <Calendar size={14} color={Colors.primary} />
                  <Text style={[styles.statusText, { color: Colors.primary }]}>
                    {t.invitesScreen.sentPending}
                  </Text>
                </>
              )}
              {item.status === 'accepted' && (
                <>
                  <Check size={14} color={Colors.success} />
                  <Text style={[styles.statusText, styles.statusAccepted]}>
                    {t.invitesScreen.sentAccepted}
                  </Text>
                </>
              )}
              {item.status === 'declined' && (
                <>
                  <X size={14} color={Colors.secondary} />
                  <Text style={[styles.statusText, { color: Colors.secondary }]}>
                    {t.invitesScreen.sentDeclined}
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
    return activeTab === 'inbox' ? sortedIncoming : sortedSent;
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
          style={[styles.tabItem, activeTab === 'inbox' && styles.tabItemActive]}
          onPress={() => setActiveTab('inbox')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'inbox' && styles.tabTextActive]}>
            {t.invitesScreen.tabInbox}
          </Text>
          {pendingIncomingCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingIncomingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'outbox' && styles.tabItemActive]}
          onPress={() => setActiveTab('outbox')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'outbox' && styles.tabTextActive]}>
            {t.invitesScreen.tabOutbox}
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
              title={activeTab === 'inbox' ? t.invitesScreen.tabInbox : t.invitesScreen.tabOutbox}
              description={activeTab === 'inbox' ? t.invitesScreen.emptyInvitesList : t.invitesScreen.emptySentList}
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
