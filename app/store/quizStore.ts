import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface QuizProgressState {
  completed: Record<string, boolean>;
  points: number;

  loadProgress: () => Promise<void>;
  markCompleted: (topic: string, points: number) => Promise<void>;
  resetTopic: (topic: string) => Promise<void>;
}

export const useQuizStore = create<QuizProgressState>((set, get) => ({
  completed: {},
  points: 0,

  loadProgress: async () => {
    const saved = await AsyncStorage.getItem("quizProgress");
    if (saved) set(JSON.parse(saved));
  },

  markCompleted: async (topic, earnedPoints) => {
    const current = get();
    const updated = {
      completed: { ...current.completed, [topic]: true },
      points: current.points + earnedPoints,
    };
    await AsyncStorage.setItem("quizProgress", JSON.stringify(updated));
    set(updated);
  },

  resetTopic: async (topic) => {
    const current = get();
    const updated = {
      ...current,
      completed: { ...current.completed, [topic]: false }
    };
    await AsyncStorage.setItem("quizProgress", JSON.stringify(updated));
    set(updated);
  },
}));
