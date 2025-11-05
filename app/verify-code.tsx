import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent, Pressable, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyCode() {
  const router = useRouter();

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);

  // ✅ Tell TypeScript these are TextInput refs
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // ✅ Move focus to next input automatically
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // ✅ Handle backspace and move focus left
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      router.push('/success');
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
      <Text style={{ color: '#666', marginBottom: 8, lineHeight: 20 }}>
        Choose how you want to receive your verification code
      </Text>

      {/* Selected Methods */}
      <View style={{ marginBottom: 32 }}>
        {[
          { icon: '💬', text: 'Text Message (SMS)' },
          { icon: '✉', text: 'Email' },
          { icon: '📞', text: 'Phone Call' },
        ].map((item, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderWidth: 1,
              borderColor: '#E5E5E5',
              borderRadius: 8,
              marginBottom: 12,
              backgroundColor: '#F9F9F9',
            }}
          >
            <Text style={{ marginRight: 12, fontSize: 20 }}>{item.icon}</Text>
            <Text style={{ flex: 1, color: '#666' }}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Verification Code */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
          Enter Verification Code
        </Text>
        <Text style={{ color: '#666', marginBottom: 24, lineHeight: 20 }}>
          We sent a 6-digit code to your selected method
        </Text>

        {/* Code Inputs */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {inputRefs.current[index] = ref}}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 48,
                height: 56,
                borderWidth: 2,
                borderColor: digit ? '#5B5FEF' : '#E5E5E5',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#333',
                backgroundColor: digit ? '#F5F5FF' : 'white',
              }}
            />
          ))}
        </View>

        {/* Resend Code */}
        <Pressable style={{ alignItems: 'center' }}>
          <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>Resend Code</Text>
        </Pressable>
      </View>

      {/* Continue Button */}
      <Pressable
        onPress={handleContinue}
        disabled={code.join('').length !== 6}
        style={{
          backgroundColor: code.join('').length === 6 ? '#5B5FEF' : '#C5C7F0',
          padding: 16,
          borderRadius: 8,
          marginTop: 'auto',
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
