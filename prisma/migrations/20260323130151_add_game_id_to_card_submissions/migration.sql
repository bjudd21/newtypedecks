-- AlterTable
ALTER TABLE "card_submissions" ADD COLUMN     "gameId" TEXT;

-- CreateIndex
CREATE INDEX "card_submissions_gameId_idx" ON "card_submissions"("gameId");

-- AddForeignKey
ALTER TABLE "card_submissions" ADD CONSTRAINT "card_submissions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;
