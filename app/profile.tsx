// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { authService } from '../app/services/api';
// import { useAuthStore } from '../app/store/authStore';
// import { authService } from './services/api';
// import { useAuthStore } from './store/authStore';
import { useAuthStore } from './store/authStore';
import { authService } from './services/api';


export default function Profile() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
const logout = useAuthStore(s => s.logout);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
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
              
              {/* Settings */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                  Settings
                </Text>
                
                <Pressable 
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
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                      {user.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
                </Pressable>
                
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
                style={{ 
                  backgroundColor: '#FF6B6B',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 20
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Logout
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

    </SafeAreaView>
  );
}