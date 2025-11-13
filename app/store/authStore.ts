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

  setUser: (user) => set({ user }),
  
  setToken: (token) => set({ token }),

  login: async (user, token) => {
    try {
      // Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      
      // Update state
      set({ 
        user, 
        token,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear token from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      
      // Clear state
      set({ 
        user: null, 
        token: null,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Try to get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        // Token exists, set it in state
        // The app will fetch user profile in _layout
        set({ token });
      }
      
      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isInitialized: true, isLoading: false });
    }
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));