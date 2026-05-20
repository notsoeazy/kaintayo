import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { db } from "@/lib/firebase_service";
import { useAuthStore } from "@/store/auth_store";
import { collection, onSnapshot } from "firebase/firestore";
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
      if (data?.url) {
        router.push(data.url as any);
      }
    });
    return () => subscription.remove();
  }, [router]);

  // FIRESTORE INVITES LISTENER
  useEffect(() => {
    if (!user) {
      seenInviteIds.current.clear();
      isFirstLoad.current = true;
      return;
    }

    const invitesRef = collection(db, `users/${user.uid}/invites`);
    const unsubscribe = onSnapshot(invitesRef, (snapshot) => {
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
                  body: `@${data.fromUsername} invited you to eat at ${data.placeName}!`,
                  data: {
                    url: `/detail/${data.placeId}?invitedBy=${data.fromUsername}`,
                  },
                },
                trigger: null,
              });
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  // FIRESTORE FRIENDS LISTENER
  useEffect(() => {
    if (!user) {
      seenFriendRequestIds.current.clear();
      isFirstFriendsLoad.current = true;
      return;
    }

    const friendsRef = collection(db, `users/${user.uid}/friends`);
    const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
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
    });

    return () => unsubscribe();
  }, [user, t]);
}
