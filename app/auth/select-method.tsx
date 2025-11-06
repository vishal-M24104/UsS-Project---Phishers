import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectMethod() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('');
  
  const methods = [
    { id: 'sms', icon: '💬', label: 'Text Message (SMS)' },
    { id: 'email', icon: '✉', label: 'Email' },
    { id: 'call', icon: '📞', label: 'Phone Call' }
  ];
  
  const handleContinue = () => {
    if (selectedMethod) {
      router.push('/auth/verify-code');
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      {/* Header */}
      <View style={{ marginTop: 20, marginBottom: 32 }}>
        <Text style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>
          Two-Factor Authentication
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
          Two-Factor Authentication
        </Text>
      </View>
      
      {/* Description */}
      <Text style={{ color: '#666', marginBottom: 32, lineHeight: 20 }}>
        Choose how you want to receive your verification code
      </Text>
      
      {/* Method Options */}
      <View style={{ marginBottom: 32 }}>
        {methods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderWidth: 2,
              borderColor: selectedMethod === method.id ? '#5B5FEF' : '#E5E5E5',
              borderRadius: 8,
              marginBottom: 16,
              backgroundColor: selectedMethod === method.id ? '#F5F5FF' : 'white'
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Text style={{ fontSize: 20 }}>{method.icon}</Text>
            </View>
            <Text style={{ 
              flex: 1, 
              fontSize: 16, 
              color: '#333',
              fontWeight: selectedMethod === method.id ? '600' : '400'
            }}>
              {method.label}
            </Text>
            {selectedMethod === method.id && (
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#5B5FEF',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 16 }}>✓</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
      
      {/* Verification Code Section */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
          Enter Verification Code
        </Text>
        <Text style={{ color: '#666', lineHeight: 20 }}>
          We sent a 6-digit code to your selected method
        </Text>
      </View>
      
      {/* Continue Button */}
      <Pressable 
        onPress={handleContinue}
        disabled={!selectedMethod}
        style={{ 
          backgroundColor: selectedMethod ? '#5B5FEF' : '#C5C7F0', 
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
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}