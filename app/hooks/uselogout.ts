// app/hooks/useLogout.ts
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/api';

export const useLogout = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🔴 Starting logout process...');
      
      // Call logout service (handles backend call + local cleanup)
      await authService.logout();
      console.log('✅ Logout service completed');
      
      // Navigate to login screen
      console.log('🔄 Navigating to login screen...');
      router.replace('/auth/login');
      console.log('✅ Navigation triggered');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
      console.log('🏁 Logout process finished');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Logout cancelled'),
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return {
    logout,
    confirmLogout,
    isLoggingOut,
  };
};