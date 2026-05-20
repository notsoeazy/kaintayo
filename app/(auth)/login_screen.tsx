import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth_store';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors } from '@/styles/theme';
import { styles } from '@/styles/screens/login_screen.styles';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuthStore();
  const { t } = useTranslation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data?.idToken) {
        await signInWithGoogle(response.data.idToken);
      }
    } catch (e: any) {
      if (e.code === 'SIGN_IN_CANCELLED') {
        // User cancelled the login flow
      } else if (e.code === 'IN_PROGRESS') {
        // operation (e.g. sign in) is in progress already
      } else if (e.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        // play services not available or outdated
        setError('Google Play Services is not available');
      } else {
        setError(t.loginScreen.errorGoogle);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError(t.loginScreen.errorEmptyFields);
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
        setError(t.loginScreen.errorEmailInUse);
      } else if (e?.code === 'auth/weak-password') {
        setError(t.loginScreen.errorWeakPassword);
      } else if (e?.code === 'auth/invalid-credential') {
        setError(t.loginScreen.errorInvalidCreds);
      } else {
        setError(t.loginScreen.errorGeneric);
      }
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
            <Text style={styles.appName}>{t.loginScreen.appName}</Text>
            <Text style={styles.tagline}>{t.home.title}</Text>
            <Text style={styles.sub}>
              {isLoginMode ? t.loginScreen.loginSubtitle : t.loginScreen.registerSubtitle}
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder={t.loginScreen.emailPlaceholder}
              placeholderTextColor={Colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t.loginScreen.passwordPlaceholder}
                placeholderTextColor={Colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={Colors.muted}
                />
              </Pressable>
            </View>

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
                    {isLoginMode ? t.loginScreen.loginButton : t.loginScreen.registerButton}
                  </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>{t.loginScreen.orText}</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                  activeOpacity={0.85}
                >
                  <FontAwesome
                    name="google"
                    size={18}
                    color={Colors.text}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>
                    {t.loginScreen.googleButton}
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
                      ? t.loginScreen.noAccountText
                      : t.loginScreen.hasAccountText}
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
