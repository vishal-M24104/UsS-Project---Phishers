// app/services/api.tsx - Updated with 2FA methods
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';

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

interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  token?: string;
}

interface LoginResponse {
  success: boolean;
  requiresTwoFactor?: boolean;
  tempUserId?: string;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

interface LoginApiResponse extends ApiResponse {
  requiresTwoFactor?: boolean;
  tempUserId?: string;
}

interface TwoFactorGenerateResponse {
  success: boolean;
  data?: {
    secret: string;
    qrCode: string;
  };
  message?: string;
}

interface TwoFactorEnableResponse {
  success: boolean;
  data?: {
    backupCodes: string[];
  };
  message?: string;
}

interface TwoFactorVerifyRequest {
  userId: string;
  token: string;
  isBackupCode?: boolean;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const token = useAuthStore.getState().token;
      if (token) return token;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
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

      console.log('Making request to:', `${this.baseURL}${endpoint}`);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('Response status:', response.status);

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Response data:', data);
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
        
        const errorMessage = data?.message || data?.error || 'Something went wrong';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error('API request error:', error);
      
      if (error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check your connection and ensure the backend is running.');
      }
      
      throw new Error(error.message || 'Network error');
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
    const response = await this.post<any>('/auth/login', credentials) as LoginApiResponse;
    
    // Check if 2FA is required
    if (response.requiresTwoFactor) {
      return {
        success: response.success,
        requiresTwoFactor: true,
        tempUserId: response.tempUserId,
        message: response.message
      };
    }
    
    // Regular login without 2FA
    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from server');
    }
    
    const authData: AuthResponse = {
      success: response.success,
      message: response.message,
      user: response.data.user,
      token: response.data.token
    };
    
    if (authData.success && authData.token) {
      await useAuthStore.getState().login(authData.user, authData.token);
    }
    
    return {
      success: true,
      data: {
        user: authData.user,
        token: authData.token!
      }
    };
  }

  async signUp(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await this.post<any>('/auth/signup', userData);
      
      console.log('SignUp API response:', response);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response format from server');
      }
      
      const authData: AuthResponse = {
        success: response.success,
        message: response.message,
        user: response.data.user,
        token: response.data.token
      };
      
      return authData;
    } catch (error: any) {
      console.error('SignUp service error:', error);
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
      await this.post('/auth/logout', {});
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      await useAuthStore.getState().logout();
    }
  }

  // 2FA Methods
  async generate2FA(): Promise<TwoFactorGenerateResponse> {
    const response = await this.post<any>('/2fa/generate', {});
    return response;
  }

  async enable2FA(token: string): Promise<TwoFactorEnableResponse> {
    const response = await this.post<any>('/2fa/enable', { token });
    
    // Update user in store to reflect 2FA is now enabled
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

  async verify2FA(data: TwoFactorVerifyRequest): Promise<ApiResponse> {
    const response = await this.post<any>('/2fa/verify', data);
    return response;
  }

  async complete2FALogin(userId: string): Promise<LoginResponse> {
    // After 2FA verification, get the user token
    const response = await this.post<any>('/auth/complete-2fa', { userId });
    
    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from server');
    }
    
    const authData: AuthResponse = {
      success: response.success,
      message: response.message,
      user: response.data.user,
      token: response.data.token
    };
    
    if (authData.success && authData.token) {
      await useAuthStore.getState().login(authData.user, authData.token);
    }
    
    return {
      success: true,
      data: {
        user: authData.user,
        token: authData.token!
      }
    };
  }

  async disable2FA(password: string): Promise<ApiResponse> {
    const response = await this.post<any>('/2fa/disable', { password });
    
    // Update user in store to reflect 2FA is now disabled
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

  async get2FAStatus(): Promise<ApiResponse<{ enabled: boolean; backupCodesRemaining: number }>> {
    const response = await this.get<any>('/2fa/status');
    return response;
  }
}

export const apiService = new ApiService();
export const authService = new AuthService();