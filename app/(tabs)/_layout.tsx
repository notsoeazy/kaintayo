import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Home, Map, Shuffle, User } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing } from '@/styles/theme';

export default function TabLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="map_screen"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Map color={color} size={size} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="randomizer_screen"
        options={{
          title: 'Kahit Saan',
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
          title: 'Profile',
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
    // Sorbetes cart stripe: 2px red + 1px yellow top border effect via shadow
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
