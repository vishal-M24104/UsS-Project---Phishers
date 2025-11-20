import { PrismaClient } from "@prisma/client";

// GAME DATA
import emailEasy from "../data/games/email_easy_data.json";
import emailHard from "../data/games/email_hard_data.json";
import emailMedium from "../data/games/email_medium_data.json";

import smsEasy from "../data/games/sms_easy_data.json";
import smsHard from "../data/games/sms_hard_data.json";
import smsMedium from "../data/games/sms_medium_data.json";

// QUIZZES
import passwordQuiz from "../data/quizzes/password.json";
import phishingQuiz from "../data/quizzes/phishing.json";
import privacyQuiz from "../data/quizzes/privacy.json";
import socialQuiz from "../data/quizzes/social.json";

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Seeding started...");

  // EMAIL EASY
  for (const q of emailEasy) {
    await prisma.gameEmailEasy.create({ data: q });
  }

  // EMAIL MEDIUM
  for (const q of emailMedium) {
    await prisma.gameEmailMedium.create({ data: q });
  }

  // EMAIL HARD
  for (const q of emailHard) {
    await prisma.gameEmailHard.create({ data: q });
  }

 // -------------------- SMS EASY --------------------
for (const q of smsEasy) {
  await prisma.gameSMSEasy.create({
    data: {
      sender: q.sender,
      message: q.message,
      isPhishing: q.isPhishing,
      explanation: q.explanation,
    },
  });
}

// -------------------- SMS MEDIUM --------------------
for (const q of smsMedium) {
  await prisma.gameSMSMedium.create({
    data: {
      sender: q.sender,
      message: q.message,
      isPhishing: q.isPhishing,
      explanation: q.explanation,
    },
  });
}

// -------------------- SMS HARD (chat format) --------------------
for (const q of smsHard) {
  await prisma.gameSMSHard.create({
    data: {
      contact: q.contact,
      avatar: q.avatar,
      messages: q.messages, // JSON array
      isPhishing: q.isPhishing,
      explanation: q.explanation,
    },
  });
}



  // QUIZZES
  await prisma.quiz.create({
    data: {
      topic: "password",
      title: passwordQuiz.title,
      instructions: passwordQuiz.instructions,
      questions: passwordQuiz.questions,
    },
  });

  await prisma.quiz.create({
    data: {
      topic: "phishing",
      title: phishingQuiz.title,
      instructions: phishingQuiz.instructions,
      questions: phishingQuiz.questions,
    },
  });

  await prisma.quiz.create({
    data: {
      topic: "privacy",
      title: privacyQuiz.title,
      instructions: privacyQuiz.instructions,
      questions: privacyQuiz.questions,
    },
  });

  await prisma.quiz.create({
    data: {
      topic: "social",
      title: socialQuiz.title,
      instructions: socialQuiz.instructions,
      questions: socialQuiz.questions,
    },
  });

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
