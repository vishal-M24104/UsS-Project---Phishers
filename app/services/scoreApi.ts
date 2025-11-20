// app/services/scoreApi.ts
import { apiService } from "./api";

export const postGameScore = async ({
  type,
  level,
  score,
}: {
  type: string;
  level: string;
  score: number;
}) => {
  // ⭐ MUST use apiService.post(), NOT api.post()
  const res = await apiService.post("/score", { type, level, score });
  return res;
};
export const getTotalScore = async () => {
  return apiService.get("/score/total");
};

export const getLeaderboard = async () => {
  return apiService.get("/score/leaderboard");
};
