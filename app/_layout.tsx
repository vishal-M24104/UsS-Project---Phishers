// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../app/store/authStore';
import { authService } from './services/api';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { token, user, isInitialized, initialize, setUser } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initialize();
  }, []);

  // Fetch user profile if token exists but user doesn't
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && !user) {
        try {
          await authService.getCurrentUser();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Token is invalid, clear it
          await authService.logout();
        }
      }
    };

    if (isInitialized) {
      fetchUserProfile();
    }
  }, [token, user, isInitialized]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    // If user is logged in and on auth screens, redirect to home
    if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }

    // If user is not logged in and trying to access protected routes
    // You can add protected route logic here if needed
    // For now, we allow guest access to most screens
  }, [user, segments, isInitialized]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#5B5FEF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}