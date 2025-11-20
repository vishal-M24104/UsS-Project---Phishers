import { fetchSMSGame } from "@/app/services/gameApi";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useExitWarning from "../../../hooks/useExitWarning";

export default function SmsEasyGame() {
  useExitWarning("/modules/games");

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  
  const points = 50;
  // 🔥 Fetch from backend
  useEffect(() => {
    fetchSMSGame("easy").then((res) => {
      setQuestions(res.questions);
      setLoading(false);
    });
  }, []);

  // ⏳ Loading screen
  if (loading) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>;
  }

  // 🚫 No questions
  if (!questions || questions.length === 0) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>No questions found.</Text>;
  }

  const question = questions[index];
  const progressPercent = ((index + 1) / questions.length) * 100;

  const handleAnswer = (choice: boolean) => {
    const correct = choice === question.isPhishing;

    setIsCorrect(correct);
    if (correct) setScore((s) => s + points);

    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/sms/easy_summary",
        params: { score },
      } as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* TOP BAR */}
      <View style={styles.topRow}>
        <Text style={styles.topLeft}>
          Question {index + 1}/{questions.length}
        </Text>
        <Text style={styles.topRight}>Score: {score}</Text>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* TITLE */}
      <Text style={styles.title}>SMS Phishing</Text>
      <Text style={styles.level}>Easy Level</Text>

      {/* SMS UI */}
      <View style={styles.smsCard}>
        <Text style={styles.sender}>{question.sender}</Text>

        <View style={styles.smsBubble}>
          <Text style={styles.smsText}>{question.message}</Text>
        </View>
      </View>

      {/* ANSWERS */}
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
        <View
          style={[
            styles.resultBox,
            { backgroundColor: isCorrect ? "#E9F7EF" : "#FFF1F0" },
          ]}
        >
          <Text
            style={[
              styles.resultTitle,
              { color: isCorrect ? "#1B5E20" : "#B71C1C" },
            ]}
          >
            {isCorrect ? "Correct! 🎉" : "Wrong ❌"}
          </Text>

          <Text style={styles.explanation}>{question.explanation}</Text>

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

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  topLeft: { fontWeight: "600", fontSize: 14 },
  topRight: { fontWeight: "700", fontSize: 14, color: "#5B5FEF" },

  progressBackground: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#5B5FEF",
    borderRadius: 10,
  },

  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  level: { textAlign: "center", color: "#777", marginBottom: 20 },

  smsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowOpacity: 0.05,
  },
  sender: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  smsBubble: {
    backgroundColor: "#E3F2FD",
    padding: 14,
    borderRadius: 12,
  },
  smsText: { fontSize: 16, color: "#333" },

  pointsText: { textAlign: "center", color: "#555", marginTop: 10 },
  pointsValue: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 22,
    color: "#5B5FEF",
    marginBottom: 20,
  },

  btnRed: {
    backgroundColor: "#E57373",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnGreen: {
    backgroundColor: "#66BB6A",
    padding: 15,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  resultBox: { padding: 20, borderRadius: 10, marginTop: 20 },
  resultTitle: { textAlign: "center", fontSize: 20, fontWeight: "700" },
  explanation: {
    marginVertical: 10,
    textAlign: "center",
    color: "#444",
  },
  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 14,
    borderRadius: 10,
  },
});
