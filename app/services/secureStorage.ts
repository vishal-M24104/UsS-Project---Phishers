// app/services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData'
};

/**
 * Secure storage service using expo-secure-store
 * Falls back to AsyncStorage on web for development
 */
class SecureStorageService {
  /**
   * Save access token securely
   */
  async saveAccessToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Fallback for web (use with caution in production)
        localStorage.setItem(KEYS.ACCESS_TOKEN, token);
      } else {
        await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
      }
    } catch (error) {
      console.error('Error saving access token:', error);
      throw new Error('Failed to save access token');
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(KEYS.ACCESS_TOKEN);
      }
      return await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Save refresh token securely
   */
  async saveRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(KEYS.REFRESH_TOKEN, token);
      } else {
        await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
      }
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw new Error('Failed to save refresh token');
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(KEYS.REFRESH_TOKEN);
      }
      return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Save user data
   */
  async saveUserData(userData: any): Promise<void> {
    try {
      const data = JSON.stringify(userData);
      if (Platform.OS === 'web') {
        localStorage.setItem(KEYS.USER_DATA, data);
      } else {
        await SecureStore.setItemAsync(KEYS.USER_DATA, data);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Get user data
   */
  async getUserData(): Promise<any | null> {
    try {
      let data: string | null;
      
      if (Platform.OS === 'web') {
        data = localStorage.getItem(KEYS.USER_DATA);
      } else {
        data = await SecureStore.getItemAsync(KEYS.USER_DATA);
      }

      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  async clearAll(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(KEYS.ACCESS_TOKEN);
        localStorage.removeItem(KEYS.REFRESH_TOKEN);
        localStorage.removeItem(KEYS.USER_DATA);
      } else {
        await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(KEYS.USER_DATA);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Delete specific item
   */
  async deleteItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
    }
  }
}

export const secureStorage = new SecureStorageService();