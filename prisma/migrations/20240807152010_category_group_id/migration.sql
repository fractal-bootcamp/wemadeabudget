/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `CategoryGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CategoryGroup_userId_name_key" ON "CategoryGroup"("userId", "name");
