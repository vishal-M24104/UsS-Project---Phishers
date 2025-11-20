/*
  Warnings:

  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "content";

-- CreateTable
CREATE TABLE "GameEmailEasy" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "GameEmailEasy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameEmailMedium" (
    "id" TEXT NOT NULL,
    "sender" TEXT,
    "senderName" TEXT,
    "senderEmail" TEXT,
    "message" TEXT,
    "time" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "footer" TEXT,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "GameEmailMedium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSMSEasy" (
    "id" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "GameSMSEasy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSMSMedium" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "GameSMSMedium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSMSHard" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "GameSMSHard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizTopic" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "QuizTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "quizTopicId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "hint" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizTopicId_fkey" FOREIGN KEY ("quizTopicId") REFERENCES "QuizTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
