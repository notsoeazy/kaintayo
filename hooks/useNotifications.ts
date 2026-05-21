import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { db } from "@/lib/firebase_service";
import { useAuthStore } from "@/store/auth_store";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useTranslation } from "@/hooks/useTranslation";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldBadge: false,
  } as any),
});

export function useNotifications() {
  const { user } = useAuthStore();
  const router = useRouter();
  const seenInviteIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef<boolean>(true);
  const seenSentInviteAcceptances = useRef<Set<string>>(new Set());
  const isFirstSentLoad = useRef<boolean>(true);
  const seenFriendRequestIds = useRef<Set<string>>(new Set());
  const isFirstFriendsLoad = useRef<boolean>(true);
  const { t } = useTranslation();

  // NOTIFICATION PERMISSIONS
  useEffect(() => {
    async function requestPermissions() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }
    requestPermissions();
  }, []);

  // NOTIFICATION ACTIONS
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (!data?.url) return;

      // Guard: redirect to login if not authenticated
      if (!user) {
        router.replace('/(auth)/login_screen');
        return;
      }

      router.push(data.url as any);
    });
    return () => subscription.remove();
  }, [router, user]);

  // FIRESTORE RECEIVED INVITES LISTENER
  useEffect(() => {
    if (!user) {
      seenInviteIds.current.clear();
      isFirstLoad.current = true;
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    let timeoutId: any;
    let isUnsubscribed = false;
    const uid = user.uid;

    function start() {
      if (isUnsubscribed) return;
      const invitesRef = collection(db, "invites");
      const q = query(invitesRef, where("toUid", "==", uid));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (isFirstLoad.current) {
            snapshot.forEach((doc) => {
              seenInviteIds.current.add(doc.id);
            });
            isFirstLoad.current = false;
            return;
          }

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const inviteId = change.doc.id;
              const data = change.doc.data();

              if (!seenInviteIds.current.has(inviteId)) {
                seenInviteIds.current.add(inviteId);

                if (data.status === "pending") {
                  Notifications.scheduleNotificationAsync({
                    content: {
                      title: "Kain Tayo! 🍽️",
                      body: t.invitesScreen.inviteBody
                        .replace('{{username}}', data.fromUsername || '')
                        .replace('{{placeName}}', data.placeName || ''),
                      data: {
                        url: `/detail/${data.placeId}?invitedBy=${data.fromUsername}&inviteId=${inviteId}`,
                      },
                    },
                    trigger: null,
                  });
                }
              }
            }
          });
        },
        (error) => {
          if (
            (error.code === "permission-denied" || error.message?.includes("permission")) &&
            retryCount < maxRetries &&
            !isUnsubscribed
          ) {
            retryCount++;
            const delay = retryCount * 1000;
            timeoutId = setTimeout(start, delay);
          }
        }
      );
    }

    start();

    return () => {
      isUnsubscribed = true;
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  // FIRESTORE SENT INVITES ACCEPTANCE LISTENER
  useEffect(() => {
    if (!user) {
      seenSentInviteAcceptances.current.clear();
      isFirstSentLoad.current = true;
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    let timeoutId: any;
    let isUnsubscribed = false;
    const uid = user.uid;

    function start() {
      if (isUnsubscribed) return;
      const invitesRef = collection(db, "invites");
      const q = query(invitesRef, where("fromUid", "==", uid));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (isFirstSentLoad.current) {
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.status === "accepted") {
                seenSentInviteAcceptances.current.add(doc.id);
              }
            });
            isFirstSentLoad.current = false;
            return;
          }

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
              const inviteId = change.doc.id;
              const data = change.doc.data();

              if (data.status === "accepted" && !seenSentInviteAcceptances.current.has(inviteId)) {
                seenSentInviteAcceptances.current.add(inviteId);

                const body = t.invitesScreen.acceptedNotificationBody
                  .replace("{{username}}", data.toUsername || "Tropa")
                  .replace("{{placeName}}", data.placeName || "sa kainan");

                Notifications.scheduleNotificationAsync({
                  content: {
                    title: t.invitesScreen.acceptedNotificationTitle,
                    body: body,
                    data: {
                      url: "/invites_screen",
                    },
                  },
                  trigger: null,
                });
              }
            }
          });
        },
        (error) => {
          if (
            (error.code === "permission-denied" || error.message?.includes("permission")) &&
            retryCount < maxRetries &&
            !isUnsubscribed
          ) {
            retryCount++;
            const delay = retryCount * 1000;
            timeoutId = setTimeout(start, delay);
          }
        }
      );
    }

    start();

    return () => {
      isUnsubscribed = true;
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, t]);

  // FIRESTORE FRIENDS LISTENER
  useEffect(() => {
    if (!user) {
      seenFriendRequestIds.current.clear();
      isFirstFriendsLoad.current = true;
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    let timeoutId: any;
    let isUnsubscribed = false;
    const uid = user.uid;

    function start() {
      if (isUnsubscribed) return;
      const friendsRef = collection(db, `users/${uid}/friends`);
      unsubscribe = onSnapshot(
        friendsRef,
        (snapshot) => {
          if (isFirstFriendsLoad.current) {
            snapshot.forEach((doc) => {
              seenFriendRequestIds.current.add(doc.id);
            });
            isFirstFriendsLoad.current = false;
            return;
          }

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const requestId = change.doc.id;
              const data = change.doc.data();

              if (!seenFriendRequestIds.current.has(requestId)) {
                seenFriendRequestIds.current.add(requestId);

                if (data.status === "pending_received") {
                  const body = t.friendsScreen.notificationBody.replace(
                    "{{username}}",
                    data.username || "Tropa"
                  );
                  Notifications.scheduleNotificationAsync({
                    content: {
                      title: t.friendsScreen.notificationTitle,
                      body: body,
                      data: {
                        url: "/friends_screen",
                      },
                    },
                    trigger: null,
                  });
                }
              }
            }
          });
        },
        (error) => {
          if (
            (error.code === "permission-denied" || error.message?.includes("permission")) &&
            retryCount < maxRetries &&
            !isUnsubscribed
          ) {
            retryCount++;
            const delay = retryCount * 1000;
            timeoutId = setTimeout(start, delay);
          }
        }
      );
    }

    start();

    return () => {
      isUnsubscribed = true;
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, t]);
}
