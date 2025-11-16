// app/services/api.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';

// Update this with your backend URL
const API_BASE_URL = 'http://192.168.33.185:3000/api';

// For Android emulator use: http://10.0.2.2:3000/api
// For iOS simulator use: http://localhost:3000/api
// For real device use: http://YOUR_LOCAL_IP:3000/api

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Auth-specific types
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

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from Zustand store or AsyncStorage
  private async getAuthToken(): Promise<string | null> {
    try {
      // Try to get from Zustand store first
      const token = useAuthStore.getState().token;
      if (token) return token;
      
      // Fallback to AsyncStorage
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Generic API call method
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
        // Handle unauthorized - logout user
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
        
        // Extract error message from various possible formats
        const errorMessage = data?.message || data?.error || 'Something went wrong';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error('API request error:', error);
      
      // Handle network errors
      if (error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please check your connection and ensure the backend is running.');
      }
      
      throw new Error(error.message || 'Network error');
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Auth Service - extends ApiService with auth-specific methods
class AuthService extends ApiService {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.post<any>('/auth/login', credentials);
    
    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from server');
    }
    
    const authData: AuthResponse = {
      success: response.success,
      message: response.message,
      user: response.data.user,
      token: response.data.token
    };
    
    // Save to Zustand store
    if (authData.success && authData.token) {
      await useAuthStore.getState().login(authData.user, authData.token);
    }
    
    return authData;
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
      
      // Note: We're NOT logging in automatically after signup
      // User will be redirected to login page
      
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
    
    // Update user in store
    useAuthStore.getState().setUser(response.data);
    
    return response.data as User;
  }

    async logout() {
    try {
      // Call backend to invalidate token
      await this.post('/auth/logout', {});
    } catch (error) {
      // Even if backend call fails, we still logout locally
      console.error('Backend logout failed:', error);
    } finally {
      // Always clear from Zustand store (which also clears AsyncStorage)
      await useAuthStore.getState().logout();
    }
  }
}

export const apiService = new ApiService();
export const authService = new AuthService();