import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#5B5FEF' }}>
          ✱ Phishers
        </Text>
        <Text style={{ color: '#666', marginTop: 8 }}>
          Catch the Phish. Stay Secure.
        </Text>
        
        <View style={{ width: '100%', marginTop: 48 }}>
          <Pressable 
            onPress={() => router.push('/signup')}
            style={{ 
              backgroundColor: '#5B5FEF', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 16 
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Sign Up
            </Text>
          </Pressable>
          
          <Pressable 
            onPress={() => router.push('/login')}
            style={{ 
              borderWidth: 2, 
              borderColor: '#5B5FEF', 
              padding: 16, 
              borderRadius: 8 
            }}
          >
            <Text style={{ color: '#5B5FEF', textAlign: 'center', fontWeight: '600' }}>
              Login
            </Text>
          </Pressable>
        </View>
        
        <Pressable style={{ marginTop: 24 }}>
          <Text style={{ color: '#999' }}>Continue as Guest</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}