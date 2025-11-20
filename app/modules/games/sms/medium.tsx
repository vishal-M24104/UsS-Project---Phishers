// app/modules/games/sms/medium.tsx
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

export default function SmsMediumGame() {
  useExitWarning("/modules/games");

  /** ---------------- ALL HOOKS MUST RUN FIRST ---------------- **/
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [timer, setTimer] = useState(10);
  const [timeUp, setTimeUp] = useState(false);

  const points = 50;

  /** ---------------- FETCH QUESTIONS ---------------- **/
  useEffect(() => {
    fetchSMSGame("medium").then((res) => {
      setQuestions(res.questions || []);
      setLoading(false);
    });
  }, []);

  /** ---------------- TIMER LOGIC ---------------- **/
  useEffect(() => {
    if (loading) return;      // prevent hook mismatch
    if (showResult) return;

    if (timer === 0) {
      setTimeUp(true);
      setIsCorrect(false);
      setShowResult(true);
      return;
    }

    const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, showResult, loading]);

  /** ---------------- SAFE RENDER BLOCK ---------------- **/
  if (loading) {
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        Loading...
      </Text>
    );
  }

  if (!questions.length) {
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        No questions found.
      </Text>
    );
  }

  /** ---------------- NOW SAFE TO READ QUESTION ---------------- **/
  const question = questions[index];

  /** ---------------- ANSWER HANDLER ---------------- **/
  const handleAnswer = (choice: boolean) => {
    if (showResult) return;

    const correct = choice === question.isPhishing;
    setIsCorrect(correct);

    if (correct) setScore((s) => s + points);

    setShowResult(true);
  };

  /** ---------------- NEXT QUESTION ---------------- **/
  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
    setTimeUp(false);
    setTimer(10);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/sms/medium_summary",
        params: { score },
      } as any);
    }
  };

  const progressPercent = ((index + 1) / questions.length) * 100;

  /** ---------------- UI START ---------------- **/
  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.topRow}>
        <Text style={styles.topLeft}>
          Question {index + 1}/{questions.length}
        </Text>
        <Text style={styles.topRight}>Score: {score}</Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <Text style={styles.title}>SMS Phishing</Text>
      <Text style={styles.level}>Medium Level</Text>

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>⏳ Time Left: {timer}s</Text>
      </View>

      <View style={styles.smsCard}>
        <Text style={styles.sender}>{question.sender}</Text>

        <View style={styles.smsBubble}>
          <Text style={styles.smsText}>{question.message}</Text>
        </View>
      </View>

      {!showResult ? (
        <>
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
            {timeUp
              ? "⏳ Time's Up!"
              : isCorrect
              ? "Correct! 🎉"
              : "Wrong ❌"}
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

  timerBox: {
    backgroundColor: "#FFF3CD",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  timerText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#D35400",
    fontSize: 16,
  },

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
  explanation: { marginVertical: 10, textAlign: "center", color: "#444" },

  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
});
