import DifficultyDropdown from "@/components/DifficultyDropdown";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Games() {

  // Back button → go to /home (NO POPUP)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/modules");   // direct to home
        return true;
      };

      // Subscribe
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Cleanup on screen blur
      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
            🎮 Games
          </Text>
        </View>

        <View style={{ padding: 14 }}>
          {/* Email */}
          <View style={{ backgroundColor: "#E3F2FD", padding: 14, borderRadius: 12, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 30, marginRight: 10 }}>📧</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email Phishing Game</Text>
            </View>
            <DifficultyDropdown type="email" />
          </View>

          {/* SMS */}
          <View style={{ backgroundColor: "#FFF3E0", padding: 14, borderRadius: 12, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 30, marginRight: 10 }}>📱</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>SMS Phishing Game</Text>
            </View>
            <DifficultyDropdown type="sms" />
          </View>

          {/* Website */}
          {/* <View style={{ backgroundColor: "#E8F5E9", padding: 14, borderRadius: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 30, marginRight: 10 }}>🌐</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Website Detection Game</Text>
            </View>
            <DifficultyDropdown type="website" />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
