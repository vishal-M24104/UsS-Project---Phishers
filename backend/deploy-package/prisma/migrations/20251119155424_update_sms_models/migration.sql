/*
  Warnings:

  - You are about to drop the column `avatar` on the `GameSMSEasy` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `GameSMSEasy` table. All the data in the column will be lost.
  - You are about to drop the column `messages` on the `GameSMSEasy` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `GameSMSHard` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `GameSMSHard` table. All the data in the column will be lost.
  - Added the required column `message` to the `GameSMSEasy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `GameSMSEasy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `GameSMSHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `GameSMSHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messages` to the `GameSMSHard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameSMSEasy" DROP COLUMN "avatar",
DROP COLUMN "contact",
DROP COLUMN "messages",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "sender" TEXT NOT NULL,
ALTER COLUMN "explanation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameSMSHard" DROP COLUMN "message",
DROP COLUMN "sender",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "messages" JSONB NOT NULL,
ALTER COLUMN "explanation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameSMSMedium" ALTER COLUMN "explanation" DROP NOT NULL;
