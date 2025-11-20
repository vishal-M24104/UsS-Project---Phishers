const API_BASE = "http://192.168.41.233:3000/api"; 
// Example on Android USB debugging: http://10.0.2.2:3000/api

export async function fetchEmailGame(level: "easy" | "medium" | "hard") {
  const res = await fetch(`${API_BASE}/games/email/${level}`);
  return res.json();
}

export async function fetchSMSGame(level: "easy" | "medium" | "hard") {
  const res = await fetch(`${API_BASE}/games/sms/${level}`);
  return res.json();
}

export async function fetchQuiz(topic: string) {
  const res = await fetch(`${API_BASE}/quizzes/${topic}`);
  return res.json();
}

// NEW: post game score
export async function postGameScore({
  type,
  level,
  score,
  token, // optional JWT
}: {
  type: "email" | "sms" | "quiz";
  level: "easy" | "medium" | "hard";
  score: number;
  token?: string;
}) {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/games/score`, {
    method: "POST",
    headers,
    body: JSON.stringify({ type, level, score }),
  });
  return res.json();
}