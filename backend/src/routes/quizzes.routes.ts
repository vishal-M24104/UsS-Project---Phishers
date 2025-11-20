import { Router } from "express";
import { getQuizByTopic } from "../controllers/quizzes.controller";

const router = Router();

// GET /api/quizzes/:topic
router.get("/:topic", getQuizByTopic);

export default router;
