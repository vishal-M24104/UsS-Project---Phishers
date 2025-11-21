// app/services/scoreApi.ts
import { apiService } from "./api";

// Define the leaderboard user type
export interface LeaderboardUser {
  id: string; // Changed from number to string based on API response
  name: string;
  email: string;
  total: number;
  scores?: Record<string, number>;
}

// Define the leaderboard response type
export interface LeaderboardResponse {
  success: true;
  leaderboard: LeaderboardUser[];
}

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

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const response = await apiService.get<LeaderboardResponse>("/score/leaderboard");
  // The API returns { success: true, leaderboard: [...] } directly
  // Not wrapped in a data property
  return response as LeaderboardResponse;
};