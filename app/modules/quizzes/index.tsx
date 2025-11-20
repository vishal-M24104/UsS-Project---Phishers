// app/modules/quizzes/QuizIndex.tsx

import { getLeaderboard } from "@/app/services/scoreApi";
import { useAuthStore } from "@/app/store/authStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuizStore } from "../../store/quizStore";

export default function QuizIndex() {
  const { completed, points, loadProgress } = useQuizStore();
  const user = useAuthStore((s) => s.user);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Load user quiz progress
  useEffect(() => {
    loadProgress();
  }, []);

  // Load leaderboard preview
  useEffect(() => {
    (async () => {
      const res = await getLeaderboard();
      if (res.success) {
        const list = res.leaderboard;

        // Save top 2 for preview
        setTopPlayers(list.slice(0, 2));

        // find user rank
        const index = list.findIndex((u) => u.id === user?.id);
        setUserRank(index >= 0 ? index + 1 : null);
      }
    })();
  }, []);

  // BACK BUTTON — go to /modules
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/modules");
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

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

      {/* Page Title */}
      <Text style={styles.title}>📘 Quiz Hub</Text>

      {/* Total Points Box */}
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Your Total Quiz Points</Text>
        <Text style={styles.scoreValue}>{points}</Text>
      </View>

      {/* Progress Bar */}
      <Text style={styles.progressText}>Progress: {done}/{total} Completed</Text>
      <View style={styles.progressBG}>
        <View style={[styles.progressFG, { width: `${progressPercent}%` }]} />
      </View>

      {/* Quiz Topic Cards */}
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
            onPress={() => router.push(`/modules/quizzes/start?topic=${topic.id}`)}
          >
            <Text style={styles.btnText}>
              {completed[topic.id] ? "Replay" : "Start"}
            </Text>
          </Pressable>
        </View>
      ))}

      {/* Dynamic Leaderboard Preview */}
      <View style={styles.leaderboardBox}>
        <Text style={styles.leaderHeader}>🏆 Leaderboard Preview</Text>

        {/* User Rank */}
        <Text style={styles.youRank}>
          Your Rank: {userRank ?? "Not Ranked"}
        </Text>

        {/* Top Players */}
        {topPlayers.map((p, i) => (
          <Text key={p.id} style={styles.leaderItem}>
            #{i + 1} {p.name} — {p.total} pts
          </Text>
        ))}

        {/* Button to full leaderboard */}
        <Pressable
          onPress={() => router.push("/leaderboard")}
          style={styles.viewFullBtn}
        >
          <Text style={styles.viewFullText}>View Full Leaderboard →</Text>
        </Pressable>
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
  scoreValue: { fontSize: 30, fontWeight: "bold", color: "#5B5FEF" },

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
  btnText: { color: "white", fontWeight: "700" },

  leaderboardBox: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
  },
  leaderHeader: { fontWeight: "700", fontSize: 18, marginBottom: 10 },
  youRank: { fontWeight: "600", marginBottom: 8 },
  leaderItem: { fontSize: 14, marginBottom: 4 },

  viewFullBtn: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#5B5FEF",
    borderRadius: 10,
    alignItems: "center",
  },
  viewFullText: {
    color: "#5B5FEF",
    fontWeight: "700",
  },
});
