import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Name validation
  const validateName = (text: string) => {
    setName(text);
    setNameError('');
    
    if (!text) {
      return;
    }
    
    if (text.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    }
  };
  
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
    
    if (text.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(text)) {
      setPasswordError('Password must contain uppercase and lowercase letters');
    } else if (!/(?=.*\d)/.test(text)) {
      setPasswordError('Password must contain at least one number');
    }
    
    // Revalidate confirm password if it has a value
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };
  
  // Confirm password validation
  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
    
    if (!text) {
      return;
    }
    
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    }
  };
  
  const handleSignUp = async () => {
    let hasError = false;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      hasError = true;
    }
    
    // Validate email
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
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordError('Password must contain uppercase and lowercase letters');
      hasError = true;
    } else if (!/(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least one number');
      hasError = true;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }
    
    // If no errors, proceed with API call
    if (!hasError) {
      setLoading(true);
      try {
        console.log('Attempting signup with:', {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          // Don't log password in production!
        });

        const response = await authService.signUp({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        console.log('Signup response:', response);

        // Check if signup was successful
        if (response && response.user) {
          Alert.alert(
            'Success',
            'Account created successfully!',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to select method or login
                  router.replace('/auth/select-method');
                },
              },
            ]
          );
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        console.error('Signup error:', error);
        
        // More detailed error handling
        let errorMessage = 'Failed to create account';
        
        if (error.message) {
          errorMessage = error.message;
        }
        
        // Check for specific error cases
        if (error.message?.toLowerCase().includes('email')) {
          setEmailError('This email is already registered');
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 48 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#5B5FEF' }}>
            ✱ Phishers
          </Text>
          <Text style={{ color: '#666', marginTop: 8 }}>
            Catch the Phish. Stay Secure.
          </Text>
        </View>
        
        {/* Name Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, color: '#333', fontWeight: '500' }}>
            Full Name
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            borderWidth: 1, 
            borderColor: nameError ? '#EF5B5B' : '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>👤</Text>
            <TextInput
              value={name}
              onChangeText={validateName}
              placeholder="John Doe"
              autoCapitalize="words"
              editable={!loading}
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
          {nameError ? (
            <Text style={{ color: '#EF5B5B', fontSize: 12, marginTop: 4 }}>
              {nameError}
            </Text>
          ) : null}
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
        <View style={{ marginBottom: 16 }}>
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
        
        {/* Confirm Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ marginBottom: 8, color: '#333', fontWeight: '500' }}>
            Confirm Password
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            borderWidth: 1, 
            borderColor: confirmPasswordError ? '#EF5B5B' : '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>🔒</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={validateConfirmPassword}
              placeholder="Re-enter your password"
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
          {confirmPasswordError ? (
            <Text style={{ color: '#EF5B5B', fontSize: 12, marginTop: 4 }}>
              {confirmPasswordError}
            </Text>
          ) : null}
        </View>
        
        {/* Sign Up Button */}
        <Pressable 
          onPress={handleSignUp}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </Pressable>
        
        {/* Divider */}
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text style={{ color: '#999' }}>or</Text>
        </View>
        
        {/* Login Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/auth/login')} disabled={loading}>
            <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}