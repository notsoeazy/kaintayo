import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth_store';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/styles/theme';

export default function Index() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home_screen" />;
  }

  return <Redirect href="/(auth)/login_screen" />;
}
