-- CreateEnum
CREATE TYPE "DeckVisibility" AS ENUM ('DRAFT', 'PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubmissionPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- DropIndex
DROP INDEX "card_types_name_key";

-- DropIndex
DROP INDEX "collections_userId_key";

-- DropIndex
DROP INDEX "rarities_name_key";

-- DropIndex
DROP INDEX "sets_name_key";

-- AlterTable
ALTER TABLE "card_types" ADD COLUMN     "gameId" TEXT;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "gameAttributes" JSONB,
ADD COLUMN     "gameId" TEXT;

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "gameId" TEXT;

-- AlterTable
ALTER TABLE "decks" ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "deckCode" TEXT,
ADD COLUMN     "gameId" TEXT,
ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "templateSource" TEXT,
ADD COLUMN     "versionName" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "DeckVisibility" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "rarities" ADD COLUMN     "gameId" TEXT;

-- AlterTable
ALTER TABLE "sets" ADD COLUMN     "gameId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "publisher" TEXT,
    "copyrightHolder" TEXT,
    "logoUrl" TEXT,
    "iconUrl" TEXT,
    "bannerUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "deck_likes" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deck_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_versions" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "versionName" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "changeNote" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deck_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_version_cards" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" TEXT,

    CONSTRAINT "deck_version_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_submissions" (
    "id" TEXT NOT NULL,
    "submittedBy" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "name" TEXT NOT NULL,
    "level" INTEGER,
    "cost" INTEGER,
    "typeId" TEXT,
    "rarityId" TEXT,
    "setId" TEXT,
    "setName" TEXT,
    "setCode" TEXT,
    "setNumber" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageFile" TEXT,
    "description" TEXT,
    "officialText" TEXT,
    "abilities" TEXT,
    "clashPoints" INTEGER,
    "price" INTEGER,
    "hitPoints" INTEGER,
    "attackPoints" INTEGER,
    "faction" TEXT,
    "pilot" TEXT,
    "model" TEXT,
    "series" TEXT,
    "nation" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFoil" BOOLEAN NOT NULL DEFAULT false,
    "isPromo" BOOLEAN NOT NULL DEFAULT false,
    "isAlternate" BOOLEAN NOT NULL DEFAULT false,
    "isLeak" BOOLEAN NOT NULL DEFAULT false,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "SubmissionPriority" NOT NULL DEFAULT 'NORMAL',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "publishedCardId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_decks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorite_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_template_usage" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdDeckId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deck_template_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "deck_likes_deckId_idx" ON "deck_likes"("deckId");

-- CreateIndex
CREATE INDEX "deck_likes_userId_idx" ON "deck_likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "deck_likes_deckId_userId_key" ON "deck_likes"("deckId", "userId");

-- CreateIndex
CREATE INDEX "deck_versions_deckId_version_idx" ON "deck_versions"("deckId", "version");

-- CreateIndex
CREATE INDEX "deck_versions_deckId_createdAt_idx" ON "deck_versions"("deckId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "deck_versions_deckId_version_key" ON "deck_versions"("deckId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "deck_version_cards_versionId_cardId_key" ON "deck_version_cards"("versionId", "cardId");

-- CreateIndex
CREATE INDEX "card_submissions_status_idx" ON "card_submissions"("status");

-- CreateIndex
CREATE INDEX "card_submissions_priority_idx" ON "card_submissions"("priority");

-- CreateIndex
CREATE INDEX "card_submissions_createdAt_idx" ON "card_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "card_submissions_submittedBy_idx" ON "card_submissions"("submittedBy");

-- CreateIndex
CREATE INDEX "card_submissions_reviewedBy_idx" ON "card_submissions"("reviewedBy");

-- CreateIndex
CREATE INDEX "card_submissions_reviewedAt_idx" ON "card_submissions"("reviewedAt");

-- CreateIndex
CREATE INDEX "card_submissions_publishedAt_idx" ON "card_submissions"("publishedAt");

-- CreateIndex
CREATE INDEX "card_submissions_name_idx" ON "card_submissions"("name");

-- CreateIndex
CREATE INDEX "card_submissions_faction_idx" ON "card_submissions"("faction");

-- CreateIndex
CREATE INDEX "card_submissions_series_idx" ON "card_submissions"("series");

-- CreateIndex
CREATE INDEX "card_submissions_isLeak_idx" ON "card_submissions"("isLeak");

-- CreateIndex
CREATE INDEX "card_submissions_isPreview_idx" ON "card_submissions"("isPreview");

-- CreateIndex
CREATE INDEX "card_submissions_status_priority_idx" ON "card_submissions"("status", "priority");

-- CreateIndex
CREATE INDEX "card_submissions_status_createdAt_idx" ON "card_submissions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "card_submissions_priority_createdAt_idx" ON "card_submissions"("priority", "createdAt");

-- CreateIndex
CREATE INDEX "card_submissions_submittedBy_status_idx" ON "card_submissions"("submittedBy", "status");

-- CreateIndex
CREATE INDEX "card_submissions_reviewedBy_reviewedAt_idx" ON "card_submissions"("reviewedBy", "reviewedAt");

-- CreateIndex
CREATE INDEX "user_favorite_decks_userId_idx" ON "user_favorite_decks"("userId");

-- CreateIndex
CREATE INDEX "user_favorite_decks_deckId_idx" ON "user_favorite_decks"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_decks_userId_deckId_key" ON "user_favorite_decks"("userId", "deckId");

-- CreateIndex
CREATE INDEX "deck_template_usage_templateId_idx" ON "deck_template_usage"("templateId");

-- CreateIndex
CREATE INDEX "deck_template_usage_userId_idx" ON "deck_template_usage"("userId");

-- CreateIndex
CREATE INDEX "deck_template_usage_createdAt_idx" ON "deck_template_usage"("createdAt");

-- CreateIndex
CREATE INDEX "card_types_gameId_idx" ON "card_types"("gameId");

-- CreateIndex
CREATE INDEX "cards_gameId_idx" ON "cards"("gameId");

-- CreateIndex
CREATE INDEX "cards_pilot_idx" ON "cards"("pilot");

-- CreateIndex
CREATE INDEX "cards_model_idx" ON "cards"("model");

-- CreateIndex
CREATE INDEX "cards_tags_idx" ON "cards"("tags");

-- CreateIndex
CREATE INDEX "cards_level_idx" ON "cards"("level");

-- CreateIndex
CREATE INDEX "cards_cost_idx" ON "cards"("cost");

-- CreateIndex
CREATE INDEX "cards_hitPoints_idx" ON "cards"("hitPoints");

-- CreateIndex
CREATE INDEX "cards_attackPoints_idx" ON "cards"("attackPoints");

-- CreateIndex
CREATE INDEX "cards_isFoil_idx" ON "cards"("isFoil");

-- CreateIndex
CREATE INDEX "cards_isPromo_idx" ON "cards"("isPromo");

-- CreateIndex
CREATE INDEX "cards_isAlternate_idx" ON "cards"("isAlternate");

-- CreateIndex
CREATE INDEX "cards_language_idx" ON "cards"("language");

-- CreateIndex
CREATE INDEX "cards_createdAt_idx" ON "cards"("createdAt");

-- CreateIndex
CREATE INDEX "cards_updatedAt_idx" ON "cards"("updatedAt");

-- CreateIndex
CREATE INDEX "cards_faction_series_idx" ON "cards"("faction", "series");

-- CreateIndex
CREATE INDEX "cards_typeId_rarityId_idx" ON "cards"("typeId", "rarityId");

-- CreateIndex
CREATE INDEX "cards_setId_createdAt_idx" ON "cards"("setId", "createdAt");

-- CreateIndex
CREATE INDEX "cards_level_cost_idx" ON "cards"("level", "cost");

-- CreateIndex
CREATE INDEX "cards_faction_level_idx" ON "cards"("faction", "level");

-- CreateIndex
CREATE INDEX "cards_series_faction_idx" ON "cards"("series", "faction");

-- CreateIndex
CREATE INDEX "cards_name_faction_idx" ON "cards"("name", "faction");

-- CreateIndex
CREATE INDEX "cards_isFoil_isPromo_idx" ON "cards"("isFoil", "isPromo");

-- CreateIndex
CREATE INDEX "cards_name_pilot_model_idx" ON "cards"("name", "pilot", "model");

-- CreateIndex
CREATE INDEX "cards_name_createdAt_idx" ON "cards"("name", "createdAt");

-- CreateIndex
CREATE INDEX "cards_level_name_idx" ON "cards"("level", "name");

-- CreateIndex
CREATE INDEX "cards_cost_name_idx" ON "cards"("cost", "name");

-- CreateIndex
CREATE INDEX "cards_clashPoints_name_idx" ON "cards"("clashPoints", "name");

-- CreateIndex
CREATE INDEX "cards_createdAt_name_idx" ON "cards"("createdAt", "name");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE INDEX "collections_gameId_idx" ON "collections"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "decks_deckCode_key" ON "decks"("deckCode");

-- CreateIndex
CREATE INDEX "decks_gameId_idx" ON "decks"("gameId");

-- CreateIndex
CREATE INDEX "decks_userId_idx" ON "decks"("userId");

-- CreateIndex
CREATE INDEX "decks_visibility_idx" ON "decks"("visibility");

-- CreateIndex
CREATE INDEX "decks_viewCount_idx" ON "decks"("viewCount");

-- CreateIndex
CREATE INDEX "decks_likeCount_idx" ON "decks"("likeCount");

-- CreateIndex
CREATE INDEX "rarities_gameId_idx" ON "rarities"("gameId");

-- CreateIndex
CREATE INDEX "sets_gameId_idx" ON "sets"("gameId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_types" ADD CONSTRAINT "card_types_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rarities" ADD CONSTRAINT "rarities_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_likes" ADD CONSTRAINT "deck_likes_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_likes" ADD CONSTRAINT "deck_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_versions" ADD CONSTRAINT "deck_versions_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_versions" ADD CONSTRAINT "deck_versions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_version_cards" ADD CONSTRAINT "deck_version_cards_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "deck_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_version_cards" ADD CONSTRAINT "deck_version_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_submissions" ADD CONSTRAINT "card_submissions_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_submissions" ADD CONSTRAINT "card_submissions_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_submissions" ADD CONSTRAINT "card_submissions_publishedCardId_fkey" FOREIGN KEY ("publishedCardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_decks" ADD CONSTRAINT "user_favorite_decks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_decks" ADD CONSTRAINT "user_favorite_decks_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_template_usage" ADD CONSTRAINT "deck_template_usage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_template_usage" ADD CONSTRAINT "deck_template_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

