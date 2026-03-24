#!/bin/bash
# =============================================================================
# Newtype Decks — Review #2 Remediation Issues
# =============================================================================
# Addresses gaps found during the second Sr. Architect review
# Usage: chmod +x create-review2-issues.sh && ./create-review2-issues.sh
# =============================================================================

REPO="bjudd21/newtypedecks"

echo "Creating review #2 remediation issues..."
echo ""

gh issue create --repo $REPO \
  --title "[P1-SECURITY] Fix middleware for [gameSlug] routing and /api/admin guard" \
  --label "security,bug,priority:critical" \
  --body "## Problem — CARRIED FROM REVIEW #1, STILL UNFIXED

middleware.ts has not been updated for the multi-TCG route restructure. Three gaps:

### 1. /api/admin not guarded at middleware level
\`adminRoutes\` only contains \`['/admin']\`. Admin API routes at \`/api/admin/*\` are only protected by per-handler \`requireAdmin()\` calls. If a developer adds a new admin route and forgets the call, it's publicly accessible.

**Fix:** \`const adminRoutes = ['/admin', '/api/admin'];\`

### 2. Auth route matchers don't match [gameSlug] paths
\`authRoutes\` checks for \`/decks/create\`, \`/collection\`, \`/favorites\` — but pages now live at \`/gundam/decks/create\`, \`/onepiece/collection\`, etc. The prefix patterns don't match.

**Fix:** Use a helper that strips the first path segment (the gameSlug) before matching, or use regex patterns like \`/^\\/[^/]+\\/decks\\/create/\`.

### 3. Public route list is stale
\`publicRoutes\` includes \`/cards\`, \`/decks\`, \`/templates\` but these now live under \`/[gameSlug]/\`.

**Fix:** Match patterns that account for the dynamic game prefix.

## Current middleware (unchanged since original codebase)
\`\`\`typescript
const adminRoutes = ['/admin'];  // Missing /api/admin
const authRoutes = ['/decks/create', '/collection', ...];  // Missing [gameSlug] prefix
const publicRoutes = ['/cards', '/decks', ...];  // Missing [gameSlug] prefix
\`\`\`

## Acceptance criteria
- [ ] \`/api/admin/games\` returns 401/redirect without admin session
- [ ] \`/gundam/decks/create\` redirects to signin without auth
- [ ] \`/onepiece/collection\` requires auth
- [ ] \`/gundam/cards\` accessible without auth
- [ ] \`/gundam/decks\` (public library) accessible without auth
- [ ] \`/gundam/proxies\` accessible without auth
- [ ] All \`/api/*\` routes except auth/health/games/reference/cards-search pass through (API routes handle their own auth)"

gh issue create --repo $REPO \
  --title "[P2] Refactor DeckShare component from isPublic to visibility enum" \
  --label "cleanup,priority:high" \
  --body "## Problem

DeckShare component still uses \`isPublic: boolean\` as its core prop and internal state. This is the biggest remaining cluster of isPublic references (10 of 22 total).

## Files
- \`src/components/deck/DeckShare.tsx\` — 10 references to \`isPublic\`
- \`src/components/deck/FavoriteDeckManager/types.ts\` — \`isPublic: boolean\` in type
- \`src/components/deck/FavoriteDeckManager/components/FavoriteCard.tsx\` — reads \`isPublic\`
- \`src/components/deck/DeckTemplateBrowser/types.ts\` — \`isPublic?: boolean\`
- \`src/components/deck/DeckBuilder/deckFactory.ts\` — \`isPublic: false\`
- \`src/lib/services/socialService/types.ts\` — \`isPublic: boolean\`

## Fix
- DeckShare props: replace \`isPublic: boolean\` with \`visibility: DeckVisibility\`
- DeckShare UI: show all three states (Draft/Private/Public) instead of a binary toggle
- onVisibilityChange callback passes \`DeckVisibility\` not boolean
- FavoriteCard: show \`favorite.deck.visibility\` badge
- deckFactory: use \`visibility: 'DRAFT'\` instead of \`isPublic: false\`
- Update types in FavoriteDeckManager and socialService

## Also clean up API sync refs
These API lines compute \`isPublic\` for backward compat and can be left as-is for now, but add a comment:
- \`src/app/api/decks/route.ts:212\` — \`isPublic: visibility === 'PUBLIC'\`
- \`src/app/api/decks/[id]/versions/*\` — same pattern

## Acceptance criteria
- [ ] DeckShare accepts \`visibility: DeckVisibility\` prop
- [ ] DeckShare shows Draft/Private/Public states
- [ ] grep \`isPublic\` in components/ returns 0 (excluding comments)
- [ ] deckFactory defaults to \`visibility: 'DRAFT'\`"

gh issue create --repo $REPO \
  --title "[P2] Fix import/export services for gameAttributes (One Piece import broken)" \
  --label "bug,multi-tcg,priority:high" \
  --body "## Problem

The CSV and JSON importers still map flat column names (\`faction\`, \`pilot\`, \`model\`) directly instead of routing through \`gameAttributes\`. This means importing a One Piece deck/collection from CSV or JSON will fail — the importer tries to set \`card.faction\` which doesn't exist for One Piece cards.

## Files
- \`src/lib/services/deckExportService/importers/csvImporter.ts:65-67\` — maps \`faction\`, \`pilot\`, \`model\` as flat fields
- \`src/lib/services/deckExportService/importers/jsonImporter.ts:41-43\` — same
- \`src/lib/services/searchAnalyticsService/utils/patternKeys.ts:36-38\` — reads \`filters.faction\`, \`filters.series\`, \`filters.pilot\` for analytics labels

## Fix
- Importers should detect game-specific fields from the game config and route them into \`gameAttributes\` JSONB instead of flat columns
- For CSV: if a column name matches a \`customField.key\` in the game config, put it in \`gameAttributes\`
- For JSON: same logic
- For analytics pattern keys: use the field key names generically, not hardcoded Gundam field names

## Acceptance criteria
- [ ] CSV import of One Piece cards with \`color\`, \`power\`, \`counter\` columns works
- [ ] JSON import of One Piece cards with game-specific fields works
- [ ] Gundam imports still work (backward compatible)
- [ ] Search analytics labels work for both games"

gh issue create --repo $REPO \
  --title "[P3] Remove ImageCacheService dead code" \
  --label "cleanup,performance,priority:medium" \
  --body "## Problem

ImageCacheService was properly defanged (blob URL path removed, now returns URLs as-is) but the service class, its storage backends (MemoryCache, IndexedDBCache), stats tracker, cleanup tasks, and all consumer hooks still exist. This is ~500 lines of dead code adding bundle weight and cognitive overhead.

## Files to remove
- \`src/lib/services/imageCacheService/\` — entire directory
- \`src/lib/services/imageCacheService/storage/memoryCache.ts\`
- \`src/lib/services/imageCacheService/storage/indexedDB.ts\`
- \`src/lib/services/imageCacheService/stats/tracker.ts\`
- \`src/lib/services/imageCacheService/cleanup/tasks.ts\`
- \`src/lib/services/imageCacheService/initialization/setup.ts\`

## Consumers to update (remove ImageCacheService import, use URL directly)
- \`src/components/ui/OptimizedImage/hooks/useImagePreloader.ts\`
- \`src/components/ui/OptimizedImage/hooks/useImagePrefetcher.ts\`
- \`src/components/ui/OptimizedImage/hooks/useImageSetup.ts\`

## What to keep
- \`src/components/ui/OptimizedImage/\` component itself — it uses next/image correctly
- Any prefetch logic that calls \`<link rel='preload'>\` (not blob-based) is fine to keep

## Acceptance criteria
- [ ] \`src/lib/services/imageCacheService/\` directory deleted
- [ ] No imports of ImageCacheService anywhere
- [ ] OptimizedImage component still works
- [ ] Bundle size reduced (verify with \`npm run build\`)"

gh issue create --repo $REPO \
  --title "[P3] Implement collections/[cardId] route (currently returns mock data)" \
  --label "bug,priority:medium" \
  --body "## Problem

\`src/app/api/collections/[cardId]/route.ts\` returns hardcoded mock data with TODO comments. It never queries the database.

\`\`\`typescript
// TODO: Implement actual database query with Prisma
// TODO: Add authentication and authorization checks
const mockCollectionCard = { id: 'sample-collection-card-id', ... };
\`\`\`

## Fix
- GET: Query \`CollectionCard\` by \`cardId\` + authenticated user's collection + gameId
- PUT/PATCH: Update quantity for the card in the user's collection
- DELETE: Remove the card from the user's collection
- Use \`resolveGameFromRequest()\` for game scoping
- Require authentication

## Acceptance criteria
- [ ] GET returns real collection data for the authenticated user
- [ ] PUT updates quantity
- [ ] DELETE removes card from collection
- [ ] Requires auth
- [ ] Scoped by gameId
- [ ] No mock data"

gh issue create --repo $REPO \
  --title "[P3] Apply CORS headers to API routes" \
  --label "cleanup,priority:low" \
  --body "## Problem

\`corsOrigins\` is defined in \`src/lib/config/environment.ts\` but never applied to any API response. CORS headers are not set on any route.

## Fix
- Create a shared CORS middleware utility at \`src/app/api/_lib/cors.ts\`
- Apply \`Access-Control-Allow-Origin: *\` to all \`/api/*\` responses for now
- Add \`Access-Control-Allow-Methods\` and \`Access-Control-Allow-Headers\`
- Handle OPTIONS preflight requests
- Document that this should be locked to the production domain when deployed

## Acceptance criteria
- [ ] API responses include CORS headers
- [ ] OPTIONS preflight requests return 200 with correct headers
- [ ] Documentation note about locking to production domain"

echo ""
echo "============================================="
echo "Review #2 issues created!"
echo "============================================="
echo ""
echo "Summary:"
echo "  P1 (Security):  1 issue  — middleware fix"
echo "  P2 (Must fix):  2 issues — DeckShare refactor, import/export fix"
echo "  P3 (Cleanup):   3 issues — ImageCacheService removal, collections mock, CORS"
echo "  Total:          6 issues"
echo ""
echo "Priority order: P1 middleware → P2 DeckShare → P2 importers → P3 ImageCache → P3 collections → P3 CORS"
