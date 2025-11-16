// app/(tabs)/enable-2fa.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, NativeSyntheticEvent, Platform, Pressable, ScrollView, Share, Text, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../app/services/api';

export default function Enable2FA() {
  const router = useRouter();
  
  const [step, setStep] = useState<'generate' | 'verify' | 'backup'>('generate');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    try {
      setIsLoading(true);
      const response = await authService.generate2FA();
      
      if (response.success && response.data) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
      } else {
        Alert.alert('Error', response.message || 'Failed to generate 2FA secret');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate 2FA secret');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      const digits = numericText.split('').slice(0, 6);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      
      setCode(newCode);
      setError('');
      
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);
    setError('');

    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndEnable = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await authService.enable2FA(fullCode);

      if (response.success && response.data?.backupCodes) {
        setBackupCodes(response.data.backupCodes);
        setStep('backup');
      } else {
        setError(response.message || 'Invalid code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCodes = async () => {
    const codesText = backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n');
    const content = `QuizApp Backup Codes\n\n${codesText}\n\nKeep these codes in a safe place. Each code can only be used once.`;

    try {
      if (Platform.OS === 'web') {
        // For web, create a download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'quizapp-backup-codes.txt';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For mobile, use Share API
        await Share.share({
          message: content,
          title: 'QuizApp Backup Codes'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save backup codes');
    }
  };

  const handleFinish = () => {
    Alert.alert(
      'Success!',
      'Two-Factor Authentication has been enabled successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const isCodeComplete = code.every(digit => digit !== '') && code.join('').length === 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        {/* Header */}
        <View style={{ marginTop: 20, marginBottom: 32 }}>
          <Pressable onPress={() => {
            if (step === 'verify') {
              setStep('generate');
              setCode(['', '', '', '', '', '']);
              setError('');
            } else {
              router.back();
            }
          }}>
            <Text style={{ fontSize: 16, color: '#5B5FEF', marginBottom: 8 }}>
              ← {step === 'verify' ? 'Back to QR Code' : 'Back to Profile'}
            </Text>
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
            Enable Two-Factor Authentication
          </Text>
          <Text style={{ fontSize: 14, color: '#999', marginTop: 4 }}>
            {step === 'generate' && 'Step 1 of 3: Scan QR Code'}
            {step === 'verify' && 'Step 2 of 3: Verify Code'}
            {step === 'backup' && 'Step 3 of 3: Save Backup Codes'}
          </Text>
        </View>

        {/* Step 1: Generate & Scan */}
        {step === 'generate' && (
          <>
            {isLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color="#5B5FEF" />
                <Text style={{ marginTop: 16, color: '#666' }}>Generating QR code...</Text>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Step 1: Scan QR Code
                </Text>
                <Text style={{ color: '#666', marginBottom: 24, lineHeight: 20 }}>
                  Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                </Text>

                {/* QR Code */}
                {qrCode && (
                  <View style={{ 
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 16,
                    alignItems: 'center',
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5
                  }}>
                    <Image 
                      source={{ uri: qrCode }}
                      style={{ width: 250, height: 250 }}
                    />
                  </View>
                )}

                {/* Manual Entry */}
                <View style={{ 
                  backgroundColor: '#F5F5FF',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 24
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    Can't scan? Enter this code manually:
                  </Text>
                  <Text style={{ 
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    fontSize: 16,
                    color: '#5B5FEF',
                    letterSpacing: 2
                  }}>
                    {secret}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    console.log('Continue button pressed, moving to verify step');
                    setStep('verify');
                  }}
                  style={{
                    backgroundColor: '#5B5FEF',
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    Continue to Verification
                  </Text>
                </Pressable>
              </>
            )}
          </>
        )}

        {/* Step 2: Verify Code */}
        {step === 'verify' && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
              Step 2: Verify Code
            </Text>
            <Text style={{ color: '#666', marginBottom: 24, lineHeight: 20 }}>
              Enter the 6-digit code from your authenticator app:
            </Text>

            {/* Code Inputs */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginBottom: 16
            }}>
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

            <Pressable
              onPress={handleVerifyAndEnable}
              disabled={!isCodeComplete || isLoading}
              style={{
                backgroundColor: (isCodeComplete && !isLoading) ? '#5B5FEF' : '#C5C7F0',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 8
              }}
            >
              {isLoading && (
                <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
              )}
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {isLoading ? 'Verifying...' : 'Enable 2FA'}
              </Text>
            </Pressable>
          </>
        )}

        {/* Step 3: Backup Codes */}
        {step === 'backup' && (
          <>
            <View style={{ 
              backgroundColor: '#FFF3E0',
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: '#FF9800'
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#E65100' }}>
                ⚠️ Important: Save Your Backup Codes
              </Text>
              <Text style={{ color: '#666', lineHeight: 20 }}>
                Save these codes in a secure location. Each code can only be used once if you lose access to your authenticator app.
              </Text>
            </View>

            {/* Backup Codes Grid */}
            <View style={{ 
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5
            }}>
              {backupCodes.map((code, index) => (
                <View 
                  key={index}
                  style={{ 
                    flexDirection: 'row',
                    paddingVertical: 12,
                    borderBottomWidth: index < backupCodes.length - 1 ? 1 : 0,
                    borderBottomColor: '#E5E5E5'
                  }}
                >
                  <Text style={{ color: '#999', width: 30 }}>{index + 1}.</Text>
                  <Text style={{ 
                    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    fontSize: 16,
                    letterSpacing: 2,
                    color: '#333'
                  }}>
                    {code}
                  </Text>
                </View>
              ))}
            </View>

            {/* Download Button */}
            <Pressable
              onPress={handleDownloadCodes}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#5B5FEF',
                marginBottom: 12
              }}
            >
              <Text style={{ color: '#5B5FEF', fontSize: 16, fontWeight: '600' }}>
                💾 Download Backup Codes
              </Text>
            </Pressable>

            {/* Finish Button */}
            <Pressable
              onPress={handleFinish}
              style={{
                backgroundColor: '#5B5FEF',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Done
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}