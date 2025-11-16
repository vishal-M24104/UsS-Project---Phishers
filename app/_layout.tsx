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

  // Initialize auth state on app load (runs only once)
  useEffect(() => {
    console.log('🎬 Layout: Initializing app...');
    initialize();
  }, []);

  // Fetch user profile if token exists but user doesn't
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token && !user) {
        console.log('👤 Layout: Fetching user profile...');
        try {
          await authService.getCurrentUser();
          console.log('✅ Layout: User profile fetched');
        } catch (error) {
          console.error('❌ Layout: Failed to fetch user profile:', error);
          // Token is invalid, clear it
          console.log('🗑️ Layout: Clearing invalid token...');
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
    console.log('🧭 Layout: Navigation check - User:', user?.email || 'none', 'Segment:', segments[0]);

    // If user is logged in and on auth screens, redirect to home
    if (user && inAuthGroup) {
      console.log('➡️ Layout: Redirecting logged-in user to home');
      router.replace('/home');
    }

    // If no user and no token, and not on auth screens, optionally redirect
    // (Currently allowing guest access)
  }, [user, segments, isInitialized, router]);

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
    </Stack>
  );
}