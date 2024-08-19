-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pairedTransferId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_pairedTransferId_fkey" FOREIGN KEY ("pairedTransferId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
