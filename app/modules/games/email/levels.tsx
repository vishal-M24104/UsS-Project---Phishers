import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmailLevels() {
  const levels = [
    { name: "Easy", color: "#E8F5E9" },
    { name: "Medium", color: "#FFFDE7" },
    { name: "Hard", color: "#FFEBEE" }
  ];

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Email Phishing Levels
      </Text>

      {levels.map((lvl) => (
        <Pressable
          key={lvl.name}
          style={{
            backgroundColor: lvl.color,
            padding: 20,
            borderRadius: 16,
            marginBottom: 16
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{lvl.name}</Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            Play {lvl.name.toLowerCase()} level challenge
          </Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}
