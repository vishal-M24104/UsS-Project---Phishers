// app/modules/games/email/easy.tsx
import { fetchEmailGame } from "@/app/services/gameApi";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useExitWarning from "../../../hooks/useExitWarning";

export default function EmailEasyGame() {
  useExitWarning("/modules/games");

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const points = 50;

  // Load API
  useEffect(() => {
    fetchEmailGame("easy")
      .then((res) => {
        // backend returns { questions: [...] }
        setQuestions(res?.questions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to load questions");
        setLoading(false);
      });
  }, []);

  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // NO QUESTIONS FOUND
  if (!questions || questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No questions found.</Text>
      </View>
    );
  }

  const question = questions[index];

  const handleAnswer = (choice: boolean) => {
    const correct = choice === question.isPhishing;
    setIsCorrect(correct);
    if (correct) setScore(score + points);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/email/easy_summary",
        params: { score },
      } as any);
    }
  };

  // styles for result
  const resultBg = isCorrect ? "#E9F7EF" : "#FFF1F0";
  const resultBorder = isCorrect ? "#2E7D32" : "#C62828";
  const resultTitle = isCorrect ? "You are right ✅" : "Wrong ❌";

  return (
    <ScrollView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.topText}>
          Question {index + 1}/{questions.length}
        </Text>
        <Text style={styles.topScore}>Score: {score}</Text>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressOuter}>
        <View
          style={[
            styles.progressInner,
            {
              width: `${((index + 1) / questions.length) * 100}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Email Phishing</Text>
      <Text style={styles.levelText}>Easy Level</Text>

      {/* CARD */}
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
          <Pressable
            style={styles.btnPhishing}
            onPress={() => handleAnswer(true)}
          >
            <Text style={styles.btnText}>This is Phishing</Text>
          </Pressable>

          <Pressable
            style={styles.btnLegit}
            onPress={() => handleAnswer(false)}
          >
            <Text style={styles.btnText}>This is Legitimate</Text>
          </Pressable>
        </>
      ) : (
        <View
          style={[
            styles.resultBox,
            { backgroundColor: resultBg, borderLeftColor: resultBorder },
          ]}
        >
          <Text style={styles.resultTitle}>{resultTitle}</Text>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  topText: { fontSize: 14, fontWeight: "600" },
  topScore: { fontSize: 14, fontWeight: "700", color: "#5B5FEF" },
  progressOuter: { height: 8, backgroundColor: "#E0E0E0", borderRadius: 10, marginBottom: 20 },
  progressInner: { height: 8, backgroundColor: "#5B5FEF", borderRadius: 10 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  levelText: { textAlign: "center", color: "#666", marginBottom: 20 },
  card: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, marginBottom: 30 },
  cardLabel: { fontWeight: "700", marginTop: 10 },
  cardValue: { fontSize: 15, color: "#555" },
  divider: { height: 1, backgroundColor: "#DDD", marginVertical: 12 },
  btnPhishing: { backgroundColor: "#E57373", padding: 16, borderRadius: 12, marginBottom: 12 },
  btnLegit: { backgroundColor: "#66BB6A", padding: 16, borderRadius: 12 },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "700", textAlign: "center" },
  resultBox: { padding: 16, borderRadius: 12, borderLeftWidth: 6, marginTop: 20 },
  resultTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  resultExplanation: { marginTop: 10, fontSize: 14, textAlign: "center" },
  nextBtn: { backgroundColor: "#5B5FEF", padding: 14, borderRadius: 12, marginTop: 10 },
});
