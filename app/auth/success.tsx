import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Success() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      {/* Header */}
      <View style={{ marginTop: 20, marginBottom: 32 }}>
        <Text style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>
          Verification Success
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
          Verification Successful
        </Text>
      </View>
      
      {/* Success Icon */}
      <View style={{ alignItems: 'center', marginTop: 60, marginBottom: 40 }}>
        <View style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#F5F5FF',
          borderWidth: 4,
          borderColor: '#5B5FEF',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: 60, color: '#5B5FEF' }}>✓</Text>
        </View>
      </View>
      
      {/* Success Message */}
      <Text style={{ 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#333', 
        textAlign: 'center',
        marginBottom: 12
      }}>
        Verification Successful
      </Text>
      
      <Text style={{ 
        color: '#666', 
        textAlign: 'center',
        lineHeight: 22,
        fontSize: 16,
        marginBottom: 60
      }}>
        You are now logged in securely
      </Text>
      
      {/* Go to Home Button */}
      <Pressable 
        onPress={() => router.push('/home')}
        style={{ 
          backgroundColor: '#5B5FEF', 
          padding: 16, 
          borderRadius: 8,
          marginTop: 'auto'
        }}
      >
        <Text style={{ 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: '600', 
          fontSize: 16 
        }}>
          Go to HOME
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}