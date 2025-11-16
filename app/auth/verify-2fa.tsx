// app/auth/verify-2fa.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, NativeSyntheticEvent, Pressable, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/api';

export default function Verify2FA() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tempUserId = params.userId as string;

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBackupMode, setIsBackupMode] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9A-Z]/gi, '');
    
    if (numericText.length > 1) {
      const digits = numericText.split('').slice(0, isBackupMode ? 8 : 6);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < (isBackupMode ? 8 : 6)) {
          newCode[index + i] = isBackupMode ? digit.toUpperCase() : digit;
        }
      });
      
      setCode(newCode);
      setError('');
      
      const nextIndex = Math.min(index + digits.length, isBackupMode ? 7 : 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
    const newCode = [...code];
    newCode[index] = isBackupMode ? numericText.toUpperCase() : numericText;
    setCode(newCode);
    setError('');

    if (numericText && index < (isBackupMode ? 7 : 5)) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    const expectedLength = isBackupMode ? 8 : 6;
    
    if (fullCode.length !== expectedLength) {
      setError(`Please enter all ${expectedLength} ${isBackupMode ? 'characters' : 'digits'}`);
      return;
    }

    try {
      setIsVerifying(true);
      setError('');

      // Verify 2FA code
      const verifyResponse = await authService.verify2FA({
        userId: tempUserId,
        token: fullCode,
        isBackupCode: isBackupMode
      });

      if (!verifyResponse.success) {
        setError(verifyResponse.message || 'Invalid code');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      // Complete login and get token
      const loginResponse = await authService.complete2FALogin(tempUserId);

      if (loginResponse.success) {
        // Navigate to home
        router.replace('/home');
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      setError(error.message || 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleBackupMode = () => {
    setIsBackupMode(!isBackupMode);
    setCode(isBackupMode ? ['', '', '', '', '', ''] : ['', '', '', '', '', '', '', '']);
    setError('');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const codeLength = isBackupMode ? 8 : 6;
  const displayCode = isBackupMode ? code : code.slice(0, 6);
  const isCodeComplete = displayCode.every(digit => digit !== '') && displayCode.join('').length === codeLength;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
      <View style={{ marginTop: 20, marginBottom: 32 }}>
        <Text style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>
          Two-Factor Authentication
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
          {isBackupMode ? 'Enter Backup Code' : 'Enter Authentication Code'}
        </Text>
      </View>

      <Text style={{ color: '#666', marginBottom: 24, lineHeight: 20 }}>
        {isBackupMode 
          ? 'Enter one of your 8-character backup codes'
          : 'Open your authenticator app and enter the 6-digit code'
        }
      </Text>

      {/* Code Inputs */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        {displayCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {inputRefs.current[index] = ref}}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType={isBackupMode ? "default" : "number-pad"}
            maxLength={1}
            autoCapitalize={isBackupMode ? "characters" : "none"}
            style={{
              width: isBackupMode ? 40 : 48,
              height: 56,
              borderWidth: 2,
              borderColor: error ? '#EF5B5B' : (digit ? '#5B5FEF' : '#E5E5E5'),
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: digit ? '#F5F5FF' : 'white',
              marginBottom: isBackupMode ? 8 : 0
            }}
          />
        ))}
      </View>

      {/* Error Message */}
      {error ? (
        <View style={{ 
          backgroundColor: '#FEE2E2', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#EF5B5B'
        }}>
          <Text style={{ color: '#EF5B5B', fontSize: 14 }}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* Toggle Backup Mode */}
      <Pressable onPress={toggleBackupMode} style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ color: '#5B5FEF', fontWeight: '600' }}>
          {isBackupMode ? 'Use Authenticator Code' : 'Use Backup Code'}
        </Text>
      </Pressable>

      {/* Verify Button */}
      <Pressable
        onPress={handleVerify}
        disabled={!isCodeComplete || isVerifying}
        style={{
          backgroundColor: (isCodeComplete && !isVerifying) ? '#5B5FEF' : '#C5C7F0',
          padding: 16,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isVerifying && (
          <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
        )}
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}