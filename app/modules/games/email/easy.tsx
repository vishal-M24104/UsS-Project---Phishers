// app/modules/games/email/easy.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import emailEasyData from "./email_easy_data.json";

export default function EmailEasyGame() {
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const question = emailEasyData[index];
  const points = 50; // Each question worth 50

  const handleAnswer = (userChoice: boolean) => {
    const correct = userChoice === question.isPhishing;
    setIsCorrect(correct);

    if (correct) setScore((s) => s + points);

    setShowResult(true);
  };

  const nextQuestion = () => {
    setIsCorrect(null);
    setShowResult(false);

    if (index + 1 < emailEasyData.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/email/easy_summary",
        params: { score },
      } as any);
    }
  };

  // dynamic styles for result box
  const resultBg = isCorrect ? "#E9F7EF" : "#FFF1F0";
  const resultBorder = isCorrect ? "#2E7D32" : "#C62828";
  const resultTitleColor = isCorrect ? "#1B5E20" : "#B71C1C";
  const resultBadgeText = isCorrect ? "You are right ✅" : "Wrong ❌";

  return (
    <ScrollView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.topText}>
          Question {index + 1}/{emailEasyData.length}
        </Text>
        <Text style={styles.topScore}>Score: {score}</Text>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressOuter}>
        <View
          style={[
            styles.progressInner,
            { width: `${((index + 1) / emailEasyData.length) * 100}%` },
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
          <Text style={styles.pointsText}>This question is worth</Text>
          <Text style={styles.pointsValue}>{points} Points</Text>

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
          <Text style={[styles.resultTitle, { color: resultTitleColor }]}>
            {question.isPhishing ? "This was a PHISHING email!" : "This email was LEGITIMATE!"}
          </Text>

          <View style={{ marginTop: 6, marginBottom: 12 }}>
            <Text
              style={{
                fontWeight: "700",
                color: resultTitleColor,
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              {resultBadgeText}
            </Text>

            <Text style={styles.resultExplanation}>{question.explanation}</Text>
          </View>

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
  topText: { fontSize: 14, fontWeight: "600", color: "#333" },
  topScore: { fontSize: 14, fontWeight: "700", color: "#5B5FEF" },

  progressOuter: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 20,
  },
  progressInner: {
    height: 8,
    backgroundColor: "#5B5FEF",
    borderRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  levelText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardLabel: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 3,
  },
  cardValue: { fontSize: 15, color: "#444" },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginVertical: 12,
  },

  pointsText: {
    textAlign: "center",
    color: "#777",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#5B5FEF",
    marginBottom: 20,
  },

  btnPhishing: {
    backgroundColor: "#E57373",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  btnLegit: {
    backgroundColor: "#66BB6A",
    padding: 16,
    borderRadius: 12,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  resultBox: {
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 6,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  resultExplanation: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 14,
    borderRadius: 10,
  },
});
