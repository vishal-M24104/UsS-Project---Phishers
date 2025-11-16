import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import smsData from "./sms_hard_data.json";

export default function SmsHardGame() {
  const [index, setIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [typing, setTyping] = useState(true); // typing bubble effect

  const question = smsData[index];
  const points = 50;

  // TYPING EFFECT ----------------------------
  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(t);
  }, [index]);

  const handleAnswer = (choice: boolean) => {
    const correct = choice === question.isPhishing;
    if (correct) setScore((s) => s + points);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setTyping(true);

    if (index + 1 < smsData.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/games/sms/hard_summary",
        params: { score },
      } as any);
    }
  };

  const progressPercent = ((index + 1) / smsData.length) * 100;

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER LIKE CHAT APP */}
      <View style={styles.header}>
        <Text style={styles.avatar}>{question.avatar}</Text>
        <Text style={styles.contact}>{question.contact}</Text>
      </View>

      {/* TOP STATS */}
      <View style={styles.statsRow}>
        <Text style={styles.statsLeft}>
          Question {index + 1}/{smsData.length}
        </Text>
        <Text style={styles.statsRight}>Score: {score}</Text>
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.progressBG}>
        <View style={[styles.progressFG, { width: `${progressPercent}%` }]} />
      </View>

      {/* CHAT BUBBLES */}
      <View style={styles.chatArea}>
        {question.messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.from === "them" ? styles.bubbleThem : styles.bubbleMe,
            ]}
          >
            <Text style={styles.bubbleText}>{msg.text}</Text>
          </View>
        ))}

        {typing && (
          <View style={[styles.bubble, styles.bubbleThem, styles.typingBubble]}>
            <Text style={styles.typingDots}>● ● ●</Text>
          </View>
        )}
      </View>

      {/* BUTTONS */}
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
            {
              backgroundColor: question.isPhishing ? "#FFF1F0" : "#E9F7EF",
            },
          ]}
        >
          <Text style={styles.resultTitle}>
            {question.isPhishing ? "This was PHISHING ❌" : "This was LEGITIMATE ✅"}
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
  container: { backgroundColor: "#F2F4F5", padding: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: { fontSize: 30, marginRight: 10 },
  contact: { fontSize: 20, fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  statsLeft: { fontSize: 13, fontWeight: "600" },
  statsRight: { fontSize: 13, color: "#5B5FEF", fontWeight: "700" },

  progressBG: {
    height: 8,
    backgroundColor: "#DDD",
    borderRadius: 10,
    marginBottom: 20,
  },
  progressFG: {
    height: "100%",
    backgroundColor: "#5B5FEF",
    borderRadius: 10,
  },

  chatArea: { marginBottom: 30 },
  bubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    marginVertical: 6,
  },
  bubbleThem: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  bubbleMe: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  bubbleText: { fontSize: 15, color: "#333" },

  typingBubble: { backgroundColor: "#E7E7E7" },
  typingDots: { color: "#555", fontSize: 16 },

  btnRed: {
    backgroundColor: "#E57373",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnGreen: {
    backgroundColor: "#66BB6A",
    padding: 15,
    borderRadius: 10,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },

  resultBox: { padding: 20, borderRadius: 10, marginTop: 20 },
  resultTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  explanation: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  nextBtn: {
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
});
