import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { NativeSyntheticEvent, Pressable, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyCode() {
  const router = useRouter();

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // If user pastes multiple digits, split them across inputs
      const digits = numericText.split('').slice(0, 6);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      
      setCode(newCode);
      setError('');
      
      // Focus on the next empty input or last input
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);
    setError('');

    // Move focus to next input automatically
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Handle backspace and move focus left
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const fullCode = code.join('');
    
    // Validation: Check if all 6 digits are entered
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    // Validation: Check if all characters are numbers
    if (!/^\d{6}$/.test(fullCode)) {
      setError('Verification code must contain only numbers');
      return;
    }
    
    // Clear error and proceed
    setError('');
    router.push('/auth/success');
  };
  
  const handleResendCode = () => {
    // Clear current code
    setCode(['', '', '', '', '', '']);
    setError('');
    // Focus on first input
    inputRefs.current[0]?.focus();
    // Here you would typically make an API call to resend the code
  };

  // Check if all digits are filled
  const isCodeComplete = code.every(digit => digit !== '') && code.join('').length === 6;

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
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
                borderColor: error ? '#EF5B5B' : (digit ? '#5B5FEF' : '#E5E5E5'),
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

        {/* Error Message */}
        {error ? (
          <Text style={{ color: '#EF5B5B', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
            {error}
          </Text>
        ) : null}

        {/* Resend Code */}
        <Pressable onPress={handleResendCode} style={{ alignItems: 'center' }}>
          <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>Resend Code</Text>
        </Pressable>
      </View>

      {/* Continue Button */}
      <Pressable
        onPress={handleContinue}
        disabled={!isCodeComplete}
        style={{
          backgroundColor: isCodeComplete ? '#5B5FEF' : '#C5C7F0',
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