// app/store/authStore.ts
import { create } from 'zustand';
import { secureStorage } from '../services/secureStorage';

interface User {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;  // Added
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  initialize: () => Promise<void>;  // Added
  updateTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,  // Added

  setUser: (user: User) => {
    set({ user });
  },

  setToken: (token: string) => {
    set({ token });
  },

  setRefreshToken: (token: string) => {
    set({ refreshToken: token });
  },

  login: async (user: User, accessToken: string, refreshToken: string) => {
    try {
      // Save to secure storage
      await secureStorage.saveAccessToken(accessToken);
      await secureStorage.saveRefreshToken(refreshToken);
      await secureStorage.saveUserData(user);

      // Update state
      set({
        user,
        token: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: true,
        isLoading: false
      });

      console.log('✅ Login state updated and tokens stored securely');
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear secure storage
      await secureStorage.clearAll();

      // Clear state
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      });

      console.log('✅ Logout successful, tokens cleared');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });

      // Load from secure storage
      const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
        secureStorage.getAccessToken(),
        secureStorage.getRefreshToken(),
        secureStorage.getUserData()
      ]);

      if (storedToken && storedRefreshToken && storedUser) {
        set({
          token: storedToken,
          refreshToken: storedRefreshToken,
          user: storedUser,
          isAuthenticated: true,
          isLoading: false
        });
        console.log('✅ Auth state restored from secure storage');
      } else {
        set({ isLoading: false });
        console.log('ℹ️ No stored auth found');
      }
    } catch (error) {
      console.error('❌ Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },

  // Initialize method - loads auth state and marks initialization complete
  initialize: async () => {
    try {
      console.log('🔄 Initializing auth store...');
      set({ isLoading: true, isInitialized: false });

      // Load from secure storage
      const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
        secureStorage.getAccessToken(),
        secureStorage.getRefreshToken(),
        secureStorage.getUserData()
      ]);

      if (storedToken && storedRefreshToken && storedUser) {
        set({
          token: storedToken,
          refreshToken: storedRefreshToken,
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true
        });
        console.log('✅ Auth state restored from secure storage');
      } else {
        set({ 
          isLoading: false, 
          isInitialized: true 
        });
        console.log('ℹ️ No stored auth found');
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      set({ 
        isLoading: false, 
        isInitialized: true 
      });
    }
  },

  updateTokens: async (accessToken: string, refreshToken: string) => {
    try {
      await secureStorage.saveAccessToken(accessToken);
      await secureStorage.saveRefreshToken(refreshToken);
      
      set({
        token: accessToken,
        refreshToken: refreshToken
      });

      console.log('✅ Tokens updated successfully');
    } catch (error) {
      console.error('❌ Error updating tokens:', error);
      throw error;
    }
  }
}));