import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from './components/BottomNav';

export default function LearningModules() {
  const router = useRouter();

  const modules = [
    {
      id: 1,
      icon: '🎮',
      title: 'Games',
      description: 'Engaging activities to make learning',
      color: '#E3F2FD'
    },
    // {
    //   id: 2,
    //   icon: '📹',
    //   title: 'Video Lectures',
    //   description: 'Comprehensive lessons and expert',
    //   color: '#F3E5F5'
    // },
    // {
    //   id: 3,
    //   icon: '🧪',
    //   title: 'Experiments',
    //   description: 'Hands-on practical tasks to apply',
    //   color: '#E8F5E9'
    // },
    {
      id: 4,
      icon: '❓',
      title: 'Quizzes',
      description: 'Test your knowledge with',
      color: '#FFF3E0'
    },
    {
      id: 5,
      icon: '📝',
      title: 'Tutorials',
      description: 'Step-by-step guides to master',
      color: '#FCE4EC'
    },
    {
      id: 6,
      icon: '📂',
      title: 'Case Studies',
      description: 'Real-world examples and',
      color: '#F1F8E9'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
            Learning Modules
          </Text>
        </View>

        {/* Module Grid */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          padding: 20,
          paddingTop: 10,
          justifyContent: 'space-between'
        }}>
          {modules.map((module) => (
            <Pressable 
    key={module.id}
    onPress={() => {
      if (module.title === 'Games') {
        router.push('/modules/games');
      } else if (module.title === 'Quizzes') {
        router.push('/modules/quizzes');   // <-- ADDED
      }
    }}
              style={{ 
                width: '48%',
                backgroundColor: module.color,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                minHeight: 160
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 12 }}>
                {module.icon}
              </Text>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginBottom: 8,
                color: '#333'
              }}>
                {module.title}
              </Text>
              <Text style={{ 
                fontSize: 13, 
                color: '#666',
                lineHeight: 18
              }}>
                {module.description}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <BottomNav/>
    </SafeAreaView>
  );
}