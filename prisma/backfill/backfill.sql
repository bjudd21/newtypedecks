-- Multi-TCG Foundation Backfill
-- Run this AFTER: prisma migrate deploy
-- Run this BEFORE: npm run db:seed:games
--
-- Purpose:
--   1. Insert the Gundam game record with a fixed seed ID
--   2. Backfill gameId on all existing rows (cards, decks, collections, sets, card_types, rarities)
--   3. Migrate Gundam-specific card columns (faction, pilot, model, series, nation) into gameAttributes JSONB
--   4. Migrate isPublic boolean to DeckVisibility enum
--
-- NOTE: Prisma uses camelCase column names in PostgreSQL — no snake_case mapping.

-- -------------------------------------------------------------------------
-- 1. Insert Gundam game record
--    Uses ON CONFLICT DO NOTHING so this is safe to re-run.
-- -------------------------------------------------------------------------
INSERT INTO games (
  id,
  slug,
  name,
  "shortName",
  publisher,
  "copyrightHolder",
  "primaryColor",
  "secondaryColor",
  "accentColor",
  config,
  "isActive",
  "sortOrder",
  "createdAt",
  "updatedAt"
)
VALUES (
  'seed_gundam_game_v1_000001',
  'gundam',
  'Gundam Card Game',
  'Gundam',
  'Bandai Namco Entertainment',
  'Bandai Namco Entertainment Inc.',
  '#0066CC',
  '#CC0000',
  '#FFD700',
  '{
    "cardSchema": {
      "fields": [
        { "key": "name",         "label": "Name",         "type": "text",   "required": true },
        { "key": "cost",         "label": "Cost",         "type": "number", "required": false },
        { "key": "level",        "label": "Level",        "type": "number", "required": false },
        { "key": "clashPoints",  "label": "CP",           "type": "number", "required": false },
        { "key": "hitPoints",    "label": "HP",           "type": "number", "required": false },
        { "key": "attackPoints", "label": "AP",           "type": "number", "required": false }
      ],
      "customFields": [
        { "key": "faction", "label": "Faction", "type": "text" },
        { "key": "pilot",   "label": "Pilot",   "type": "text" },
        { "key": "model",   "label": "Model",   "type": "text" },
        { "key": "series",  "label": "Series",  "type": "text" },
        { "key": "nation",  "label": "Nation",  "type": "text" }
      ]
    },
    "deckRules": {
      "minDeckSize": 50,
      "maxDeckSize": 50,
      "maxCopiesPerCard": 3,
      "zones": [
        { "key": "main", "label": "Main Deck", "required": true }
      ],
      "specialRules": []
    },
    "cardTypes": ["Mobile Suit", "Character", "Command", "Event", "Upgrade"],
    "rarities": ["Common", "Uncommon", "Rare", "Super Rare", "Secret Rare"],
    "importFormats": ["text", "csv", "json"],
    "exportFormats": ["text", "csv", "json"],
    "legalDisclaimer": "Gundam Card Game © Bandai Namco Entertainment Inc. All Rights Reserved. This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc.",
    "copyrightNotice": "© Bandai Namco Entertainment Inc.",
    "nonAffiliationStatement": "This website is not affiliated with or endorsed by Bandai Namco Entertainment Inc.",
    "keywords": ["Mobile Suit", "Newtype", "Ace Pilot", "Beam", "Minovsky"]
  }',
  true,
  0,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- -------------------------------------------------------------------------
-- 2. Backfill gameId on all existing rows
--    References the Gundam game by slug so this works regardless of which
--    script created the game record.
-- -------------------------------------------------------------------------
UPDATE cards
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

UPDATE decks
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

UPDATE collections
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

UPDATE sets
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

UPDATE card_types
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

UPDATE rarities
  SET "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
  WHERE "gameId" IS NULL;

-- -------------------------------------------------------------------------
-- 3. Migrate Gundam card attributes to gameAttributes JSONB
--    Strips null values so the JSONB stays clean.
--    Only runs on rows where gameAttributes is still null.
-- -------------------------------------------------------------------------
UPDATE cards
  SET "gameAttributes" = jsonb_strip_nulls(jsonb_build_object(
    'faction', faction,
    'pilot',   pilot,
    'model',   model,
    'series',  series,
    'nation',  nation
  ))
  WHERE "gameId" = (SELECT id FROM games WHERE slug = 'gundam')
    AND "gameAttributes" IS NULL;

-- -------------------------------------------------------------------------
-- 4. Migrate deck visibility: map old isPublic boolean to DeckVisibility
--    PUBLIC = was explicitly set public; everything else stays DRAFT
-- -------------------------------------------------------------------------
UPDATE decks
  SET visibility = CASE
    WHEN "isPublic" = true THEN 'PUBLIC'::"DeckVisibility"
    ELSE 'DRAFT'::"DeckVisibility"
  END
  WHERE visibility = 'DRAFT'::"DeckVisibility";
