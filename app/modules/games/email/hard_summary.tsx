import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function HardSummary() {
  const { score } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hard Level Complete 🔥</Text>

      <Text style={styles.score}>Your Score: {score}</Text>

      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/modules/games")}
      >
        <Text style={styles.btnText}>Back to Games</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => router.replace("/modules/games/email/hard")}
      >
        <Text style={styles.btnSecondaryText}>Play Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 30, fontWeight: "bold", color: "#D32F2F", marginBottom: 20 },
  score: { fontSize: 24, marginBottom: 40 },

  btn: {
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "70%",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  btnSecondary: {
    borderWidth: 2,
    borderColor: "#D32F2F",
    padding: 15,
    borderRadius: 12,
    width: "70%",
  },
  btnSecondaryText: {
    color: "#D32F2F",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
