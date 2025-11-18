// app/services/api.ts - Fixed version
import { useAuthStore } from '../store/authStore';
import { secureStorage } from './secureStorage';

const API_BASE_URL = 'http://192.168.33.185:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface User {
  id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
}

interface LoginResponse {
  success: boolean;
  requiresTwoFactor?: boolean;
  tempUserId?: string;
  message?: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

class ApiService {
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const token = useAuthStore.getState().token;
      if (token) return token;
      return await secureStorage.getAccessToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      const token = useAuthStore.getState().refreshToken;
      if (token) return token;
      return await secureStorage.getRefreshToken();
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        await useAuthStore.getState().updateTokens(
          data.data.accessToken,
          data.data.refreshToken
        );
        
        return data.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await useAuthStore.getState().logout();
      return null;
    }
  }

  private onAccessTokenFetched(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('📡 Making request to:', `${this.baseURL}${endpoint}`);

      let response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('📥 Response status:', response.status);

      // Handle 401 - Token expired (only for protected routes)
      if (response.status === 401 && token && !endpoint.includes('/auth/login')) {
        console.log('🔄 Token expired, attempting refresh...');

        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onAccessTokenFetched(newToken);
            
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(`${this.baseURL}${endpoint}`, {
              ...options,
              headers,
            });
          } else {
            throw new Error('Session expired. Please login again.');
          }
        } else {
          const newToken = await new Promise<string>((resolve) => {
            this.addRefreshSubscriber((token: string) => {
              resolve(token);
            });
          });

          headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
          });
        }
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📦 Response data:', data);
      } else {
        const text = await response.text();
        console.log('📄 Response text:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || 'Something went wrong';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error('❌ API request error:', error);
      
      if (error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check your connection.');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class AuthService extends ApiService {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await this.post<any>('/auth/login', credentials);
      
      console.log('🔍 Login response structure:', JSON.stringify(response, null, 2));
      
      // Check if 2FA is required
      if (response.requiresTwoFactor || response.data?.requiresTwoFactor) {
        console.log('🔒 2FA required');
        return {
          success: true,
          requiresTwoFactor: true,
          tempUserId: response.tempUserId || response.data?.tempUserId,
          message: response.message || '2FA verification required'
        };
      }
      
      // Extract tokens from response
      let accessToken: string;
      let refreshToken: string;
      let user: User;

      // Handle different response structures
      if (response.data) {
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        user = response.data.user;
      } else {
        // Fallback if tokens are at root level
        accessToken = response.accessToken;
        refreshToken = response.refreshToken;
        user = response.user;
      }

      if (!accessToken || !refreshToken || !user) {
        console.error('❌ Missing required data in response:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          hasUser: !!user 
        });
        throw new Error('Invalid response format from server');
      }

      console.log('✅ Login successful, saving tokens...');
      
      // Save tokens using the store
      await useAuthStore.getState().login(user, accessToken, refreshToken);
      
      console.log('✅ Tokens saved successfully');
      
      return {
        success: true,
        data: {
          user,
          accessToken,
          refreshToken
        }
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async signUp(userData: { name: string; email: string; password: string }): Promise<any> {
    try {
      console.log('📝 Attempting signup for:', userData.email);
      
      const response = await this.post<any>('/auth/signup', userData);
      
      console.log('✅ Signup response:', response);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response format from server');
      }
      
      return {
        success: response.success,
        message: response.message,
        user: response.data.user
      };
    } catch (error: any) {
      console.error('❌ SignUp error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.get<any>('/auth/profile');
    
    if (!response.data) {
      throw new Error('Invalid response format from server');
    }
    
    useAuthStore.getState().setUser(response.data);
    
    return response.data as User;
  }

  async logout() {
    try {
      const refreshToken = await this.getRefreshToken();
      await this.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      await useAuthStore.getState().logout();
    }
  }

  // 2FA Methods
  async generate2FA(): Promise<any> {
    const response = await this.post<any>('/2fa/generate', {});
    return response;
  }

  async enable2FA(token: string): Promise<any> {
    const response = await this.post<any>('/2fa/enable', { token });
    
    if (response.success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          twoFactorEnabled: true
        });
      }
    }
    
    return response;
  }

  async verify2FA(data: { userId: string; token: string; isBackupCode?: boolean }): Promise<any> {
    const response = await this.post<any>('/2fa/verify', data);
    return response;
  }

  async complete2FALogin(userId: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Completing 2FA login for user:', userId);
      
      const response = await this.post<any>('/auth/complete-2fa', { userId });
      
      console.log('🔍 2FA complete response:', response);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response format from server');
      }

      const { user, accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error('Missing tokens in response');
      }

      console.log('✅ 2FA login successful, saving tokens...');
      
      await useAuthStore.getState().login(user, accessToken, refreshToken);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ 2FA completion error:', error);
      throw error;
    }
  }

  async disable2FA(password: string): Promise<any> {
    const response = await this.post<any>('/2fa/disable', { password });
    
    if (response.success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          twoFactorEnabled: false
        });
      }
    }
    
    return response;
  }

  async get2FAStatus(): Promise<any> {
    const response = await this.get<any>('/2fa/status');
    return response;
  }
}

export const apiService = new ApiService();
export const authService = new AuthService();