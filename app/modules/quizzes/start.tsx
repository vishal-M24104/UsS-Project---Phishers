// app/modules/quizzes/QuizStart.tsx
import { fetchQuiz } from "@/app/services/gameApi";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import useExitWarning from "../../hooks/useExitWarning";

export default function QuizStart() {
  useExitWarning("/modules/quizzes");

  const { topic } = useLocalSearchParams(); // phishing | password | privacy | social
  const [data, setData] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timer, setTimer] = useState(10);

  // 🔥 LOAD QUIZ FROM BACKEND
  useEffect(() => {
    fetchQuiz(topic as string).then((res) => {
      setData(res.quiz);
    });
  }, [topic]);

  // TIMER
  useEffect(() => {
    if (!data || showResult) return;

    if (timer === 0) {
      setShowResult(true);
      return;
    }

    const t = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, showResult, data]);

  if (!data) {
    return (
      <View style={{ padding: 40 }}>
        <Text style={{ fontSize: 20 }}>Loading quiz...</Text>
      </View>
    );
  }

  const question = data.questions[index];

  const submitAnswer = (i: number) => {
    if (showResult) return;

    setSelected(i);

    if (i === question.correctIndex) {
      setScore((s) => s + question.points);
    }

    setShowResult(true);
  };

  const next = () => {
    setSelected(null);
    setShowHint(false);
    setTimer(10);
    setShowResult(false);

    if (index + 1 < data.questions.length) {
      setIndex(index + 1);
    } else {
      router.replace({
        pathname: "/modules/quizzes/summary",
        params: { score, topic },
      } as any);
    }
  };

  const progressPercent = ((index + 1) / data.questions.length) * 100;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.header}>{data.title}</Text>
      <Text style={styles.sub}>{data.instructions}</Text>
      {/* NEW UI */}
<View style={styles.topBar}>
  <Text style={styles.qsText}>
    Question {index + 1}/{data.questions.length}
  </Text>
  <Text style={styles.qsText}>Score: {score}</Text>
</View>
      <View style={styles.progressBG}>
        <View style={[styles.progressFG, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.timerBox}>
        <Text style={styles.timerText}>⏳ {timer}s</Text>
      </View>

      <Text style={styles.question}>{question.question}</Text>

      {!showHint && (
        <Pressable style={styles.hintBtn} onPress={() => setShowHint(true)}>
          <Text style={styles.hintText}>💡 Show Hint</Text>
        </Pressable>
      )}

      {showHint && (
        <Text style={styles.hintBox}>Hint: {question.hint}</Text>
      )}

      {question.options.map((opt: string, idx: number) => (
        <Pressable
          key={idx}
          onPress={() => submitAnswer(idx)}
          style={[
            styles.option,
            showResult && idx === question.correctIndex
              ? styles.correct
              : showResult && selected === idx
              ? styles.wrong
              : {},
          ]}
        >
          <Text>{opt}</Text>
        </Pressable>
      ))}

      {showResult && (
        <Pressable style={styles.nextBtn} onPress={next}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  sub: { fontSize: 14, color: "#555", marginBottom: 20 },

  progressBG: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 15,
  },
  progressFG: {
    height: "100%",
    backgroundColor: "#5B5FEF",
    borderRadius: 10,
  },

  timerBox: {
    alignSelf: "center",
    padding: 8,
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    marginBottom: 20,
  },
  timerText: { fontSize: 18, fontWeight: "bold" },

  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 10,
  },
  correct: { backgroundColor: "#E8F5E9", borderColor: "#2E7D32" },
  wrong: { backgroundColor: "#FFEBEE", borderColor: "#C62828" },

  hintBtn: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  hintText: { textAlign: "center", fontWeight: "600" },

  hintBox: {
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  nextBtn: {
    marginTop: 20,
    backgroundColor: "#5B5FEF",
    padding: 15,
    borderRadius: 12,
  },
  nextText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  topBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  paddingHorizontal: 4
},

qsText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#5B5FEF"
},

});
