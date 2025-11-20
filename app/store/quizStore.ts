// app/store/quizStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface State {
  scores: Record<string, number>; // phishing: 300, password: 500 etc
  completed: Record<string, boolean>;
  points: number;
  loadProgress: () => Promise<void>;
  markCompleted: (topic: string, score: number) => Promise<void>;
}

export const useQuizStore = create<State>((set, get) => ({
  scores: {},
  completed: {},
  points: 0,

  loadProgress: async () => {
    const raw = await SecureStore.getItemAsync("quiz_progress");
    if (raw) {
      const data = JSON.parse(raw);
      set(data);
    }
  },

  markCompleted: async (topic, score) => {
    const maxPoints = 500; // 10 questions * 50

    const currentScore = get().scores[topic] || 0;
    const bestScore = Math.min(maxPoints, Math.max(currentScore, score));

    const updated = {
      scores: { ...get().scores, [topic]: bestScore },
      completed: { ...get().completed, [topic]: true },
      points: Object.values({ ...get().scores, [topic]: bestScore }).reduce(
        (a, b) => a + b,
        0
      ),
    };

    await SecureStore.setItemAsync(
      "quiz_progress",
      JSON.stringify(updated)
    );

    set(updated);
  },
}));
