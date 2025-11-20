import { postGameScore } from "@/app/services/scoreApi"; // ⭐ MUST ADD THIS
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function SmsMediumSummary() {
  const { score } = useLocalSearchParams();
  const numericScore = Number(score) || 0;

  // ⭐ SAVE_SCORE on screen load
  const saveScore = async () => {
    try {
      const res = await postGameScore({
        type: "sms",      // ⭐ SMS CATEGORY
        level: "medium",  // ⭐ Medium Level
        score: numericScore,
      });

      console.log("SMS Medium score saved:", res);
    } catch (err) {
      console.log("Score save failed", err);
      Alert.alert("Error", "Failed to save SMS medium score.");
    }
  };

  React.useEffect(() => {
    saveScore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Medium Level Complete 🎉</Text>

      <Text style={styles.score}>Your Score: {numericScore}</Text>

      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/modules/games")}
      >
        <Text style={styles.btnText}>Back to Games</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() => router.replace("/modules/games/sms/medium")}
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
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  score: { fontSize: 22, marginBottom: 40 },

  btn: {
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    width: "70%",
    marginBottom: 20
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },

  btnSecondary: {
    borderWidth: 2,
    borderColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    width: "70%"
  },
  btnSecondaryText: {
    color: "#5B5FEF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }
});
