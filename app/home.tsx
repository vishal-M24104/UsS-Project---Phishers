import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 20,
          paddingTop: 10
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Phishers</Text>
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
          {/* Greeting */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
            Hello, Yash!
          </Text>

          {/* Points Card */}
          <View style={{ 
            backgroundColor: '#F5F5FF', 
            padding: 24, 
            borderRadius: 16,
            marginBottom: 24,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
              Your Phish Points
            </Text>
            <Text style={{ 
              fontSize: 48, 
              fontWeight: 'bold', 
              color: '#5B5FEF',
              marginBottom: 4
            }}>
              1,250
            </Text>
            <Text style={{ color: '#666', fontSize: 14 }}>
              Keep up the great work!
            </Text>
          </View>

          {/* Menu Items */}
          <Pressable 
            onPress={() => router.push('/training')}
            style={{ 
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#F0F0FF',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16
            }}>
              <Text style={{ fontSize: 24 }}>🚀</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                Start Training
              </Text>
              <Text style={{ fontSize: 13, color: '#666' }}>
                Hone your phishing detection skills.
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/leaderboard')}
            style={{ 
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#FFF8E1',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16
            }}>
              <Text style={{ fontSize: 24 }}>🏆</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                Leaderboard
              </Text>
              <Text style={{ fontSize: 13, color: '#666' }}>
                See how you rank against others.
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/modules')}
            style={{ 
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <View style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 24, 
              backgroundColor: '#E8F5E9',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16
            }}>
              <Text style={{ fontSize: 24 }}>📖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                Learn About Phishing
              </Text>
              <Text style={{ fontSize: 13, color: '#666' }}>
                Understand common attack methods.
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: '#CCC' }}>›</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ 
        flexDirection: 'row', 
        borderTopWidth: 1, 
        borderTopColor: '#EEE',
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: 'white'
      }}>
        <Pressable style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, marginBottom: 4 }}>🏠</Text>
          <Text style={{ fontSize: 12, color: '#5B5FEF', fontWeight: '600' }}>Home</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/modules')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>📚</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Modules</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/profile')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 24, marginBottom: 4 }}>👤</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}