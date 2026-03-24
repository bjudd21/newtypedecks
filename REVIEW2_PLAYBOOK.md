# Review #2 — Remediation Playbook

## Load the issues

```bash
chmod +x create-review2-issues.sh && ./create-review2-issues.sh
```

---

## Issue 1: Middleware fix (P1 — SECURITY, do this first)

> "Fix middleware.ts — this is the second time this has been flagged and it's a security gap. Three changes:
>
> 1. Add '/api/admin' to the adminRoutes array: `const adminRoutes = ['/admin', '/api/admin'];`
> 2. Auth routes need to match the [gameSlug] prefix. The current patterns like '/decks/create' don't match '/gundam/decks/create'. Write a helper function that checks if a path matches after stripping the first segment, or use a regex approach. The protected patterns are: `/{gameSlug}/decks/create`, `/{gameSlug}/decks/edit`, `/{gameSlug}/collection`, `/{gameSlug}/favorites`, plus the non-game routes `/dashboard`, `/profile`, `/settings/pwa`.
> 3. Public routes need the same treatment — '/cards' should match '/gundam/cards', '/onepiece/cards', etc. Also add '/api/games', '/api/reference', '/api/health' to the public API list.
>
> Test: /api/admin/games without admin session should get blocked. /gundam/decks/create without auth should redirect to signin. /gundam/cards should work without auth."

---

## Issue 2: DeckShare refactor (P2)

> "Refactor the DeckShare component from isPublic boolean to the DeckVisibility enum. DeckShare currently takes `isPublic: boolean` as a prop with a binary toggle — this should be `visibility: DeckVisibility` with a three-state selector (Draft/Private/Public). Update the component, its props interface, and the onVisibilityChange callback. Also update FavoriteCard to show `deck.visibility` instead of `deck.isPublic`, deckFactory to default to `visibility: 'DRAFT'`, and the types in FavoriteDeckManager and socialService. After this, grep for 'isPublic' in src/components/ should return zero results excluding comments."

---

## Issue 3: Import/export gameAttributes fix (P2)

> "Fix the CSV and JSON importers in src/lib/services/deckExportService/importers/. The csvImporter and jsonImporter still map game-specific fields (faction, pilot, model) as flat columns instead of routing them into gameAttributes JSONB. This means One Piece card imports with color/power/counter columns will fail.
>
> The fix: when importing, check if a field name matches a customField key in the game config. If it does, put the value in gameAttributes instead of as a flat column. For CSV, column headers that match customField keys go into gameAttributes. For JSON, same logic. Keep backward compatibility — Gundam imports with faction/pilot/model should still work by routing those into gameAttributes too.
>
> Also fix src/lib/services/searchAnalyticsService/utils/patternKeys.ts — it hardcodes 'Faction:', 'Series:', 'Pilot:' labels. Make these generic or read from the game config."

---

## Issue 4: Remove ImageCacheService (P3)

> "Delete the entire src/lib/services/imageCacheService/ directory. It was properly defanged — getImage() just returns the URL as-is — but the class, storage backends, stats tracker, cleanup tasks, and initialization code are all dead weight. Remove it and update the three consumer hooks in src/components/ui/OptimizedImage/hooks/ to stop importing it. The OptimizedImage component itself should keep working — it uses next/image correctly. Verify with `npm run build` that bundle size decreases."

---

## Issue 5: Implement collections/[cardId] (P3)

> "Replace the mock data in src/app/api/collections/[cardId]/route.ts with a real implementation. The current code has TODO comments and returns hardcoded sample data. Implement:
>
> - GET: Query CollectionCard by cardId + authenticated user's collection, scoped by gameId via resolveGameFromRequest()
> - PUT: Update quantity for the card in the user's collection
> - DELETE: Remove the card from the collection
> - All operations require authentication
> - Follow the same patterns used in the main collections route"

---

## Issue 6: CORS headers (P3)

> "Create a CORS utility at src/app/api/\_lib/cors.ts that adds Access-Control-Allow-Origin: _ and appropriate CORS headers to API responses. Apply it to all /api/_ routes via a shared response wrapper or by adding headers in vercel.json. Handle OPTIONS preflight requests. Add a comment that this should be locked to the production domain when deployed. The corsOrigins value in environment.ts is defined but never used — either wire it in or remove it to avoid confusion."

---

## Work Order

| #   | Issue                     | Time   | Deploy blocker?                            |
| --- | ------------------------- | ------ | ------------------------------------------ |
| 1   | Middleware fix            | 30 min | **YES** — security gap                     |
| 2   | DeckShare refactor        | 1 hr   | No — cosmetic but messy                    |
| 3   | Import/export fix         | 1 hr   | No — until someone imports One Piece data  |
| 4   | ImageCacheService removal | 30 min | No — dead code cleanup                     |
| 5   | collections/[cardId]      | 1 hr   | No — low traffic endpoint                  |
| 6   | CORS                      | 30 min | No — only matters for cross-origin clients |

**Do #1 first.** It's the only deploy blocker. After that, #2 and #3 are the highest value. #4-6 are cleanup you can batch together.
