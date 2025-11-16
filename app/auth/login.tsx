// app/auth/login.tsx - Updated with 2FA support
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
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
      
      console.log('🔐 Attempting login...');
      const response = await authService.login({ email, password });
      
      // Check if 2FA is required
      if (response.requiresTwoFactor && response.tempUserId) {
        console.log('🔒 2FA required, navigating to verification...');
        // Navigate to 2FA verification screen with userId
        router.push({
          pathname: '/auth/verify-2fa',
          params: { userId: response.tempUserId }
        });
        return;
      }
      
      // Regular login success (no 2FA)
      console.log('✅ Login successful');
      router.replace('/home');
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed');
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
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 8,
              padding: 16,
              fontSize: 16,
              backgroundColor: 'white'
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
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 8,
              padding: 16,
              fontSize: 16,
              backgroundColor: 'white'
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
            alignItems: 'center'
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
            <Pressable>
              <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}