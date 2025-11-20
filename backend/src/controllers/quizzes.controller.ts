import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getQuizByTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { topic },
    });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: `Quiz not found for topic: ${topic}`,
      });
      return;
    }

    // Validate JSON shape
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      res.status(500).json({
        success: false,
        message: "Quiz.questions is not an array in database.",
      });
      return;
    }

    // Convert JSON value → JS Array
    const allQuestions = quiz.questions as any[];

    // Shuffle
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

    // Limit to 10
    const selected = shuffled.slice(0, 10);

    res.json({
      success: true,
      quiz: {
        title: quiz.title,
        instructions: quiz.instructions,
        topic: quiz.topic,
        questions: selected,
      },
    });
    return;

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to process quiz",
    });
    return;
  }
};
