// app/auth/login.tsx - Fixed version
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('🔐 Starting login process...');
      console.log('📧 Email:', email);
      
      const response = await authService.login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      console.log('🔍 Login response received:', {
        success: response.success,
        requiresTwoFactor: response.requiresTwoFactor,
        hasData: !!response.data
      });
      
      // Check if 2FA is required
      if (response.requiresTwoFactor && response.tempUserId) {
        console.log('🔒 2FA required, navigating to verification...');
        router.push({
          pathname: '/auth/verify-2fa',
          params: { userId: response.tempUserId }
        });
        return;
      }
      
      // Check if login was successful
      if (response.success && response.data) {
        console.log('✅ Login successful, navigating to home...');
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.replace('/home');
        }, 100);
      } else {
        console.error('❌ Unexpected response structure');
        throw new Error('Login failed - invalid response');
      }
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (errorMessage.includes('Too many')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('connect')) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      }
      
      setError(errorMessage);
      
      // Show alert for better visibility
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
            Welcome Back
          </Text>
          <Text style={{ color: '#666', fontSize: 16 }}>
            Login to continue
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={{ 
            backgroundColor: '#FEE2E2', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#EF5B5B'
          }}>
            <Text style={{ color: '#EF5B5B', fontSize: 14 }}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#333', fontWeight: '500', marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(''); // Clear error when user types
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            style={{
              borderWidth: 1,
              borderColor: error ? '#EF5B5B' : '#E5E5E5',
              borderRadius: 8,
              padding: 16,
              fontSize: 16,
              backgroundColor: isLoading ? '#F5F5F5' : 'white'
            }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#333', fontWeight: '500', marginBottom: 8 }}>
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(''); // Clear error when user types
            }}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            editable={!isLoading}
            style={{
              borderWidth: 1,
              borderColor: error ? '#EF5B5B' : '#E5E5E5',
              borderRadius: 8,
              padding: 16,
              fontSize: 16,
              backgroundColor: isLoading ? '#F5F5F5' : 'white'
            }}
          />
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#C5C7F0' : '#5B5FEF',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading && (
            <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
          )}
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>Don't have an account? </Text>
          <Link href="/auth/signup" asChild>
            <Pressable disabled={isLoading}>
              <Text style={{ 
                color: isLoading ? '#999' : '#5B5FEF', 
                fontWeight: '600' 
              }}>
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}