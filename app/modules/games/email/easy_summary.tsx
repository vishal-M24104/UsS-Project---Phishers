import { postGameScore } from "@/app/services/scoreApi"; // <-- NEW
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function EasySummary() {
  const { score } = useLocalSearchParams();
  const numericScore = Number(score) || 0;

  // 🔥 Save score when screen loads
  const saveScore = async () => {
    try {
      const res = await postGameScore({
        type: "email",
        level: "easy",
        score: numericScore,
      });

      console.log("Score saved:", res);
    } catch (err) {
      console.log("Score save failed", err);
      Alert.alert("Error", "Failed to save score.");
    }
  };

  React.useEffect(() => {
    saveScore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Easy Level Complete 🎉</Text>
      <Text style={styles.score}>Your Score: {numericScore}</Text>

      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/modules/games")}
      >
        <Text style={styles.btnText}>Back to Games</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => router.replace("/modules/games/email/easy")}
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
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  score: { fontSize: 24, marginBottom: 40 },

  btn: {
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "70%",
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },

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
    fontWeight: "bold",
    fontSize: 16,
  },
});
