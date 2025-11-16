import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { useQuizStore } from "../../store/quizStore";

export default function QuizIndex() {
  const { completed, points, loadProgress } = useQuizStore();

  // Load saved progress
  useEffect(() => {
    loadProgress();
  }, []);

  const topics = [
    { id: "phishing", title: "Phishing Detection", icon: "🎣" },
    { id: "password", title: "Password Strength", icon: "🔐" },
    { id: "privacy", title: "Data Privacy", icon: "🛡️" },
    { id: "social", title: "Social Engineering", icon: "🧠" },
  ];

  const total = topics.length;
  const done = Object.values(completed).filter(Boolean).length;
  const progressPercent = (done / total) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>📘 Quiz Hub</Text>

      {/* Score Box */}
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Your Points</Text>
        <Text style={styles.scoreValue}>{points}</Text>
      </View>

      {/* Progress Bar */}
      <Text style={styles.progressText}>Progress: {done}/{total} Completed</Text>
      <View style={styles.progressBG}>
        <View style={[styles.progressFG, { width: `${progressPercent}%` }]} />
      </View>

      {/* Quiz List */}
      {topics.map((topic) => (
        <View key={topic.id} style={styles.card}>
          <Text style={styles.icon}>{topic.icon}</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{topic.title}</Text>

            {completed[topic.id] ? (
              <Text style={styles.completedText}>✔ Completed</Text>
            ) : (
              <Text style={styles.pendingText}>• Not Attempted</Text>
            )}
          </View>

          <Pressable
            style={styles.btn}
            onPress={() =>
              router.push(`/modules/quizzes/start?topic=${topic.id}`)
            }
          >
            <Text style={styles.btnText}>
              {completed[topic.id] ? "Replay" : "Start"}
            </Text>
          </Pressable>
        </View>
      ))}

      {/* Leaderboard Placeholder */}
      <View style={styles.leaderboardBox}>
        <Text style={styles.leaderHeader}>🏆 Leaderboard (Static Preview)</Text>
        <Text style={styles.leaderItem}>#1 You — {points} pts</Text>
        <Text style={styles.leaderItem}>#2 Alice — 120 pts</Text>
        <Text style={styles.leaderItem}>#3 Bob — 100 pts</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "white" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  scoreBox: {
    backgroundColor: "#EEF2FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  scoreLabel: { fontSize: 16, color: "#555" },
  scoreValue: { fontSize: 28, fontWeight: "bold", color: "#5B5FEF" },

  progressText: { marginBottom: 6, fontWeight: "600" },
  progressBG: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginBottom: 20,
  },
  progressFG: {
    height: "100%",
    backgroundColor: "#5B5FEF",
    borderRadius: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: "center",
  },
  icon: { fontSize: 32, marginRight: 12 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  completedText: { color: "green", marginTop: 4, fontWeight: "600" },
  pendingText: { color: "#555", marginTop: 4 },

  btn: {
    backgroundColor: "#5B5FEF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },

  leaderboardBox: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
  },
  leaderHeader: { fontWeight: "700", fontSize: 18, marginBottom: 10 },
  leaderItem: { fontSize: 14, marginBottom: 4 },
});
