import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSignUp = () => {
    // Add your sign up logic here
    router.push('/select-method');
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
            borderColor: '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>👤</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
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
            borderColor: '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>✉</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
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
            borderColor: '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>🔒</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
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
            borderColor: '#ddd', 
            borderRadius: 8,
            paddingHorizontal: 12,
            backgroundColor: '#f9f9f9'
          }}>
            <Text style={{ marginRight: 8, color: '#999' }}>🔒</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secureTextEntry
              style={{ 
                flex: 1, 
                paddingVertical: 14,
                fontSize: 16,
                color: '#333'
              }}
            />
          </View>
        </View>
        
        {/* Sign Up Button */}
        <Pressable 
          onPress={handleSignUp}
          style={{ 
            backgroundColor: '#5B5FEF', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            Sign Up
          </Text>
        </Pressable>
        
        {/* Divider */}
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text style={{ color: '#999' }}>or</Text>
        </View>
        
        {/* Login Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}