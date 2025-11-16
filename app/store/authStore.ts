// store/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => {
    console.log('📝 AuthStore: Setting user:', user?.email || 'null');
    set({ user });
  },
  
  setToken: (token) => {
    console.log('🔑 AuthStore: Setting token:', token ? 'exists' : 'null');
    set({ token });
  },

  login: async (user, token) => {
    try {
      console.log('🔐 AuthStore: Logging in user:', user.email);
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      console.log('✅ AuthStore: Token saved to AsyncStorage');
      
      // Update state
      set({ 
        user, 
        token,
        isLoading: false 
      });
      console.log('✅ AuthStore: Login complete');
    } catch (error) {
      console.error('❌ AuthStore: Error saving auth data:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('🔴 AuthStore: Starting logout...');
      
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      console.log('✅ AuthStore: Token removed from AsyncStorage');
      
      // Clear state
      set({ 
        user: null, 
        token: null,
        isLoading: false 
      });
      console.log('✅ AuthStore: State cleared');
      console.log('🏁 AuthStore: Logout complete');
    } catch (error) {
      console.error('❌ AuthStore: Error clearing auth data:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      console.log('🚀 AuthStore: Initializing...');
      set({ isLoading: true });
      
      // Try to get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔍 AuthStore: Token from storage:', token ? 'exists' : 'null');
      
      if (token) {
        // Token exists, set it in state
        // The app will fetch user profile in _layout
        set({ token });
        console.log('✅ AuthStore: Token set in state');
      } else {
        console.log('ℹ️ AuthStore: No token found');
      }
      
      set({ isInitialized: true, isLoading: false });
      console.log('✅ AuthStore: Initialization complete');
    } catch (error) {
      console.error('❌ AuthStore: Error initializing auth:', error);
      set({ isInitialized: true, isLoading: false });
    }
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      console.log('📝 AuthStore: Updating user data');
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));