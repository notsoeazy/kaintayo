import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import {
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';
import { useAuthStore } from '@/store/auth_store';
import { Colors } from '@/styles/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    Pacifico_400Regular,
    JetBrainsMono_400Regular,
  });

  const { user, isLoading: authLoading, init } = useAuthStore();

  // Start Firebase auth listener on mount
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Hold splash screen until both fonts and auth state are resolved
  useEffect(() => {
    if (fontsLoaded && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg }
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="detail/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="add_spot_screen"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
