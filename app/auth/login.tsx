// app/auth/login.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Email validation
  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError('');
    
    if (!text) {
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
    }
  };
  
  // Password validation
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError('');
    
    if (!text) {
      return;
    }
    
    if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    }
  };
  
  const handleLogin = async () => {
    let hasError = false;
    
    // Check if email is empty
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        hasError = true;
      }
    }
    
    // Check if password is empty
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }
    
    // If no errors, proceed with API call
    if (!hasError) {
      setLoading(true);
      try {
        const response = await authService.login({
          email: email.trim().toLowerCase(),
          password,
        });

        // Check if 2FA is enabled
        if (response.user.twoFactorEnabled) {
          // Navigate to 2FA verification
          router.replace('/auth/select-method');
        } else {
          // Navigate to home (user is already saved in Zustand store)
          router.replace('/home');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#5B5FEF' }}>
            ✱ Phishers
          </Text>
          <Text style={{ color: '#666', marginTop: 8 }}>
            Catch the Phish. Stay Secure.
          </Text>
        </View>
        
        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, color: '#333', fontWeight: '500' }}>
            Email Address
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            borderWidth: 1, 
            borderColor: emailError ? '#EF5B5B' : '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>✉</Text>
            <TextInput
              value={email}
              onChangeText={validateEmail}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
          {emailError ? (
            <Text style={{ color: '#EF5B5B', fontSize: 12, marginTop: 4 }}>
              {emailError}
            </Text>
          ) : null}
        </View>
        
        {/* Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ marginBottom: 8, color: '#333', fontWeight: '500' }}>
            Password
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            borderWidth: 1, 
            borderColor: passwordError ? '#EF5B5B' : '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>🔒</Text>
            <TextInput
              value={password}
              onChangeText={validatePassword}
              placeholder="Enter your password"
              secureTextEntry
              editable={!loading}
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
          {passwordError ? (
            <Text style={{ color: '#EF5B5B', fontSize: 12, marginTop: 4 }}>
              {passwordError}
            </Text>
          ) : null}
        </View>
        
        {/* Login Button */}
        <Pressable 
          onPress={handleLogin}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#9999FF' : '#5B5FEF', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" style={{ marginRight: 8 }} />
          ) : null}
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>
        
        {/* Sign Up Button */}
        <Pressable 
          onPress={() => router.push('/auth/signup')}
          disabled={loading}
          style={{ 
            borderWidth: 2, 
            borderColor: '#5B5FEF', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16,
            opacity: loading ? 0.5 : 1
          }}
        >
          <Text style={{ color: '#5B5FEF', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            Sign Up
          </Text>
        </Pressable>
        
        {/* Divider */}
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <Text style={{ color: '#999' }}>or</Text>
        </View>
        
        {/* Continue as Guest */}
        <Pressable 
          onPress={() => router.replace('/home')}
          disabled={loading}
          style={{ alignItems: 'center', paddingVertical: 8, opacity: loading ? 0.5 : 1 }}
        >
          <Text style={{ color: '#666', fontWeight: '500' }}>
            Continue as Guest
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}