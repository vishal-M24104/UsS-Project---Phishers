// app/modules/games/email/hard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import emailHardData from "./email_hard_data.json";

export default function EmailHardGame() {
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(8);
  const [showHeaders, setShowHeaders] = useState(false);

  const question = emailHardData[index];
  const points = 100;

  // TIMER
  useEffect(() => {
    if (showResult) return;

    if (timeLeft === 0) {
      setIsCorrect(false); // timeout = wrong
      setShowResult(true);
      return;
    }

    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult]);

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

    if (index + 1 < emailHardData.length) {
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

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Text style={styles.topTextLeft}>
          Question {index + 1}/{emailHardData.length}
        </Text>
        <Text style={styles.topTextCenter}>⏳ {timeLeft}s</Text>
        <Text style={styles.topTextRight}>Score: {score}</Text>
      </View>

      {/* EXIT BUTTON */}
      <Pressable style={styles.exitBtn} onPress={exitGame}>
        <Text style={styles.exitText}>Exit</Text>
      </Pressable>

      {/* REAL EMAIL UI */}
      <View style={styles.emailContainer}>
        {/* Sender Row */}
        <View style={styles.senderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {question.senderName.charAt(0)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.senderName}>{question.senderName}</Text>
            <Text style={styles.senderEmail}>{question.senderEmail}</Text>
          </View>

          <Text style={styles.time}>{question.time}</Text>
        </View>

        {/* SUBJECT */}
        <Text style={styles.subject}>{question.subject}</Text>

        {/* BODY */}
        <Text style={styles.body}>{question.body}</Text>

        {/* FOOTER */}
        <Text style={styles.footer}>{question.footer}</Text>

        {/* Toggle header */}
        <Pressable
          style={styles.headerBtn}
          onPress={() => setShowHeaders(!showHeaders)}
        >
          <Text style={styles.headerBtnText}>
            {showHeaders ? "Hide full header ▲" : "Show full header ▼"}
          </Text>
        </Pressable>

        {showHeaders && (
          <Text style={styles.headersBox}>
            From: {question.senderName} &lt;{question.senderEmail}&gt;{"\n"}
            To: You {"\n"}
            Date: {question.time} {"\n"}
            SPF: {question.isPhishing ? "Fail" : "Pass"} {"\n"}
            DKIM: {question.isPhishing ? "Fail" : "Pass"}
          </Text>
        )}
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
        <View style={[styles.resultBox, { backgroundColor: isCorrect ? "#E9F7EF" : "#FFF1F0" }]}>
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
  container: { padding: 20, backgroundColor: "#F9FAFB" },

  topBar: { flexDirection: "row", justifyContent: "space-between" },
  topTextLeft: { fontWeight: "600" },
  topTextCenter: { fontWeight: "700", color: "#D32F2F" },
  topTextRight: { fontWeight: "700", color: "#5B5FEF" },

  exitBtn: {
    alignSelf: "flex-end",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  exitText: { fontWeight: "600" },

  emailContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowOpacity: 0.04,
  },

  senderRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 45,
    height: 45,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  senderName: { fontWeight: "700", fontSize: 16 },
  senderEmail: { fontSize: 12, color: "#777" },
  time: { color: "#777", fontSize: 12 },

  subject: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  body: { fontSize: 15, color: "#444", marginBottom: 12 },
  footer: { fontSize: 12, color: "#999" },

  headerBtn: { marginTop: 12 },
  headerBtnText: { textAlign: "center", color: "#1976D2", fontWeight: "600" },

  headersBox: {
    marginTop: 10,
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    color: "#444",
  },

  pointsText: { textAlign: "center", color: "#666" },
  pointsValue: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#5B5FEF",
    marginBottom: 16,
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
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  resultBox: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  resultTitle: { fontSize: 18, fontWeight: "800", textAlign: "center" },
  explanation: { marginVertical: 10, textAlign: "center", color: "#444" },
  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 14,
    borderRadius: 12,
  },
});
