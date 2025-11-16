// app/(tabs)/profile.tsx - Updated with 2FA management
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../app/services/api';
import { useAuthStore } from '../app/store/authStore';
import BottomNav from './components/BottomNav';

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await authService.logout();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleEnable2FA = () => {
    router.push('/enable-2fa');
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setIsDisabling(true);
      const response = await authService.disable2FA(disablePassword);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Two-Factor Authentication has been disabled',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowDisable2FAModal(false);
                setDisablePassword('');
              }
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to disable 2FA');
    } finally {
      setIsDisabling(false);
    }
  };

  const toggle2FA = () => {
    if (user?.twoFactorEnabled) {
      setShowDisable2FAModal(true);
    } else {
      handleEnable2FA();
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ 
          padding: 20,
          paddingTop: 10
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Profile
          </Text>
          
          {user ? (
            <>
              {/* User Info Card */}
              <View style={{ 
                backgroundColor: '#F5F5FF', 
                padding: 20, 
                borderRadius: 16,
                marginBottom: 20,
                alignItems: 'center'
              }}>
                <View style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40, 
                  backgroundColor: '#5B5FEF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 36, color: 'white', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                  {user.name}
                </Text>
                <Text style={{ color: '#666', fontSize: 14 }}>
                  {user.email}
                </Text>
              </View>
              
              {/* Stats */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Statistics
                </Text>
                <View style={{ 
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#5B5FEF' }}>
                        1,250
                      </Text>
                      <Text style={{ color: '#666', fontSize: 12 }}>Points</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#5B5FEF' }}>
                        15
                      </Text>
                      <Text style={{ color: '#666', fontSize: 12 }}>Completed</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#5B5FEF' }}>
                        #23
                      </Text>
                      <Text style={{ color: '#666', fontSize: 12 }}>Rank</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Security Settings */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Security
                </Text>
                
                <Pressable 
                  onPress={toggle2FA}
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>🔐</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>
                      Two-Factor Authentication
                    </Text>
                    <Text style={{ 
                      fontSize: 12, 
                      color: user.twoFactorEnabled ? '#10B981' : '#666', 
                      marginTop: 2,
                      fontWeight: user.twoFactorEnabled ? '600' : '400'
                    }}>
                      {user.twoFactorEnabled ? '✓ Enabled' : 'Not enabled'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
                </Pressable>
              </View>
              
              {/* Other Settings */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Settings
                </Text>
                
                <Pressable 
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>
                      Notifications
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
                </Pressable>
              </View>
              
              {/* Logout Button */}
              <Pressable 
                onPress={handleLogout}
                disabled={isLoggingOut}
                style={{ 
                  backgroundColor: isLoggingOut ? '#FF9B9B' : '#FF6B6B',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                {isLoggingOut && (
                  <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                )}
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Guest View */}
              <View style={{ 
                backgroundColor: '#FFF3E0', 
                padding: 20, 
                borderRadius: 16,
                marginBottom: 20,
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>👤</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                  Guest User
                </Text>
                <Text style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>
                  Login to save your progress and compete on the leaderboard
                </Text>
              </View>
              
              {/* Login/Signup Buttons */}
              <Pressable 
                onPress={() => router.push('/auth/login')}
                style={{ 
                  backgroundColor: '#5B5FEF',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 12
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Login
                </Text>
              </Pressable>
              
              <Pressable 
                onPress={() => router.push('/auth/signup')}
                style={{ 
                  borderWidth: 2,
                  borderColor: '#5B5FEF',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#5B5FEF', fontSize: 16, fontWeight: '600' }}>
                  Sign Up
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      {/* Disable 2FA Modal */}
      {showDisable2FAModal && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
              Disable Two-Factor Authentication
            </Text>
            <Text style={{ color: '#666', marginBottom: 24, lineHeight: 20 }}>
              Enter your password to disable 2FA. This will make your account less secure.
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#333', fontWeight: '500', marginBottom: 8 }}>
                Password
              </Text>
              <TextInput
                value={disablePassword}
                onChangeText={setDisablePassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 16,
                  backgroundColor: 'white'
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => {
                  setShowDisable2FAModal(false);
                  setDisablePassword('');
                }}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: '#E5E5E5',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleDisable2FA}
                disabled={isDisabling || !disablePassword}
                style={{
                  flex: 1,
                  backgroundColor: (isDisabling || !disablePassword) ? '#FF9B9B' : '#FF6B6B',
                  padding: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                {isDisabling && (
                  <ActivityIndicator color="white" size="small" style={{ marginRight: 8 }} />
                )}
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                  {isDisabling ? 'Disabling...' : 'Disable'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <BottomNav/>
    </SafeAreaView>
  );
}