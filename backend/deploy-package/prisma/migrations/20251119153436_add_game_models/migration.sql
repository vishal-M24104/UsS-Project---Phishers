/*
  Warnings:

  - You are about to drop the column `message` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizTopic` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `senderName` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.
  - Made the column `senderEmail` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.
  - Made the column `body` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.
  - Made the column `footer` on table `GameEmailMedium` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizTopicId_fkey";

-- AlterTable
ALTER TABLE "GameEmailEasy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GameEmailMedium" DROP COLUMN "message",
DROP COLUMN "sender",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "senderName" SET NOT NULL,
ALTER COLUMN "senderEmail" SET NOT NULL,
ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "subject" SET NOT NULL,
ALTER COLUMN "body" SET NOT NULL,
ALTER COLUMN "footer" SET NOT NULL;

-- AlterTable
ALTER TABLE "GameSMSEasy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GameSMSHard" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "GameSMSMedium" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "QuizTopic";

-- CreateTable
CREATE TABLE "GameEmailHard" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPhishing" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameEmailHard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_topic_key" ON "Quiz"("topic");
