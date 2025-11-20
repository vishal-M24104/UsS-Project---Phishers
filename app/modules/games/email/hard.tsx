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

export default function EmailHardGame() {
  useExitWarning("/modules/games");

  /** ----------------- ALL HOOKS MUST RUN FIRST ------------------ **/
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(8);
  const [showHeaders, setShowHeaders] = useState(false);

  const points = 100;

  /** ----------------- FETCH DATA ------------------ **/
  useEffect(() => {
    fetchEmailGame("hard").then((res) => {
      setQuestions(res.questions || []);
      setLoading(false);
    });
  }, []);

  /** ----------------- TIMER LOGIC ------------------ **/
  useEffect(() => {
    // WAIT until loading FINISHES
    if (loading) return;

    if (showResult) return;

    if (timeLeft === 0) {
      setIsCorrect(false);
      setShowResult(true);
      return;
    }

    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult, loading]);

  /** ----------------- SAFE RENDER BLOCK ------------------ **/
  // NOW it is safe to return loading screens (AFTER hooks)
  if (loading) {
    return <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>;
  }

  if (!questions.length) {
    return <Text style={{ textAlign: "center", marginTop: 40 }}>No questions found.</Text>;
  }

  /** ----------------- NOW SAFE TO READ QUESTION ------------------ **/
  const question = questions[index];

  const handleAnswer = (choice: boolean) => {
    const correct = choice === question.isPhishing;
    setIsCorrect(correct);

    if (correct) setScore((s) => s + points);

    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(8);
    setShowHeaders(false);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/email/hard_summary",
        params: { score },
      } as any);
    }
  };

  const exitGame = () => {
    Alert.alert(
      "Exit Hard Level?",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => router.replace("/modules/games"),
        },
      ]
    );
  };

  /** ----------------- UI ------------------ **/
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Text style={styles.topTextLeft}>
          Question {index + 1}/{questions.length}
        </Text>
        <Text style={styles.topTextCenter}>⏳ {timeLeft}s</Text>
        <Text style={styles.topTextRight}>Score: {score}</Text>
      </View>

      {/* EXIT */}
      <Pressable style={styles.exitBtn} onPress={exitGame}>
        <Text style={styles.exitText}>Exit</Text>
      </Pressable>

      {/* EMAIL VIEW */}
      <View style={styles.emailContainer}>
        <View style={styles.senderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{question.senderName.charAt(0)}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.senderName}>{question.senderName}</Text>
            <Text style={styles.senderEmail}>{question.senderEmail}</Text>
          </View>

          <Text style={styles.time}>{question.time}</Text>
        </View>

        <Text style={styles.subject}>{question.subject}</Text>
        <Text style={styles.body}>{question.body}</Text>
        <Text style={styles.footer}>{question.footer}</Text>

        <Pressable style={styles.headerBtn} onPress={() => setShowHeaders(!showHeaders)}>
          <Text style={styles.headerBtnText}>
            {showHeaders ? "Hide full header ▲" : "Show full header ▼"}
          </Text>
        </Pressable>

        {showHeaders && (
          <Text style={styles.headersBox}>
            From: {question.senderName} &lt;{question.senderEmail}&gt;{"\n"}
            To: You{"\n"}
            Date: {question.time}{"\n"}
            SPF: {question.isPhishing ? "Fail" : "Pass"}{"\n"}
            DKIM: {question.isPhishing ? "Fail" : "Pass"}
          </Text>
        )}
      </View>

      {/* ANSWERS */}
      {!showResult ? (
        <>
          <Pressable style={styles.btnRed} onPress={() => handleAnswer(true)}>
            <Text style={styles.btnText}>Phishing</Text>
          </Pressable>
          <Pressable style={styles.btnGreen} onPress={() => handleAnswer(false)}>
            <Text style={styles.btnText}>Legitimate</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            {isCorrect ? "Correct 🎉" : "Wrong ❌"}
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
  container: { padding: 20, backgroundColor: "#F9FAFB" },
  topBar: { flexDirection: "row", justifyContent: "space-between" },
  topTextLeft: { fontWeight: "600" },
  topTextCenter: { fontWeight: "700", color: "#D32F2F" },
  topTextRight: { fontWeight: "700", color: "#5B5FEF" },
  exitBtn: { alignSelf: "flex-end", backgroundColor: "#eee", padding: 6, borderRadius: 6, marginVertical: 10 },
  exitText: { fontWeight: "600" },
  emailContainer: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginBottom: 20 },
  senderRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: 40, backgroundColor: "#1976D2", justifyContent: "center", alignItems: "center", marginRight: 10 },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  senderName: { fontSize: 16, fontWeight: "700" },
  senderEmail: { fontSize: 12, color: "#777" },
  time: { fontSize: 12, color: "#777" },
  subject: { marginVertical: 10, fontSize: 20, fontWeight: "700" },
  body: { fontSize: 15, color: "#444", marginBottom: 12 },
  footer: { fontSize: 12, color: "#999" },
  headerBtn: { marginTop: 12 },
  headerBtnText: { textAlign: "center", fontWeight: "600", color: "#1976D2" },
  headersBox: { marginTop: 10, padding: 12, backgroundColor: "#f4f4f4", borderRadius: 8 },
  btnRed: { backgroundColor: "#E57373", padding: 16, borderRadius: 12, marginBottom: 12 },
  btnGreen: { backgroundColor: "#66BB6A", padding: 16, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  resultBox: { marginTop: 20, padding: 20, borderRadius: 12, backgroundColor: "#FFF1F0" },
  resultTitle: { fontWeight: "700", fontSize: 18, textAlign: "center" },
  explanation: { marginTop: 10, fontSize: 14, textAlign: "center" },
  nextBtn: { marginTop: 16, backgroundColor: "#5B5FEF", padding: 16, borderRadius: 12 }
});
