import { fetchEmailGame } from "@/app/services/gameApi";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useExitWarning from "../../../hooks/useExitWarning";

export default function EmailMediumGame() {
  useExitWarning("/modules/games");

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(12);

  
  const points = 75;
 // 🔥 FETCH API DATA
  useEffect(() => {
    fetchEmailGame("medium").then((res) => {
      setQuestions(res.questions);
      setLoading(false);
    });
  }, []);
  
  // TIMER (text-only)
  useEffect(() => {
    if (loading) return; 
    if (showResult) return;

    if (timeLeft === 0) {
      // Timeout → auto wrong but DO NOT treat as correct
      setIsCorrect(false);
      setShowResult(true);
      return;
    }

    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult]);

  // 4️⃣ NOW UI CONDITIONAL RETURN (safe)
  if (loading || questions.length === 0) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>;
  }

   const question = questions[index];
  const handleAnswer = (userChoice: boolean) => {
    const correct = userChoice === question.isPhishing;

    setIsCorrect(correct);
    if (correct) setScore((s) => s + points);

    setShowResult(true);
  };

  const nextQuestion = () => {
    setIsCorrect(null);
    setShowResult(false);
    setTimeLeft(12);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/email/medium_summary",
        params: { score },
      } as any);
    }
  };

  const exitGame = () => {
    Alert.alert(
      "Exit Game?",
      "Are you sure you want to exit the Medium Level game?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Exit",
          style: "destructive",
          onPress: () => router.replace("/modules/games"),
        },
      ]
    );
  };

  const resultColor = isCorrect ? "#1B5E20" : "#B71C1C";
  const resultBoxBg = isCorrect ? "#E9F7EF" : "#FFF1F0";

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Text style={styles.topLeft}>Question {index + 1}/{questions.length}</Text>
        <Text style={styles.topMiddle}>⏳ {timeLeft}s</Text>
        <Text style={styles.topRight}>Score: {score}</Text>
      </View>

      {/* EXIT BUTTON */}
      <Pressable style={styles.exitBtn} onPress={exitGame}>
        <Text style={styles.exitText}>Exit</Text>
      </Pressable>

      <Text style={styles.title}>Email Phishing</Text>
      <Text style={styles.levelText}>Medium Level</Text>

      {/* EMAIL CARD */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>👤 Sender:</Text>
        <Text style={styles.cardValue}>{question.sender}</Text>

        <Text style={styles.cardLabel}>🚩 Subject:</Text>
        <Text style={styles.cardValue}>{question.subject}</Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>✉️ Email Content:</Text>
        <Text style={styles.cardValue}>{question.body}</Text>
      </View>

      {!showResult ? (
        <>
          <Text style={styles.pointsText}>This question is worth</Text>
          <Text style={styles.pointsValue}>{points} Points</Text>

          <Pressable style={styles.btnRed} onPress={() => handleAnswer(true)}>
            <Text style={styles.btnText}>This is Phishing</Text>
          </Pressable>

          <Pressable style={styles.btnGreen} onPress={() => handleAnswer(false)}>
            <Text style={styles.btnText}>This is Legitimate</Text>
          </Pressable>
        </>
      ) : (
        <View style={[styles.resultBox, { backgroundColor: resultBoxBg }]}>
          <Text style={[styles.resultTitle, { color: resultColor }]}>
            {question.isPhishing ? "This was a PHISHING email!" : "This email was LEGITIMATE!"}
          </Text>

          <Text style={[styles.resultBadge, { color: resultColor }]}>
            {isCorrect ? "Correct! 🎉" : "Wrong ❌"}
          </Text>

          <Text style={styles.resultExplanation}>{question.explanation}</Text>

          <Pressable style={styles.nextBtn} onPress={nextQuestion}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F9FAFB", padding: 20 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topLeft: { fontWeight: "600", color: "#444" },
  topMiddle: { fontWeight: "700", color: "#E53935" },
  topRight: { fontWeight: "700", color: "#5B5FEF" },

  exitBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#EEE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  exitText: { color: "#333", fontWeight: "600" },

  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  levelText: { textAlign: "center", color: "#777", marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30,
    shadowOpacity: 0.05,
  },
  cardLabel: { fontWeight: "700", marginTop: 10 },
  cardValue: { fontSize: 15, color: "#444" },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginVertical: 12,
  },

  pointsText: { textAlign: "center", color: "#777" },
  pointsValue: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#5B5FEF",
    marginBottom: 20,
  },

  btnRed: {
    backgroundColor: "#E57373",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnGreen: {
    backgroundColor: "#66BB6A",
    padding: 16,
    borderRadius: 12,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "700" },

  resultBox: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  resultTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  resultBadge: { fontSize: 16, textAlign: "center", marginBottom: 8 },
  resultExplanation: { textAlign: "center", marginBottom: 16 },

  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 14,
    borderRadius: 12,
  },
});
