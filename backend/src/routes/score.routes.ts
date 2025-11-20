import { Router } from "express";
import { getLeaderboard, getUserTotalScore, postGameScore } from "../controllers/score.controller";
import { requireAuth } from "../middleware/auth";
const router = Router();
router.get("/total", requireAuth, getUserTotalScore);
router.get("/leaderboard", getLeaderboard);
router.post("/", requireAuth, postGameScore);

export default router;