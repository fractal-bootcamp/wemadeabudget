/*
  Warnings:

  - Made the column `memo` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payeeId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accountId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_payeeId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "memo" SET NOT NULL,
ALTER COLUMN "payeeId" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "accountId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "Payee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
