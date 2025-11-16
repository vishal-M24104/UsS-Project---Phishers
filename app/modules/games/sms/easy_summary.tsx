import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function SmsEasySummary() {
  const { score } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Easy Level Complete 🎉</Text>
      <Text style={styles.score}>Your Score: {score}</Text>

      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/modules/games")}
      >
        <Text style={styles.btnText}>Back to Games</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => router.replace("/modules/games/sms/easy")}
      >
        <Text style={styles.btnSecondaryText}>Play Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  score: { fontSize: 22, marginBottom: 40 },

  btn: {
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "70%",
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "700" },

  btnSecondary: {
    borderWidth: 2,
    borderColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    width: "70%",
  },
  btnSecondaryText: {
    color: "#5B5FEF",
    textAlign: "center",
    fontWeight: "700",
  },
});
