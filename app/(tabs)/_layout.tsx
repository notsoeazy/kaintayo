import { Tabs, Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Home, Map, Shuffle, User } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';
import { useTranslation } from '@/hooks/useTranslation';

import { useAuthStore } from '@/store/auth_store';

export default function TabLayout() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuthStore();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login_screen" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home_screen"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="map_screen"
        options={{
          title: t.tabs.map,
          tabBarIcon: ({ color, size }) => (
            <Map color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="randomizer_screen"
        options={{
          title: t.tabs.randomizer,
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.randomizerIcon, { backgroundColor: Colors.primary }]}>
              <Shuffle color="#2C1A0E" size={size - 2} strokeWidth={2} />
            </View>
          ),
          tabBarActiveTintColor: Colors.text,
        }}
      />
      <Tabs.Screen
        name="profile_screen"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    marginBottom: Spacing.xs,
  },
  tabItem: {
    paddingTop: Spacing.xs,
  },
  randomizerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
