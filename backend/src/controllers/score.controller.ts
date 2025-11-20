// backend/src/controllers/score.controller.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { decrypt } from "../utils/encryption";
const prisma = new PrismaClient();

export const postGameScore = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/score - headers:", req.headers);
    console.log("POST /api/score - body:", req.body);

    const userId = (req as any).user?.id;
    console.log("POST /api/score - resolved userId:", userId);

    if (!userId) {
      console.warn("postGameScore: no userId attached to req (unauthorized)");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { type, level, score } = req.body as {
      type: string;
      level: string;
      score: number;
    };

    if (!type || !level || typeof score !== "number") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid fields. Expect { type, level, score }",
      });
    }

    // Find existing
    const existing = await prisma.gameScore.findFirst({
      where: { userId, type, level },
    });

    if (existing) {
      if (score > existing.score) {
        const updated = await prisma.gameScore.update({
          where: { id: existing.id },
          data: { score },
        });
        return res.json({ success: true, updated: true, score: updated.score });
      } else {
        return res.json({ success: true, updated: false, score: existing.score });
      }
    } else {
      const created = await prisma.gameScore.create({
        data: { userId, type, level, score },
      });
      return res.json({ success: true, created: true, score: created.score });
    }
  } catch (err) {
    console.error("postGameScore error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getUserTotalScore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const total = await prisma.gameScore.aggregate({
      where: { userId },
      _sum: { score: true },
    });

    return res.json({
      success: true,
      totalScore: total._sum.score || 0,
    });

  } catch (err) {
    console.error("getUserTotalScore error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// ⬇️ New import — add this at top


// ⭐ NEW: Get leaderboard with decrypted names/emails
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,     // encrypted
        email: true,    // encrypted
        gameScores: true,
      },
    });

    // ⬇️ Decrypt before sending to mobile app
    const result = leaderboard.map((u) => ({
      id: u.id,
      name: decrypt(u.name),
      email: decrypt(u.email),
      total: u.gameScores.reduce((sum, s) => sum + s.score, 0),
    }));

    // Sort descending
    result.sort((a, b) => b.total - a.total);

    return res.json({
      success: true,
      leaderboard: result,
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

