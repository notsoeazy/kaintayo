import { Tabs, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth_store';
import { CustomTabBar } from '@/components/ui/CustomTabBar';

export default function TabLayout() {
  const { user, isLoading } = useAuthStore();

  if (!isLoading && !user) {
    return <Redirect href="/(auth)/login_screen" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home_screen" options={{ title: 'Home' }} />
      <Tabs.Screen name="map_screen" options={{ title: 'Map' }} />
      <Tabs.Screen name="randomizer_screen" options={{ title: 'Randomizer' }} />
      <Tabs.Screen name="profile_screen" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
