/*
  Warnings:

  - You are about to drop the column `rulings` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "card_types" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "rulings",
ADD COLUMN     "abilities" TEXT,
ADD COLUMN     "attribute" TEXT,
ADD COLUMN     "defense" INTEGER,
ADD COLUMN     "faction" TEXT,
ADD COLUMN     "isAlternate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFoil" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPromo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "model" TEXT,
ADD COLUMN     "pilot" TEXT,
ADD COLUMN     "power" INTEGER,
ADD COLUMN     "range" TEXT,
ADD COLUMN     "series" TEXT,
ADD COLUMN     "speed" INTEGER,
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "level" DROP NOT NULL,
ALTER COLUMN "cost" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "card_rulings" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "source" TEXT,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_rulings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_name_idx" ON "cards"("name");

-- CreateIndex
CREATE INDEX "cards_faction_idx" ON "cards"("faction");

-- CreateIndex
CREATE INDEX "cards_series_idx" ON "cards"("series");

-- CreateIndex
CREATE INDEX "cards_keywords_idx" ON "cards"("keywords");

-- AddForeignKey
ALTER TABLE "card_rulings" ADD CONSTRAINT "card_rulings_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
