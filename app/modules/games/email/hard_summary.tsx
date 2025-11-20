import { postGameScore } from "@/app/services/scoreApi"; // ⭐ ADD THIS
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function HardSummary() {
  const { score } = useLocalSearchParams();
  const numericScore = Number(score) || 0;

  // ⭐ SAVE SCORE AUTOMATICALLY
  const saveScore = async () => {
    try {
      const res = await postGameScore({
        type: "email",   // same game type
        level: "hard",   // ⭐ IMPORTANT LEVEL
        score: numericScore,
      });

      console.log("Hard Score Saved:", res);
    } catch (err) {
      console.log("Score save failed", err);
      Alert.alert("Error", "Failed to save score.");
    }
  };

  React.useEffect(() => {
    saveScore();  // ⭐ SAVE ON LOAD
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hard Level Complete 🔥</Text>

      <Text style={styles.score}>Your Score: {numericScore}</Text>

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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 20
  },
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
