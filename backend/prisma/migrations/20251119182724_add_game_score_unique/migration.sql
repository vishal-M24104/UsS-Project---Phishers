/*
  Warnings:

  - A unique constraint covering the columns `[userId,type,level]` on the table `GameScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameScore_userId_type_level_key" ON "GameScore"("userId", "type", "level");
