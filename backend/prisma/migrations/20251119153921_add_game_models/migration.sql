/*
  Warnings:

  - You are about to drop the column `createdAt` on the `GameEmailEasy` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GameEmailHard` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `GameEmailHard` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `footer` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `senderEmail` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `GameEmailMedium` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GameSMSEasy` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GameSMSHard` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GameSMSMedium` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `footer` to the `GameEmailHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `GameEmailHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `GameEmailHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `GameEmailHard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `GameEmailMedium` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEmailEasy" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "GameEmailHard" DROP COLUMN "createdAt",
DROP COLUMN "sender",
ADD COLUMN     "footer" TEXT NOT NULL,
ADD COLUMN     "senderEmail" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GameEmailMedium" DROP COLUMN "createdAt",
DROP COLUMN "footer",
DROP COLUMN "senderEmail",
DROP COLUMN "senderName",
DROP COLUMN "time",
ADD COLUMN     "sender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GameSMSEasy" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "GameSMSHard" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "GameSMSMedium" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "createdAt";
