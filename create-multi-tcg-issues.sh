#!/bin/bash
# =============================================================================
# Newtype Decks — Multi-TCG Platform Migration Issues
# =============================================================================
# Usage: chmod +x create-multi-tcg-issues.sh && ./create-multi-tcg-issues.sh
# Requires: gh CLI authenticated with repo access
# Creates milestones and issues for bjudd21/newtypedecks
# =============================================================================

REPO="bjudd21/newtypedecks"

echo "Creating milestones..."

gh api repos/$REPO/milestones -f title="M1: Game Model & Database Foundation" \
  -f description="Create the Game model, migration, seed Gundam as first game, add gameId FK to all relevant tables, migrate Gundam-specific columns to JSONB gameAttributes. Exit: schema supports multiple games, existing data preserved." \
  -f due_on="2026-04-12T00:00:00Z" 2>/dev/null

gh api repos/$REPO/milestones -f title="M2: Route Restructure & De-hardcoding" \
  -f description="Move all game-scoped pages under [gameSlug] dynamic route. Create GameProvider context. Replace ~150 Gundam-specific references with context-driven values. Build landing page game selector. Exit: all existing features work at /gundam/* with zero regressions." \
  -f due_on="2026-04-26T00:00:00Z" 2>/dev/null

gh api repos/$REPO/milestones -f title="M3: Second Game — One Piece TCG" \
  -f description="Add One Piece TCG game config and card data. Validate deck builder with different rules (leaders, DON!!). Collection tracker per-game scoped. Cross-game dashboard. Exit: can build and save One Piece decks with proper validation." \
  -f due_on="2026-05-10T00:00:00Z" 2>/dev/null

gh api repos/$REPO/milestones -f title="M4: UX Enhancements (Competitor-Inspired)" \
  -f description="Custom categories in deck builder, multiple view modes, collection-aware deck building, deck comparison tool, ISR optimization. Inspired by Archidekt/Moxfield best practices." \
  -f due_on="2026-05-24T00:00:00Z" 2>/dev/null

gh api repos/$REPO/milestones -f title="M5: Vercel Production Readiness" \
  -f description="Final Vercel deployment optimization: ISR for card pages, edge caching for search, image optimization pipeline, environment validation, monitoring, production database migration." \
  -f due_on="2026-06-07T00:00:00Z" 2>/dev/null

# Give GitHub a moment to process
sleep 2

# Fetch milestone numbers
M1=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M1:")) | .number')
M2=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M2:")) | .number')
M3=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M3:")) | .number')
M4=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M4:")) | .number')
M5=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M5:")) | .number')

echo "Milestones created: M1=$M1, M2=$M2, M3=$M3, M4=$M4, M5=$M5"
echo ""
echo "Creating issues..."

# =============================================================================
# MILESTONE 1: Game Model & Database Foundation
# =============================================================================

gh issue create --repo $REPO --milestone "$M1" \
  --title "Create Game model and Prisma schema" \
  --label "database,multi-tcg,priority:high" \
  --body "## Summary
Create the \`Game\` table in the Prisma schema with a \`config\` JSONB column for per-game configuration.

## Schema
\`\`\`prisma
model Game {
  id            String   @id @default(cuid())
  slug          String   @unique  // 'gundam', 'onepiece', 'mtg'
  name          String             // 'Gundam Card Game'
  shortName     String             // 'Gundam'
  publisher     String             // 'Bandai Namco Entertainment'
  copyrightHolder String           // 'Bandai Namco Entertainment Inc.'
  logoUrl       String?
  iconUrl       String?
  bannerUrl     String?
  primaryColor  String   @default(\"#6b5a8a\")
  secondaryColor String  @default(\"#1a1625\")
  accentColor   String   @default(\"#a78bfa\")
  config        Json     @default(\"{}\")  // GameConfig JSON
  isActive      Boolean  @default(true)
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  cards         Card[]
  decks         Deck[]
  sets          Set[]
  cardTypes     CardType[]
  rarities      Rarity[]
  collections   Collection[]
}
\`\`\`

## Acceptance Criteria
- [ ] Game model added to prisma/schema.prisma
- [ ] Config JSON type interface defined in src/lib/types/game.ts (GameConfig, CardSchemaField, DeckRules, DeckZone)
- [ ] Migration generated and tested locally
- [ ] No changes to existing tables yet (just the new table)"

gh issue create --repo $REPO --milestone "$M1" \
  --title "Add gameId FK to Card, Deck, Collection, Set, CardType, Rarity" \
  --label "database,multi-tcg,priority:high" \
  --body "## Summary
Add \`gameId\` foreign key to all game-scoped tables. Default to the Gundam game record for existing data.

## Tables to modify
- \`Card\` — add \`gameId String\` with FK to Game, required
- \`Deck\` — add \`gameId String\` with FK to Game, required
- \`Collection\` — add \`gameId String\` with FK to Game, required
- \`Set\` — add \`gameId String\` with FK to Game, required
- \`CardType\` — add \`gameId String\` with FK to Game, required
- \`Rarity\` — add \`gameId String\` with FK to Game, required

## Migration Strategy
1. Create the Gundam game record first (seed or migration SQL)
2. Add \`gameId\` columns as optional
3. UPDATE all existing rows to use the Gundam game ID
4. ALTER columns to required (NOT NULL)
5. Add indexes: \`@@index([gameId])\` on each table
6. Add compound indexes: \`@@index([gameId, name])\` on Card, \`@@index([gameId, userId])\` on Deck, Collection

## Acceptance Criteria
- [ ] Migration is non-destructive — all existing data preserved
- [ ] All existing Card/Deck/Collection records have gameId set to Gundam
- [ ] Foreign key constraints enforced
- [ ] Compound indexes created for query performance
- [ ] Prisma client regenerated and types updated"

gh issue create --repo $REPO --milestone "$M1" \
  --title "Migrate Gundam-specific card columns to JSONB gameAttributes" \
  --label "database,multi-tcg,priority:high" \
  --body "## Summary
Replace the hardcoded \`faction\`, \`pilot\`, \`model\`, \`series\` columns on the Card model with a single \`gameAttributes\` JSONB column. Migrate existing data.

## Changes
1. Add \`gameAttributes Json @default(\"{}\")\` to Card model
2. Write migration SQL that copies existing values:
   \`\`\`sql
   UPDATE \"Card\" SET \"gameAttributes\" = jsonb_build_object(
     'faction', \"faction\",
     'pilot', \"pilot\",
     'model', \"model\",
     'series', \"series\"
   ) WHERE \"faction\" IS NOT NULL OR \"pilot\" IS NOT NULL OR \"model\" IS NOT NULL OR \"series\" IS NOT NULL;
   \`\`\`
3. Drop \`faction\`, \`pilot\`, \`model\`, \`series\` columns
4. Add GIN index on gameAttributes: \`@@index([gameAttributes], type: Gin)\`
5. Update Card TypeScript interface to include \`gameAttributes: Record<string, unknown>\`

## Acceptance Criteria
- [ ] All existing faction/pilot/model/series data preserved in gameAttributes
- [ ] Old columns removed
- [ ] GIN index created for JSONB queries
- [ ] Card type interface updated
- [ ] No card data lost (verify with count queries before/after)"

gh issue create --repo $REPO --milestone "$M1" \
  --title "Seed Gundam game config with full GameConfig JSON" \
  --label "database,multi-tcg,priority:high" \
  --body "## Summary
Create a seed script that inserts the Gundam game record with a complete GameConfig JSON, populated from the values currently hardcoded across the codebase.

## GameConfig to capture
Extract from existing hardcoded values in:
- \`src/lib/types/card.ts\` → CARD_CONSTANTS (factions, series, categories)
- \`src/lib/services/deckValidationService/rules.ts\` → deck rules
- \`src/lib/models/card/CardUtils/keywords.ts\` → keywords
- \`src/components/card/CardSearch/AdvancedFiltersPanel.tsx\` → filter options
- \`src/components/layout/BandaiNamcoAttribution.tsx\` → copyright text
- \`src/components/layout/NonAffiliationStatement.tsx\` → legal text

## Acceptance Criteria
- [ ] Gundam game record created with slug='gundam'
- [ ] Config JSON includes: cardSchema (fields + customFields), deckRules, cardTypes, rarities, keywords, legalDisclaimer, copyrightNotice
- [ ] Seed script is idempotent (can run multiple times safely)
- [ ] All currently hardcoded game-specific values captured in config"

gh issue create --repo $REPO --milestone "$M1" \
  --title "Update all API routes to scope queries by gameId" \
  --label "backend,multi-tcg,priority:high" \
  --body "## Summary
Every API route that queries Card, Deck, Collection, Set, CardType, or Rarity must include a \`gameId\` filter. The gameId comes from the game slug in the URL.

## Routes to update
Grep for Prisma queries in \`src/app/api/\`:
- \`/api/cards\` — search, detail, CRUD
- \`/api/decks\` — list, create, update, delete
- \`/api/collections\` — list, add, remove, export, import
- \`/api/submissions\` — card submissions scoped to game
- \`/api/admin/cards\` — admin card management
- \`/api/health\` — no change needed

## Implementation
1. Create a utility function \`getGameBySlug(slug: string)\` in \`src/lib/database/\`
2. Add game slug resolution at the API route level (from URL path or query param)
3. Pass \`gameId\` as a \`where\` clause to all Prisma queries
4. Return 404 if game slug is invalid

## Acceptance Criteria
- [ ] All card/deck/collection queries filter by gameId
- [ ] Invalid game slug returns 404
- [ ] Existing API behavior unchanged when called with 'gundam' slug
- [ ] No cross-game data leakage possible"

gh issue create --repo $REPO --milestone "$M1" \
  --title "Create GameConfig TypeScript types and validation" \
  --label "types,multi-tcg,priority:medium" \
  --body "## Summary
Define comprehensive TypeScript types for the GameConfig JSON structure. Include runtime validation.

## Types to create in src/lib/types/game.ts
- \`Game\` — database model type
- \`GameConfig\` — top-level config
- \`CardSchemaField\` — { key, label, type, required, options? }
- \`DeckRules\` — { minDeckSize, maxDeckSize, maxCopiesPerCard, zones, specialRules }
- \`DeckZone\` — { key, label, required, maxSize?, minSize? }
- \`GameBranding\` — { primaryColor, secondaryColor, accentColor, logoUrl, iconUrl }

## Acceptance Criteria
- [ ] All types exported from src/lib/types/game.ts
- [ ] Re-exported from src/lib/types/index.ts
- [ ] Runtime validation function \`validateGameConfig(config: unknown): GameConfig\`
- [ ] Used in seed script to validate config before insert"

# =============================================================================
# MILESTONE 2: Route Restructure & De-hardcoding
# =============================================================================

gh issue create --repo $REPO --milestone "$M2" \
  --title "Create [gameSlug] dynamic route layout with GameProvider" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Create the \`src/app/[gameSlug]/layout.tsx\` that wraps all game-scoped pages with a GameProvider context.

## Implementation
1. Create \`src/app/[gameSlug]/layout.tsx\` — fetches game by slug, wraps children in GameProvider
2. Create \`src/contexts/GameContext.tsx\` — React context with \`useGame()\` hook
3. The context provides: \`game\` (DB record), \`config\` (parsed GameConfig), \`isLoading\`
4. If slug is invalid, render notFound()
5. Use ISR/fetch caching for the game config API call (revalidate: 3600)

## GameProvider shape
\`\`\`typescript
interface GameContextValue {
  game: Game;
  config: GameConfig;
  isLoading: boolean;
}
const { game, config } = useGame();
\`\`\`

## Acceptance Criteria
- [ ] Layout loads game by slug from DB/API
- [ ] GameProvider context accessible in all child pages
- [ ] Invalid slug shows 404
- [ ] Game data cached for 1 hour (ISR)
- [ ] No flash of unstyled/unloaded content"

gh issue create --repo $REPO --milestone "$M2" \
  --title "Move game-scoped pages under [gameSlug] route" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Relocate all game-scoped page directories from \`src/app/\` to \`src/app/[gameSlug]/\`.

## Pages to move
- \`src/app/cards/\` → \`src/app/[gameSlug]/cards/\`
- \`src/app/decks/\` → \`src/app/[gameSlug]/decks/\`
- \`src/app/collection/\` → \`src/app/[gameSlug]/collection/\`
- \`src/app/analytics/\` → \`src/app/[gameSlug]/analytics/\`
- \`src/app/templates/\` → \`src/app/[gameSlug]/templates/\`
- \`src/app/favorites/\` → \`src/app/[gameSlug]/favorites/\`

## Pages that stay at root (NOT game-scoped)
- \`src/app/auth/\`
- \`src/app/dashboard/\`
- \`src/app/profile/\`
- \`src/app/admin/\`
- \`src/app/settings/\`
- \`src/app/privacy/\`, \`terms/\`, \`cookies/\`

## Implementation
1. Move directories
2. Update all internal links (next/link href) to include gameSlug
3. Update middleware.ts route matchers for the new paths
4. Add redirects from old paths: \`/cards\` → \`/gundam/cards\` (temporary, for bookmarks)

## Acceptance Criteria
- [ ] All game pages render at /gundam/* paths
- [ ] Old paths redirect to /gundam/* equivalents
- [ ] Non-game pages still work at root
- [ ] Navigation links use gameSlug from context
- [ ] Middleware auth checks updated for new paths"

gh issue create --repo $REPO --milestone "$M2" \
  --title "De-hardcode UI strings: replace Gundam references with game context" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Replace ~50 hardcoded 'Gundam Card Game' UI strings and ~25 metadata references with values from the game context.

## Files with UI string references (from codebase grep)
### Page metadata (titles, descriptions, keywords)
- src/app/[gameSlug]/favorites/page.tsx
- src/app/[gameSlug]/cards/ pages
- src/app/[gameSlug]/decks/ pages
- src/app/[gameSlug]/collection/page.tsx
- src/app/[gameSlug]/analytics/page.tsx
- src/app/[gameSlug]/templates/page.tsx
- src/app/auth/* pages
- src/app/dashboard/page.tsx
- src/app/layout.tsx (root metadata)
- src/app/profile/page.tsx

### Component strings
- src/components/dashboard/UserDashboard/components/WelcomeSection.tsx
- src/components/deck/DeckShare.tsx
- src/components/deck/DeckBuilder/hooks/useDeckHandlers.ts
- src/components/card/CardDatabaseSearch.tsx
- src/components/pwa/PWAInstallPrompt.tsx
- src/components/pwa/InstallSection.tsx
- src/app/admin/* components

## Pattern
Replace: \`'Gundam Card Game'\`
With: \`game.name\` (from useGame() hook) or \`generateMetadata\` params

## Acceptance Criteria
- [ ] Zero hardcoded 'Gundam Card Game' strings in game-scoped pages
- [ ] All page titles follow pattern: \`\${pageTitle} | \${game.name}\`
- [ ] Root layout uses generic platform name ('Newtype Decks')
- [ ] grep -r 'Gundam Card Game' src/app/\\[gameSlug\\]/ returns 0 results"

gh issue create --repo $REPO --milestone "$M2" \
  --title "De-hardcode legal/copyright components" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Replace hardcoded Bandai Namco / Gundam copyright text with per-game values from game config.

## Components to update
- \`src/components/layout/BandaiNamcoAttribution.tsx\` → rename to \`PublisherAttribution.tsx\`, read from config
- \`src/components/layout/NonAffiliationStatement.tsx\` → read from config
- \`src/components/layout/CopyrightDisclaimer.tsx\` → read from config
- \`src/components/layout/LegalComplianceFooter.tsx\` → read from config
- \`public/manifest.json\` → make dynamic or generic

## Acceptance Criteria
- [ ] Copyright text reads from game.config.copyrightNotice
- [ ] Legal disclaimer reads from game.config.legalDisclaimer
- [ ] Publisher name reads from game.copyrightHolder
- [ ] Works correctly for both Gundam and future games
- [ ] manifest.json uses generic 'Newtype Decks' name"

gh issue create --repo $REPO --milestone "$M2" \
  --title "De-hardcode card schema: filters, field labels, validation constants" \
  --label "frontend,backend,multi-tcg,priority:high" \
  --body "## Summary
Replace hardcoded card types, rarities, factions, keywords, and validation constants with values from game config.

## Files to update
- \`src/lib/types/card.ts\` — CARD_CONSTANTS (factions, series, categories) → read from config
- \`src/lib/models/card/CardUtils/keywords.ts\` — hardcoded keyword list → read from config
- \`src/components/card/CardSearch/AdvancedFiltersPanel.tsx\` — hardcoded faction filter options → read from config
- \`src/components/collection/CollectionManager/CollectionFilters.tsx\` — hardcoded faction filters
- \`src/components/admin/cards/CardForm/FormSections.tsx\` — hardcoded placeholder text
- \`src/lib/services/deckValidationService/rules.ts\` — hardcoded deck rules → read from config
- \`src/lib/services/searchCacheService/lifecycle.ts\` — hardcoded faction warmup queries
- \`src/lib/services/deckAnalyticsService/meta/data.ts\` — hardcoded meta deck data

## Acceptance Criteria
- [ ] Card search filters populated from config.cardTypes, config.rarities, config.cardSchema.customFields
- [ ] Deck validation rules read from config.deckRules
- [ ] No hardcoded 'Earth Federation', 'Zeon', 'Mobile Suit' etc. in game-scoped code
- [ ] CARD_CONSTANTS either removed or made game-context-aware"

gh issue create --repo $REPO --milestone "$M2" \
  --title "De-hardcode export/import services" \
  --label "backend,multi-tcg,priority:medium" \
  --body "## Summary
Replace hardcoded 'Gundam Card Game' and 'gundam-collection' strings in export/import services.

## Files to update
- \`src/hooks/useDeckExport.ts\` — 'Anonymous deck from Gundam Card Game Builder'
- \`src/lib/services/deckExportService/exporters/jsonExporter.ts\` — format: 'Gundam Card Game'
- \`src/lib/services/deckExportService/exporters/textExporter.ts\` — footer text
- \`src/app/api/collections/export/helpers/formatters/*.ts\` — all 'gundam-collection' filename prefixes
- \`src/components/collection/CollectionExporter/utils.ts\` — filename prefix
- \`src/components/collection/CollectionImporter/formatHelpers.ts\` — sample data (RX-78-2 Gundam etc.)
- \`src/components/collection/AdvancedImporter/constants.ts\` — example data

## Pattern
- Export filenames: \`\${game.slug}-collection-\${format}-\${date}\`
- Export format strings: \`game.name\`
- Sample/example data: either make generic or read from config

## Acceptance Criteria
- [ ] Export files named with game slug, not 'gundam'
- [ ] Export metadata uses game.name
- [ ] Sample import data is game-appropriate"

gh issue create --repo $REPO --milestone "$M2" \
  --title "De-hardcode email templates" \
  --label "backend,multi-tcg,priority:medium" \
  --body "## Summary
Replace hardcoded 'Gundam Card Game' in email templates with the platform name.

## Files to update
- \`src/lib/services/emailService/templates/welcomeEmail.ts\`
- \`src/lib/services/emailService/templates/emailVerification.ts\`
- \`src/lib/services/emailService/templates/passwordReset.ts\`
- \`src/lib/services/emailService/constants.ts\` — EMAIL_FROM default

## Pattern
Emails are sent from the platform level (Newtype Decks), not per-game. Replace 'Gundam Card Game Team' with 'Newtype Decks' or the configured NEXT_PUBLIC_APP_NAME.

## Acceptance Criteria
- [ ] Email templates use platform name, not game-specific name
- [ ] EMAIL_FROM default uses generic platform name"

gh issue create --repo $REPO --milestone "$M2" \
  --title "Build landing page game selector" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Replace the current Gundam-specific landing page at \`/\` with a game selector grid.

## Design
- Clean grid of game cards showing: logo/icon, game name, card count, short description
- Clicking a game navigates to \`/{gameSlug}/\`
- Active games only (isActive: true), sorted by sortOrder
- Mobile responsive: 1 column on mobile, 2-3 on desktop
- Keep the existing dark purple theme as the platform theme
- Move existing Gundam landing page content to \`/gundam/\` (game home page)

## Implementation
- Fetch games from API at build time (SSG) or ISR
- Each game card links to \`/{game.slug}/\`
- Show card count badge per game
- Simple, fast, no heavy animations

## Acceptance Criteria
- [ ] Root / shows game selector
- [ ] Each game links to /{slug}/
- [ ] Shows card count per game
- [ ] Responsive grid layout
- [ ] Only active games shown"

gh issue create --repo $REPO --milestone "$M2" \
  --title "Update navigation to be game-context-aware" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Update the navigation bar/header to show the current game context and adjust links.

## Changes
- Show current game name/icon in the header when on a game-scoped page
- Navigation links (Cards, Decks, Collection) use current game slug
- Add game switcher dropdown or link back to game selector
- On non-game pages (auth, profile, dashboard), show generic Newtype Decks branding

## Acceptance Criteria
- [ ] Header shows current game name when in game context
- [ ] Nav links include game slug in href
- [ ] Can switch games or return to game selector
- [ ] Non-game pages show platform branding"

gh issue create --repo $REPO --milestone "$M2" \
  --title "Update middleware.ts for [gameSlug] route structure" \
  --label "backend,multi-tcg,priority:high" \
  --body "## Summary
Update the middleware route matchers and auth checks for the new URL structure.

## Changes
- Public routes: \`/\`, \`/[gameSlug]/cards\`, \`/[gameSlug]/decks\`, \`/[gameSlug]/templates\`
- Auth-required routes: \`/[gameSlug]/decks/create\`, \`/[gameSlug]/decks/edit\`, \`/[gameSlug]/collection\`, \`/[gameSlug]/favorites\`
- Admin routes: unchanged (\`/admin\`)
- Auth routes: unchanged (\`/auth/*\`)

## Acceptance Criteria
- [ ] Public game pages accessible without auth
- [ ] Protected game pages require auth
- [ ] Middleware matcher regex updated
- [ ] Auth callback URLs include game slug"

# =============================================================================
# MILESTONE 3: Second Game — One Piece TCG
# =============================================================================

gh issue create --repo $REPO --milestone "$M3" \
  --title "Create One Piece TCG game config" \
  --label "multi-tcg,priority:high" \
  --body "## Summary
Define the One Piece TCG GameConfig JSON with accurate game rules.

## Key differences from Gundam
- **Deck zones:** Leader (1 card, required), Main Deck (50 cards exact), DON!! Deck (10 cards)
- **Card types:** Leader, Character, Event, Stage, DON!!
- **Colors:** Red, Green, Blue, Purple, Black, Yellow
- **Attributes:** Slash, Strike, Ranged, Wisdom, Special
- **Power:** numeric (1000-12000+ range, increments of 1000)
- **Life:** Leaders have life values
- **Counter:** +1000 or +2000 counter values
- **Traits/types:** Straw Hat Crew, Navy, etc.
- **Cost:** 0-10 range
- **Copy limit:** 4 per card (same name), 1 leader

## Acceptance Criteria
- [ ] One Piece game record created with slug='onepiece'
- [ ] Config JSON matches actual One Piece TCG rules
- [ ] All card types, colors, attributes defined
- [ ] Deck rules enforce 50-card main + 1 leader + 10 DON
- [ ] Legal disclaimer references Bandai/Eiichiro Oda/Toei"

gh issue create --repo $REPO --milestone "$M3" \
  --title "Seed One Piece TCG card data (initial set)" \
  --label "multi-tcg,database,priority:high" \
  --body "## Summary
Seed card data for at least one One Piece TCG starter deck or booster set to validate the multi-game architecture end-to-end.

## Approach
- Manually create JSON seed data for OP01 (Romance Dawn) or a starter deck
- Include all required card fields per the One Piece game config
- Store One Piece-specific fields (power, counter, life, color, attribute, traits) in gameAttributes JSONB
- Include card images if available, or placeholder images

## Acceptance Criteria
- [ ] At least 50 One Piece cards seeded
- [ ] Cards have correct types, colors, costs, power values
- [ ] gameAttributes contains One Piece-specific fields
- [ ] Cards appear in /onepiece/cards search
- [ ] Seed script is idempotent"

gh issue create --repo $REPO --milestone "$M3" \
  --title "Validate deck builder with One Piece rules" \
  --label "frontend,multi-tcg,priority:high" \
  --body "## Summary
Test and fix the deck builder to work correctly with One Piece TCG deck rules.

## Validation requirements
- Leader zone: exactly 1 Leader card
- Main deck: exactly 50 cards
- DON!! deck: exactly 10 DON!! cards
- Max 4 copies of any card (by name)
- Color restrictions: main deck cards must match leader color(s)
- The deck builder UI must show all zones defined in config.deckRules.zones

## Acceptance Criteria
- [ ] Deck builder shows Leader, Main Deck, and DON zones
- [ ] Validation enforces 1 leader, 50 main, 10 DON
- [ ] Copy limit enforced at 4
- [ ] Can save a valid One Piece deck
- [ ] Invalid decks show appropriate error messages from config"

gh issue create --repo $REPO --milestone "$M3" \
  --title "Cross-game user dashboard" \
  --label "frontend,multi-tcg,priority:medium" \
  --body "## Summary
Update the user dashboard at /dashboard to show data across all games.

## Design
- Group decks by game (Gundam section, One Piece section)
- Show collection stats per game (cards owned / total)
- Recent activity across games
- Quick links to each game's deck builder

## Acceptance Criteria
- [ ] Dashboard shows decks grouped by game
- [ ] Collection stats per game
- [ ] Works with 1 game, 2 games, or N games
- [ ] Empty state for games with no user data"

gh issue create --repo $REPO --milestone "$M3" \
  --title "Admin panel: game management" \
  --label "admin,multi-tcg,priority:medium" \
  --body "## Summary
Add game management to the admin panel. Allow viewing/editing game configs and scoping card management by game.

## Features
- Game list view (all games with stats: card count, deck count, user count)
- Game config editor (edit JSON config)
- Card management scoped by selected game (dropdown/tab to switch games)
- Add new game form (slug, name, publisher, initial config)

## Acceptance Criteria
- [ ] Admin can view all games
- [ ] Admin can edit game config JSON
- [ ] Card management filters by selected game
- [ ] Can create a new game record from admin UI"

# =============================================================================
# MILESTONE 4: UX Enhancements (Competitor-Inspired)
# =============================================================================

gh issue create --repo $REPO --milestone "$M4" \
  --title "Deck builder: custom categories and subcategories" \
  --label "frontend,enhancement,priority:medium" \
  --body "## Summary
Allow users to organize cards in their deck into custom categories (inspired by Archidekt).

## Design
- Default categories come from config (e.g., 'Units', 'Commands', 'Events')
- Users can create custom categories (e.g., 'Win Conditions', 'Removal', 'Draw Engine')
- Drag cards between categories
- Category names editable inline
- Categories are per-deck metadata, stored in deck JSON

## Acceptance Criteria
- [ ] Default categories from game config
- [ ] User can add/rename/delete custom categories
- [ ] Drag-and-drop between categories
- [ ] Categories saved with deck data"

gh issue create --repo $REPO --milestone "$M4" \
  --title "Deck builder: multiple view modes" \
  --label "frontend,enhancement,priority:medium" \
  --body "## Summary
Add text list and spreadsheet view modes alongside the existing card image view (inspired by Archidekt/Moxfield).

## View modes
1. **Image Grid** (existing) — card images in a grid/stack layout
2. **Text List** — compact text list showing name, qty, type, cost. Fastest for experienced players.
3. **Spreadsheet** — table view with sortable columns (name, qty, type, cost, rarity). Good for analysis.

## Implementation
- View mode toggle buttons in the deck builder toolbar
- User preference saved in localStorage
- All views support the same interactions (add/remove/change quantity)

## Acceptance Criteria
- [ ] Three view modes with toggle
- [ ] Text list view is compact and fast
- [ ] Spreadsheet view has sortable columns
- [ ] View preference persisted
- [ ] All views work on mobile"

gh issue create --repo $REPO --milestone "$M4" \
  --title "Collection-aware deck building" \
  --label "frontend,enhancement,priority:medium" \
  --body "## Summary
Show collection ownership status while deck building (inspired by Archidekt/Moxfield).

## Features
- Toggle to show 'owned' indicator on each card in the deck builder
- Cards you own show a green badge with quantity
- Cards you don't own show a red 'need' badge
- Summary bar: 'You own X/Y cards in this deck'
- 'Buy missing' export — export list of cards you need to acquire

## Acceptance Criteria
- [ ] Collection toggle in deck builder
- [ ] Green/red ownership indicators
- [ ] Summary count of owned vs needed
- [ ] Export missing cards list
- [ ] Works per-game (collection scoped to current game)"

gh issue create --repo $REPO --milestone "$M4" \
  --title "Deck comparison tool" \
  --label "frontend,enhancement,priority:low" \
  --body "## Summary
Side-by-side diff view of two decks (inspired by Archidekt).

## Features
- Select two decks to compare
- Show cards unique to each deck
- Show shared cards with quantity differences
- Show stat differences (curve, type distribution)

## Acceptance Criteria
- [ ] Can select two decks from same game
- [ ] Visual diff of card lists
- [ ] Stat comparison charts
- [ ] Works on mobile (stacked layout)"

# =============================================================================
# MILESTONE 5: Vercel Production Readiness
# =============================================================================

gh issue create --repo $REPO --milestone "$M5" \
  --title "ISR optimization for card detail pages" \
  --label "performance,vercel,priority:high" \
  --body "## Summary
Implement Incremental Static Regeneration for card detail pages to reduce serverless function invocations.

## Implementation
- Card detail pages (\`/[gameSlug]/cards/[cardId]\`) use ISR with revalidate: 86400 (24h)
- Card search results page remains SSR (dynamic queries)
- Game home pages use ISR with revalidate: 3600 (1h)
- generateStaticParams for most popular cards (optional, if build time allows)

## Acceptance Criteria
- [ ] Card detail pages cached for 24h
- [ ] Stale-while-revalidate behavior works correctly
- [ ] Page load time under 500ms for cached pages
- [ ] New cards appear within 24h of database insert"

gh issue create --repo $REPO --milestone "$M5" \
  --title "Image optimization pipeline for Vercel" \
  --label "performance,vercel,priority:high" \
  --body "## Summary
Ensure card images are optimized for Vercel's image optimization and CDN.

## Implementation
- All card images served through next/image with width/height specified
- Responsive sizes: 128px (thumbnail), 256px (list), 512px (detail)
- Formats: WebP with AVIF fallback (already configured in next.config)
- Consider: move card images to Vercel Blob for production
- Lazy loading for below-the-fold images
- Blur placeholder for card images (blurDataURL)

## Acceptance Criteria
- [ ] All card images use next/image
- [ ] Responsive srcSet generated
- [ ] Lazy loading on search results
- [ ] Largest Contentful Paint under 2.5s"

gh issue create --repo $REPO --milestone "$M5" \
  --title "Production environment validation and monitoring" \
  --label "devops,vercel,priority:medium" \
  --body "## Summary
Validate all environment variables, database migrations, and monitoring for production deployment.

## Checklist
- [ ] All required env vars documented in .env.vercel.example
- [ ] Environment validation runs on startup (environment.ts)
- [ ] Prisma migrations tested against Neon production DB
- [ ] Sentry configured for error tracking
- [ ] Health check endpoint works (/api/health)
- [ ] Vercel Analytics enabled
- [ ] Database connection pooling verified (pgbouncer)
- [ ] Function timeout set appropriately in vercel.json
- [ ] CORS configured for production domain
- [ ] Rate limiting works in serverless context"

gh issue create --repo $REPO --milestone "$M5" \
  --title "Edge caching for card search API" \
  --label "performance,vercel,priority:medium" \
  --body "## Summary
Add Cache-Control headers to card search API responses for edge caching.

## Implementation
- Popular search queries (no user-specific filters) cached at the edge for 5 minutes
- Use \`Cache-Control: public, s-maxage=300, stale-while-revalidate=600\`
- User-specific queries (collection-filtered) are never cached
- Cache key includes: gameSlug, search query, filters, page number
- Invalidation: manual purge when card data is updated via admin

## Acceptance Criteria
- [ ] Card search responses include cache headers
- [ ] Edge cache hit rate measurable via Vercel Analytics
- [ ] User-specific queries bypass cache
- [ ] Admin card updates trigger cache invalidation"

# =============================================================================
# MILESTONE 4b: Deck Builder Power Features (Piltover Archive-inspired)
# =============================================================================

gh api repos/$REPO/milestones -f title="M4b: Deck Builder Power Features (PA-inspired)" \
  -f description="Proxy generator, sample hand simulator, deck visibility tiers (draft/private/public), deck codes, deck library social metrics, ruleset modes. All inspired by Piltover Archive. Most are client-side features with zero/minimal backend cost." \
  -f due_on="2026-06-14T00:00:00Z" 2>/dev/null

sleep 1

M4B=$(gh api repos/$REPO/milestones --jq '.[] | select(.title | startswith("M4b:")) | .number')

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Proxy generator: print-ready PDF sheet builder" \
  --label "frontend,enhancement,priority:high" \
  --body "## Summary
Dedicated proxy sheet builder page at \`/[gameSlug]/proxies\`. Users browse cards, click to add to a print sheet, and export as a print-ready PDF. Physical TCG players use this constantly for testing decks before buying cards.

Inspired by Piltover Archive's proxy generator.

## Design
- Split layout: card browser (left) + proxy sheet preview (right)
- Click a card to add it to the sheet. Click again or use +/- to adjust quantity.
- 'Add 1x all filtered' and 'Add 3x all filtered' bulk buttons
- Sheet preview shows 3x3 grid of cards per page (standard TCG card size: 2.5\" x 3.5\")
- 'Export PDF' button generates a print-ready PDF
- Page count indicator
- 'Clear' button to reset

## Implementation
- Client-side PDF generation using jsPDF or pdf-lib (zero backend cost)
- Card images rendered at print resolution
- PDF uses standard card dimensions for clean cutting
- Works per-game (card browser scoped to current game)

## Cost Impact
Zero backend cost — PDF generation happens entirely client-side.

## Acceptance Criteria
- [ ] Proxy page accessible at /[gameSlug]/proxies
- [ ] Can add/remove cards to proxy sheet
- [ ] Bulk add buttons work
- [ ] PDF export generates correctly sized cards
- [ ] Works on mobile (simplified layout)"

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Sample hand simulator in deck builder" \
  --label "frontend,enhancement,priority:high" \
  --body "## Summary
Add a 'Hand' tab to the deck builder that shows a randomized opening hand drawn from the current deck. Click to redraw.

Inspired by Piltover Archive's Hand tab and Archidekt's Fishbowl.

## Design
- New tab in deck builder alongside Gallery/Stats: 'Hand'
- Shows N cards drawn randomly from the main deck (N = game-specific starting hand size, defined in GameConfig)
- 'Draw New Hand' button to reshuffle and redraw
- Cards displayed as full images, fanned or in a row
- Optional: show mulligan (draw N-1) button

## Implementation
- 100% client-side — Fisher-Yates shuffle of the deck card list
- Hand size from \`config.deckRules\` (add \`startingHandSize\` field to DeckRules type, default 5-7 depending on game)
- No API calls, no backend cost

## GameConfig Addition
Add \`startingHandSize: number\` to DeckRules interface (default: 5 for most games).

## Acceptance Criteria
- [ ] Hand tab visible in deck builder
- [ ] Shows correct number of random cards from deck
- [ ] Redraw button works
- [ ] Hand size respects game config
- [ ] Works with any deck size (handles edge cases: empty deck, deck smaller than hand size)"

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Deck visibility tiers: Draft / Private / Public" \
  --label "frontend,backend,enhancement,priority:high" \
  --body "## Summary
Replace the boolean \`isPublic\` field with a three-tier visibility system. This is critical for UX — users abandon sites that force them to finish a deck before saving.

Inspired by Piltover Archive's Draft/Private/Public system.

## Visibility Tiers
- **Draft** — save anytime, no deck validation required, only visible to the deck owner. Default for new decks.
- **Private** — deck must pass game rules validation, shareable by direct link, not visible in public deck library.
- **Public** — deck must pass game rules validation, visible in the deck library, appears in search/trending.

## Schema
Already added to Prisma schema:
\`\`\`prisma
enum DeckVisibility { DRAFT, PRIVATE, PUBLIC }
model Deck {
  visibility DeckVisibility @default(DRAFT)
  ...
}
\`\`\`

## Implementation
- Deck builder: visibility selector dropdown (Draft/Private/Public)
- Draft mode: save button always enabled, no validation errors block saving
- Private/Public mode: save validates against game rules first, shows errors if invalid
- Deck library page only queries visibility=PUBLIC decks
- Shared deck links work for PRIVATE and PUBLIC decks
- Migration: map existing isPublic=true → PUBLIC, isPublic=false → PRIVATE

## Acceptance Criteria
- [ ] Three visibility options in deck builder
- [ ] Drafts save without validation
- [ ] Private decks shareable by link
- [ ] Public decks appear in library
- [ ] Migration preserves existing deck visibility"

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Deck codes: compact shareable encoded strings" \
  --label "frontend,backend,enhancement,priority:medium" \
  --body "## Summary
Generate compact, encoded deck code strings that can be copy-pasted in Discord, chat, or social media. More practical than full URLs for quick sharing.

Inspired by Legends of Runeterra deck codes (used by Piltover Archive for Riftbound).

## Design
- Each deck gets a generated code (e.g., \`NTDK-GN-abc123xyz\`)
- Prefix identifies game: \`GN\` (Gundam), \`OP\` (One Piece), etc.
- Code encodes: game ID + card IDs + quantities (compressed)
- 'Copy Deck Code' button on deck view page
- 'Import Deck Code' input field in deck builder
- Deck codes stored in the \`deckCode\` column (unique, indexed)

## Encoding Strategy
Base64-encode a compact binary representation:
1. Game slug prefix (2 chars)
2. For each card: card set+number encoded as varint + quantity
3. Base64 the result
4. Add human-readable prefix

Keep codes under ~100 characters for easy Discord sharing.

## Acceptance Criteria
- [ ] Deck codes generated on save/publish
- [ ] Copy button on deck view
- [ ] Import field in deck builder
- [ ] Codes are unique and stable (same deck = same code)
- [ ] Invalid codes show clear error message"

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Deck library: social metrics (views, likes, trending)" \
  --label "frontend,backend,enhancement,priority:medium" \
  --body "## Summary
Add view counts, like counts, and trending sort to the public deck library. This transforms the library from a flat list into a discovery engine.

Inspired by Piltover Archive's deck library (22.3k views, 57 likes on top decks).

## Features
- **View count** — increment on deck page load (debounced, deduplicated per session)
- **Like count** — authenticated users can like/unlike a deck (one like per user per deck)
- **Trending sort** — weighted score: (likes * 10 + views) / age_in_hours^1.5
- **Sort options** in library: Trending, Newest, Most Liked, Most Viewed
- **Display** — view count and like count shown on deck cards in the library grid
- **Author display** — show deck author name/avatar on library cards

## Schema
Already added to Prisma:
\`\`\`prisma
model Deck {
  viewCount Int @default(0)
  likeCount Int @default(0)
  ...
}
\`\`\`

Need to add a DeckLike join table for tracking individual likes:
\`\`\`prisma
model DeckLike {
  id     String @id @default(cuid())
  userId String
  deckId String
  user   User   @relation(...)
  deck   Deck   @relation(...)
  @@unique([userId, deckId])
}
\`\`\`

## Cost Considerations
- View count: increment via API route, debounce client-side (don't count refreshes)
- Like count: denormalized on Deck for fast reads, DeckLike table for uniqueness
- Trending calculation: compute on query with SQL, not a background job

## Acceptance Criteria
- [ ] View count increments on deck page load
- [ ] Like/unlike toggle for authenticated users
- [ ] Trending, Newest, Most Liked, Most Viewed sort options
- [ ] Counts displayed on deck library cards
- [ ] Author name shown on deck cards"

gh issue create --repo $REPO --milestone "$M4B" \
  --title "Ruleset modes: Competitive vs Casual in deck builder" \
  --label "frontend,enhancement,priority:low" \
  --body "## Summary
Add a ruleset toggle in the deck builder: Competitive (strict validation) vs Casual (freeform). Casual mode allows saving decks that break normal rules (wrong card counts, illegal combinations).

Inspired by Piltover Archive's ruleset selector.

## Design
- Toggle or dropdown at the top of the deck builder: Competitive | Casual
- **Competitive**: full deck validation from config.deckRules (existing behavior)
- **Casual**: warnings shown but don't block saving. Useful for theorycrafting, proxying, teaching.
- Ruleset mode saved with the deck metadata
- Deck library can filter by ruleset

## Implementation
- Add \`ruleset: 'competitive' | 'casual'\` to Deck model (or store in deck metadata JSON)
- Validation service checks ruleset before applying hard blocks
- Casual decks show yellow warnings instead of red errors

## Acceptance Criteria
- [ ] Ruleset toggle in deck builder
- [ ] Competitive mode blocks invalid saves
- [ ] Casual mode allows any save with warnings
- [ ] Ruleset persisted with deck
- [ ] Library can filter by ruleset"

echo ""
echo "============================================="
echo "All issues created successfully!"
echo "============================================="
echo ""
echo "Summary:"
echo "  M1 (Game Model & DB Foundation):       6 issues"
echo "  M2 (Route Restructure & De-hardcode): 10 issues"
echo "  M3 (One Piece TCG):                    5 issues"
echo "  M4 (UX Enhancements):                  4 issues"
echo "  M4b (Deck Power Features - PA):         6 issues"
echo "  M5 (Vercel Production):                4 issues"
echo "  Total:                                35 issues"
echo ""
echo "PRD Addendum: prd-multi-tcg-addendum.md"
