// app/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../app/store/authStore';

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // First time launch → set the flag
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.warn('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  // Wait for AsyncStorage check
  if (isFirstLaunch === null) return null;

  // Auth-based redirects
  if (user) return <Redirect href="/home" />;

  // If not logged in and it's not first launch → go to login
  if (!isFirstLaunch) return <Redirect href="/auth/login" />;

  // 🧭 Onboarding screen for first-time users
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#5B5FEF' }}>
          ✱ Phishers
        </Text>
        <Text style={{ color: '#666', marginTop: 8 }}>
          Catch the Phish. Stay Secure.
        </Text>

        <View style={{ width: '100%', marginTop: 48 }}>
          <Pressable
            onPress={() => router.push('/auth/signup')}
            style={{
              backgroundColor: '#5B5FEF',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Sign Up
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/auth/login')}
            style={{
              borderWidth: 2,
              borderColor: '#5B5FEF',
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#5B5FEF', textAlign: 'center', fontWeight: '600' }}>
              Login
            </Text>
          </Pressable>
        </View>

        <Pressable style={{ marginTop: 24 }}>
          <Text style={{ color: '#999' }}>Continue as Guest</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
