import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth_store';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/login_screen.styles';

// Required to complete the OAuth session when returning from browser
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  // GOOGLE OAUTH SETUP
  // In Expo Go, passing the webClientId to all platforms satisfies the hook's requirements
  // without needing native configurations, since Expo Go uses the web proxy flow anyway.
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Lagyan mo ng email at password!');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (isLoginMode) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        setError('Ginagamit na ang email na ito.');
      } else if (e?.code === 'auth/weak-password') {
        setError('Dapat 6 characters pataas ang password.');
      } else if (e?.code === 'auth/invalid-credential') {
        setError('Mali ang email o password.');
      } else {
        setError('May error na nangyari. Subukan ulit!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (idToken: string) => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle(idToken);
    } catch {
      setError('Hindi makapag-login sa Google. Subukan ulit!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* HERO */}
          <View style={styles.heroSection}>
            <Text style={styles.appName}>KainTayo</Text>
            <Text style={styles.tagline}>Saan tayo kakain?</Text>
            <Text style={styles.sub}>
              {isLoginMode ? 'Mag-login para magsimula' : 'Gumawa ng account'}
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loader}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleEmailAuth}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoginMode ? 'Mag-login' : 'Mag-register'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>o kaya</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => promptAsync()}
                  disabled={!request}
                  activeOpacity={0.85}
                >
                  <FontAwesome
                    name="google"
                    size={18}
                    color={Colors.text}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>
                    Mag-login gamit ang Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: 24, alignItems: 'center' }}
                  onPress={() => {
                    setIsLoginMode(!isLoginMode);
                    setError('');
                  }}
                >
                  <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                    {isLoginMode
                      ? 'Wala pang account? Mag-register'
                      : 'May account na? Mag-login'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
