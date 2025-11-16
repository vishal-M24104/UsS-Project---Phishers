// app/_layout.tsx
import BottomNav from "./components/BottomNav";
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from './store/authStore';
import { authService } from './services/api';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  const { token, user, isInitialized, initialize } = useAuthStore();

  // Load token from AsyncStorage
  useEffect(() => {
    initialize();
  }, []);

  // Load profile if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (token && !user) {
        try {
          await authService.getCurrentUser();
        } catch (error) {
          console.log('Invalid token detected. Logging out...');
          await authService.logout();
        }
      }
    };

    if (isInitialized) loadProfile();
  }, [token, user, isInitialized]);

  // AUTH GUARD (FINAL WORKING VERSION)
  useEffect(() => {
    if (!isInitialized) return;

    const current = segments[0]; // "auth" or "home" or "profile"

    // 1️⃣ If NOT logged in → force to login
    if (!token) {
      if (current !== 'auth') {
        router.replace('/auth/login');
      }
      return;
    }

    // 2️⃣ If logged in → block auth routes
    if (token && current === 'auth') {
      router.replace('/home');  // or '/profile'
    }
  }, [token, isInitialized, segments]);

  // Loading Screen
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B5FEF" />
      </View>
    );
  }

  return (
  <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="modules" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="modal" />
    </Stack>

    {/* Bottom Nav Visibility Logic */}
{(
  // home
  (segments.length === 1 && segments[0] === "home") ||

  // modules main
  (segments.length === 1 && segments[0] === "modules") ||

  // profile
  (segments.length === 1 && segments[0] === "profile") ||

  // quizzes index
  (segments.length === 2 &&
    segments[0] === "modules" &&
    segments[1] === "quizzes") ||

  // games index  ← ADD THIS
  (segments.length === 2 &&
    segments[0] === "modules" &&
    segments[1] === "games")
) && <BottomNav />}
  </>
);

}
