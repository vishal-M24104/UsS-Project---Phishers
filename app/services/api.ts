// app/services/api.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

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

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Save auth token to storage
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  // Remove auth token from storage
  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
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
      console.log('Request headers:', headers);
      console.log('Request body:', options.body);

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
    
    // Backend returns: { success: true, message: "...", data: { user, token } }
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
      await this.saveAuthToken(authData.token);
    }
    
    return authData;
  }

  async signUp(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await this.post<any>('/auth/signup', userData);
      
      console.log('SignUp API response:', response);
      
      // Backend returns: { success: true, message: "...", data: { user, token } }
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response format from server');
      }
      
      const authData: AuthResponse = {
        success: response.success,
        message: response.message,
        user: response.data.user,
        token: response.data.token
      };
      
      // Save token if present
      if (authData.success && authData.token) {
        await this.saveAuthToken(authData.token);
        console.log('Auth token saved successfully');
      }
      
      return authData;
    } catch (error: any) {
      console.error('SignUp service error:', error);
      throw error;
    }
  }

  async verifyCode(data: { code: string; userId?: string }) {
    const response = await this.post('/auth/verify-code', data);
    return response.data || response;
  }

  async logout() {
    await this.removeAuthToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.get<any>('/auth/profile');
    
    // Backend returns: { success: true, data: { user } }
    if (!response.data) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data as User;
  }
}

export const apiService = new ApiService();
export const authService = new AuthService();