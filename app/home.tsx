import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Logo */}
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#5B5FEF', marginBottom: 16 }}>
          ✱ Phishers
        </Text>
        
        {/* Welcome Message */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
          Welcome to Phishers!
        </Text>
        <Text style={{ color: '#666', textAlign: 'center', marginBottom: 48 }}>
          You're now securely logged in
        </Text>
        
        {/* Status Card */}
        <View style={{ 
          width: '100%', 
          backgroundColor: '#F5F5FF', 
          padding: 24, 
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#5B5FEF',
          marginBottom: 24
        }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#5B5FEF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}>
              <Text style={{ fontSize: 30, color: 'white' }}>✓</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
              Secure Session Active
            </Text>
          </View>
          <Text style={{ color: '#666', textAlign: 'center', lineHeight: 20 }}>
            Your account is protected with two-factor authentication
          </Text>
        </View>
        
        {/* Logout Button */}
        <Pressable 
          onPress={() => router.push('/')}
          style={{ 
            width: '100%',
            borderWidth: 2,
            borderColor: '#5B5FEF',
            padding: 16, 
            borderRadius: 8,
            marginTop: 'auto'
          }}
        >
          <Text style={{ color: '#5B5FEF', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}