/*
Usage:
<InviteFriendsModal
  visible={showInviteModal}
  placeId={place.id}
  placeName={place.name}
  onClose={() => setShowInviteModal(false)}
/>
*/

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { X, Send, User } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSocialStore } from '@/store/social_store';
import { useAuthStore } from '@/store/auth_store';
import { useProfileStore } from '@/store/profile_store';

interface InviteFriendsModalProps {
  visible: boolean;
  placeId: string;
  placeName: string;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function InviteFriendsModal({ visible, placeId, placeName, onClose }: InviteFriendsModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { friends, inviteToPlace, fetchFriends, sentInvites } = useSocialStore();

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [internalVisible, setInternalVisible] = useState(visible);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // ANIMATION EFFECTS
  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      if (user) {
        fetchFriends(user.uid);
      }
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 12,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setInternalVisible(false));
    }
  }, [visible, user]);

  const acceptedFriends = friends.filter((f) => f.status === 'accepted');

  const isAlreadyInvited = (friendId: string) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return sentInvites.some((invite) => {
      if (invite.toUid !== friendId || invite.placeId !== placeId) return false;
      if (!invite.createdAt) return false;
      const createdAtMs = invite.createdAt.toMillis();
      return createdAtMs > oneDayAgo;
    });
  };

  const handleSendInvite = async (friendId: string, friendUsername: string) => {
    if (!user || !profile?.username) return;
    setSendingId(friendId);
    try {
      await inviteToPlace(user.uid, profile.username, friendId, friendUsername, placeId, placeName);
      Alert.alert('Na-invite na!', `Napadalhan na natin ng notification si @${friendUsername}.`);
    } catch (err: any) {
      console.error('Send invite error:', err);
      if (err?.message === 'ALREADY_INVITED') {
        const msg = t.detailScreen.inviteAlreadySent.replace('{{username}}', friendUsername);
        Alert.alert('Ops!', msg);
      } else {
        Alert.alert('Ops!', 'Failed to send invite. Please try again.');
      }
    } finally {
      setSendingId(null);
    }
  };

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* BACKDROP */}
        <Animated.View style={[styles.backdrop, { opacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* SHEET */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.dragArea}>
            <View style={styles.dragHandle} />
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{t.detailScreen.inviteTropaButton}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={12}>
              <X size={20} color={Colors.muted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.lg }]}
            showsVerticalScrollIndicator={false}
          >
            {acceptedFriends.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t.profileScreen.emptyFriendsList}</Text>
              </View>
            ) : (
              acceptedFriends.map((friend) => {
                const invited = isAlreadyInvited(friend.uid);
                return (
                  <View key={friend.uid} style={styles.friendRow}>
                    <View style={styles.userInfo}>
                      {friend.photoUrl ? (
                        <Image source={friend.photoUrl} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <User size={20} color={Colors.muted} />
                        </View>
                      )}
                      <Text style={styles.username}>@{friend.username}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.sendButton,
                        (sendingId === friend.uid || invited) && styles.sendButtonDisabled,
                      ]}
                      onPress={() => handleSendInvite(friend.uid, friend.username)}
                      disabled={sendingId === friend.uid || invited}
                      activeOpacity={0.7}
                    >
                      {sendingId === friend.uid ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : invited ? (
                        <Text style={styles.sendButtonText}>{t.detailScreen.invitedButton}</Text>
                      ) : (
                        <>
                          <Text style={styles.sendButtonText}>Aya!</Text>
                          <Send size={14} color={Colors.white} />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 26, 14, 0.45)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: '60%',
  },
  dragArea: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  closeButton: {
    backgroundColor: Colors.linen,
    borderRadius: Radius.full,
    padding: Spacing.xs,
  },
  scrollArea: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.linen,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.linen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.muted,
  },
  sendButtonText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
});
