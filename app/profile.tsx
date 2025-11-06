import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 20
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Phish Finder Profile</Text>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: '#FF6B6B',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ fontSize: 20 }}>💣</Text>
          </View>
        </View>

        <View style={{ padding: 20, paddingTop: 0 }}>
          {/* User Profile Card */}
          <View style={{ 
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: '#E0E0E0',
                marginRight: 16,
                position: 'relative'
              }}>
                <Text style={{ fontSize: 40, textAlign: 'center', lineHeight: 60 }}>👤</Text>
                <View style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  width: 16, 
                  height: 16, 
                  borderRadius: 8, 
                  backgroundColor: '#4CAF50',
                  borderWidth: 2,
                  borderColor: 'white'
                }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>
                  Yash Tupe
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Cybersecurity Analyst
                </Text>
              </View>
              <Pressable style={{ 
                borderWidth: 1, 
                borderColor: '#5B5FEF', 
                paddingHorizontal: 16, 
                paddingVertical: 8, 
                borderRadius: 8 
              }}>
                <Text style={{ color: '#5B5FEF', fontSize: 14, fontWeight: '600' }}>
                  Edit Profile
                </Text>
              </Pressable>
            </View>

            {/* Total Score */}
            <View style={{ 
              backgroundColor: '#F5F5FF', 
              padding: 20, 
              borderRadius: 12,
              alignItems: 'center'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginRight: 8 }}>
                  Total Score
                </Text>
                <Text style={{ fontSize: 16, color: '#666' }}>ⓘ</Text>
              </View>
              <Text style={{ 
                fontSize: 48, 
                fontWeight: 'bold', 
                color: '#5B5FEF',
                marginBottom: 4
              }}>
                7890
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                Points collected over time
              </Text>
            </View>
          </View>

          {/* Badges & Achievements */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Badges & Achievements
            </Text>
            
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                borderRadius: 12, 
                padding: 16,
                marginRight: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2
              }}>
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>🏆</Text>
                  <View style={{ 
                    backgroundColor: '#FFF3CD', 
                    paddingHorizontal: 12, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <Text style={{ fontSize: 12, color: '#856404', fontWeight: '600' }}>
                      Achieved
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                  Phishing Novice
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Completed your first 5 phishing awareness modules.
                </Text>
              </View>

              <View style={{ 
                flex: 1, 
                backgroundColor: 'white', 
                borderRadius: 12, 
                padding: 16,
                marginLeft: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2
              }}>
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>🛡️</Text>
                  <View style={{ 
                    backgroundColor: '#D1ECF1', 
                    paddingHorizontal: 12, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <Text style={{ fontSize: 12, color: '#0C5460', fontWeight: '600' }}>
                      Achieved
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                  Email Defender
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Successfully identified 10 sophisticated phishing emails.
                </Text>
              </View>
            </View>
          </View>

          {/* Training History */}
          <View style={{ marginBottom: 80 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Training History
            </Text>

            {/* Training Item 1 */}
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 12, 
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>📚</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    Advanced Phishing
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#666', marginRight: 12 }}>
                      🕐 2023-11-28
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      ⏱ 45 min
                    </Text>
                  </View>
                </View>
                <View style={{ 
                  backgroundColor: '#E8F5E9', 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12 
                }}>
                  <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600' }}>
                    Phishing
                  </Text>
                </View>
              </View>
              <View style={{ 
                height: 6, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#5B5FEF' 
                }} />
              </View>
            </View>

            {/* Training Item 2 */}
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 12, 
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🔐</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    Password Security Best
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#666', marginRight: 12 }}>
                      🕐 2023-11-20
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      ⏱ 30 min
                    </Text>
                  </View>
                </View>
                <View style={{ 
                  backgroundColor: '#FFF3CD', 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12 
                }}>
                  <Text style={{ fontSize: 12, color: '#856404', fontWeight: '600' }}>
                    Credentials
                  </Text>
                </View>
              </View>
              <View style={{ 
                height: 6, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#5B5FEF' 
                }} />
              </View>
            </View>

            {/* Training Item 3 */}
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 12, 
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>📖</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    Recognizing Malicious
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#666', marginRight: 12 }}>
                      🕐 2023-11-15
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      ⏱ 25 min
                    </Text>
                  </View>
                </View>
                <View style={{ 
                  backgroundColor: '#F8D7DA', 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12 
                }}>
                  <Text style={{ fontSize: 12, color: '#721C24', fontWeight: '600' }}>
                    Malware
                  </Text>
                </View>
              </View>
              <View style={{ 
                height: 6, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#5B5FEF' 
                }} />
              </View>
            </View>

            {/* Training Item 4 */}
            <View style={{ 
              backgroundColor: 'white', 
              borderRadius: 12, 
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>📖</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                    Two-Factor Authentication
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#666', marginRight: 12 }}>
                      🕐 2023-11-01
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      ⏱ 15 min
                    </Text>
                  </View>
                </View>
                <View style={{ 
                  backgroundColor: '#E8F5E9', 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 12 
                }}>
                  <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600' }}>
                    Account
                  </Text>
                </View>
              </View>
              <View style={{ 
                height: 6, 
                backgroundColor: '#E0E0E0', 
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: '#5B5FEF' 
                }} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row', 
        borderTopWidth: 1, 
        borderTopColor: '#EEE',
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: 'white'
      }}>
        <Pressable 
          onPress={() => router.push('/home')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>🏠</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Home</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/modules')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>📚</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Modules</Text>
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 4 }}>👤</Text>
          <Text style={{ fontSize: 12, color: '#5B5FEF', fontWeight: '600' }}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}