import { postGameScore } from "@/app/services/scoreApi"; // ⭐ ADD THIS
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useQuizStore } from "../../store/quizStore";

export default function QuizSummary() {
  const { score, topic } = useLocalSearchParams();
  const numericScore = Number(score) || 0;
  const markCompleted = useQuizStore(state => state.markCompleted);

  // Save both local & backend score
  const saveQuizScore = async () => {
    try {
      // Local progress (your existing logic)
      if (topic && score) {
        markCompleted(String(topic), numericScore);
      }

      // ⭐ New backend saving
      await postGameScore({
        type: "quiz",              // fixed type
        level: String(topic),      // level = topic (phishing/password/etc.)
        score: numericScore,
      });

      console.log("Quiz score saved successfully");
    } catch (err) {
      console.log("Quiz score save failed:", err);
      Alert.alert("Error", "Failed to save quiz score.");
    }
  };

  React.useEffect(() => {
    saveQuizScore();
  }, []);

  const topicEmoji: any = {
    phishing: "📧",
    password: "🔐",
    privacy: "🛡️",
    social: "🕵️‍♂️",
    mixed: "🧠",
  };

  const emoji = topicEmoji[topic] || "🎉";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Complete 🎉</Text>
      <Text style={styles.score}>Your Score: {score}</Text>

      <Pressable
        style={styles.btn}
        onPress={() => router.replace("/modules/quizzes")}
      >
        <Text style={styles.btnText}>Back to Quizzes</Text>
      </Pressable>

      <Pressable
        style={styles.btnSecondary}
        onPress={() =>
          router.replace(`/modules/quizzes/start?topic=${topic}`)
        }
      >
        <Text style={styles.btnSecondaryText}>Replay Quiz</Text>
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
    backgroundColor: "white",
  },

  emoji: {
    fontSize: 70,
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  score: {
    fontSize: 18,
    color: "#666",
  },

  scoreValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#5B5FEF",
    marginBottom: 40,
  },

  btn: {
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    width: "75%",
    marginBottom: 15,
  },

  btnText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 17,
  },

  btnSecondary: {
    borderWidth: 2,
    borderColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
    width: "75%",
  },

  btnSecondaryText: {
    color: "#5B5FEF",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 17,
  },
});
