/*
  Warnings:

  - You are about to drop the column `attribute` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `defense` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `power` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `range` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "attribute",
DROP COLUMN "defense",
DROP COLUMN "power",
DROP COLUMN "range",
DROP COLUMN "speed",
ADD COLUMN     "attackPoints" INTEGER,
ADD COLUMN     "clashPoints" INTEGER,
ADD COLUMN     "hitPoints" INTEGER,
ADD COLUMN     "nation" TEXT,
ADD COLUMN     "price" INTEGER;

-- CreateIndex
CREATE INDEX "cards_nation_idx" ON "cards"("nation");

-- CreateIndex
CREATE INDEX "cards_clashPoints_idx" ON "cards"("clashPoints");

-- CreateIndex
CREATE INDEX "cards_price_idx" ON "cards"("price");
