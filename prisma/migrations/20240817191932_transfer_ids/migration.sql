/*
  Warnings:

  - A unique constraint covering the columns `[pairedTransferId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "pairedTransferId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pairedTransferId_key" ON "Transaction"("pairedTransferId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_pairedTransferId_fkey" FOREIGN KEY ("pairedTransferId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
