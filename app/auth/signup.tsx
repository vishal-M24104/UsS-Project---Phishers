// app/auth/signup.tsx - Updated with @iiitd.ac.in support
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const validateName = (text: string) => {
    setName(text);
    setNameError('');
    if (text && text.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    }
  };
  
  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError('');
    if (text) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setEmailError('Please enter a valid email address');
      } else {
        // Check for valid email providers including IIITD
        const validProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'iiitd.ac.in'];
        const domain = text.toLowerCase().split('@')[1];
        if (!validProviders.includes(domain)) {
          setEmailError('Please use a valid email provider (Gmail, Yahoo, Outlook, IIITD, etc.)');
        }
      }
    }
  };
  
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError('');
    
    if (text) {
      if (text.length < 8) {
        setPasswordError('Password must be at least 8 characters');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(text)) {
        setPasswordError('Password must contain uppercase and lowercase letters');
      } else if (!/(?=.*\d)/.test(text)) {
        setPasswordError('Password must contain at least one number');
      }
    }
    
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };
  
  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
    if (text && text !== password) {
      setConfirmPasswordError('Passwords do not match');
    }
  };
  
  const handleSignUp = async () => {
    let hasError = false;
    
    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      hasError = true;
    }
    
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
    
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }
    
    if (!hasError) {
      setLoading(true);
      try {
        console.log('Attempting signup...');

        const response = await authService.signUp({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        console.log('Signup successful:', response);

        // Show success message and redirect to login
        Alert.alert(
          'Success! 🎉',
          'Your account has been created successfully. Please login to continue.',
          [
            {
              text: 'Go to Login',
              onPress: () => {
                router.replace('/auth/login');
              },
            },
          ]
        );
      } catch (error: any) {
        console.error('Signup error:', error);
        
        let errorMessage = 'Failed to create account';
        
        if (error.message) {
          errorMessage = error.message;
        }
        
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
              placeholder="Name"
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
              placeholder="Email"
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
              placeholder="Password"
              secureTextEntry={!showPassword}
              editable={!loading}
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ fontSize: 18, color: '#999' }}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </Pressable>
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
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={{ fontSize: 18, color: '#999' }}>
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </Pressable>
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