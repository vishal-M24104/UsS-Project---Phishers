import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    // Add your login logic here
    router.push('/select-method');
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
        <View style={{ marginBottom: 24 }}>
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
        
        {/* Login Button */}
        <Pressable 
          onPress={handleLogin}
          style={{ 
            backgroundColor: '#5B5FEF', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            Login
          </Text>
        </Pressable>
        
        {/* Sign Up Button */}
        <Pressable 
          onPress={() => router.push('/signup')}
          style={{ 
            borderWidth: 2, 
            borderColor: '#5B5FEF', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16
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
          onPress={() => router.push('/home')}
          style={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <Text style={{ color: '#666', fontWeight: '500' }}>
            Continue as Guest
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}