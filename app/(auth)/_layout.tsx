import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth_store';

export default function AuthLayout() {
  const { user, isLoading } = useAuthStore();

  if (!isLoading && user) {
    return <Redirect href="/(tabs)/home_screen" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login_screen" />
    </Stack>
  );
}
