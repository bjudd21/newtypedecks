# Newtype Decks — Complete Session Changeset

**8 modified files, 18 new files, 3,915 lines of new/updated code**
**35 issues across 6 milestones**

---

## Commit Message

```
feat: multi-TCG platform pivot + Vercel deployment support

Multi-TCG Architecture:
- Add Game model with GameConfig JSON for per-game configuration
- Add gameId FK to Card, Deck, Collection, Set, CardType, Rarity
- Add gameAttributes JSONB column to Card (replaces hardcoded fields)
- Add DeckVisibility enum (Draft/Private/Public), DeckLike model
- Add deckCode, viewCount, likeCount to Deck model
- Add Gundam + One Piece game configs with full seed data
- Add GameContext React provider with useGame()/useOptionalGame()
- Add TypeScript types: Game, GameConfig, CardSchema, DeckRules, DeckZone
- Add game resolution utilities and API routes (/api/games)
- Add [gameSlug] dynamic route layout with GameProvider
- Add game seed script (scripts/seed-games.js)
- Add SQL backfill migration for existing data
- Update CLAUDE.md with multi-TCG architecture docs

Vercel Deployment:
- Remove output: standalone for Vercel compatibility
- Add postinstall/vercel-build scripts for Prisma
- Add directUrl to Prisma datasource for Neon pooling
- Add vercel.json, .env.vercel.example, deployment guide
- Remove REDIS_URL from required env vars (unused)

Planning:
- Add PRD addendum v2.0 (competitive analysis: ExBurst, Archidekt,
  Egman Events, Moxfield, Piltover Archive)
- Add 35-issue script across 6 milestones for agent coder
```

---

## Modified Files (8)

| File | Key Changes |
|---|---|
| `.gitignore` | Added `!.env.example` and `!.env.vercel.example` exceptions |
| `CLAUDE.md` | Full rewrite of project overview, architecture, directory structure, API docs for multi-TCG |
| `next.config.ts` | Removed `output: 'standalone'`, added Vercel Blob remote pattern |
| `package.json` | Added `postinstall`, `vercel-build`, `db:seed:games` scripts |
| `prisma/schema.prisma` | Game model, gameId FKs (6 tables), gameAttributes JSONB, DeckVisibility enum, DeckLike model, directUrl |
| `src/lib/config/environment.ts` | Removed `REDIS_URL` from required vars |
| `src/lib/database/index.ts` | Re-exports game utilities |
| `src/lib/types/index.ts` | Added game types export |

## New Files (18)

### Foundation Types & Config
| File | Lines | Purpose |
|---|---|---|
| `src/lib/types/game.ts` | 293 | Game, GameConfig, CardSchema, DeckRules, DeckZone types + validation |
| `src/lib/config/games/gundam.ts` | 222 | Gundam game config capturing all 150 formerly hardcoded values |
| `src/lib/config/games/onepiece.ts` | 213 | One Piece TCG config with accurate rules |
| `src/lib/config/games/index.ts` | 17 | Config registry barrel export |

### React Context
| File | Lines | Purpose |
|---|---|---|
| `src/contexts/GameContext.tsx` | 72 | GameProvider + useGame() + useOptionalGame() hooks |
| `src/contexts/index.ts` | 3 | Context barrel export |

### Database & API
| File | Lines | Purpose |
|---|---|---|
| `src/lib/database/games.ts` | 107 | getGameBySlug(), getAllActiveGames(), resolveGameId() |
| `src/app/api/games/route.ts` | 32 | GET /api/games — game list with counts |
| `src/app/api/games/[slug]/route.ts` | 43 | GET /api/games/[slug] — full game config |

### App Routes
| File | Lines | Purpose |
|---|---|---|
| `src/app/[gameSlug]/layout.tsx` | 75 | Server layout: loads game, wraps in GameProvider, generates metadata |
| `src/app/[gameSlug]/page.tsx` | 91 | Game home page with quick links |

### Database Migration
| File | Lines | Purpose |
|---|---|---|
| `prisma/migrations/multi_tcg_backfill/backfill.sql` | 107 | Creates Gundam record, backfills gameId, migrates card attributes, migrates deck visibility |
| `scripts/seed-games.js` | 172 | Idempotent game seeder (Gundam + One Piece) |

### Vercel Deployment
| File | Lines | Purpose |
|---|---|---|
| `vercel.json` | 28 | Region, function timeouts, headers |
| `.env.vercel.example` | 57 | Complete env var template for Vercel + Neon |
| `docs/VERCEL_DEPLOYMENT.md` | 130 | Step-by-step deployment guide |

### Planning
| File | Lines | Purpose |
|---|---|---|
| `prd-multi-tcg-addendum.md` | 307 | PRD v2.0 with 5 competitor analyses, phased plan |
| `create-multi-tcg-issues.sh` | 980 | 35 GitHub issues, 6 milestones |

---

## Issues Script Summary (35 issues, 6 milestones)

| Milestone | Issues | Focus |
|---|---|---|
| **M1**: Game Model & DB Foundation | 6 | Game table, gameId FKs, JSONB migration, seed, API scoping, types |
| **M2**: Route Restructure & De-hardcoding | 10 | [gameSlug] routing, GameProvider, de-hardcode 150 refs, landing page, nav, middleware, emails |
| **M3**: One Piece TCG | 5 | Game config, seed data, deck builder validation, dashboard, admin |
| **M4**: UX Enhancements | 4 | Custom categories, view modes, collection-aware building, deck comparison |
| **M4b**: Deck Power Features | 6 | Proxy generator, sample hand, visibility tiers, deck codes, social metrics, ruleset modes |
| **M5**: Vercel Production | 4 | ISR, image optimization, env validation, edge caching |

---

## How to Apply

```bash
cd newtypedecks
git add -A
git commit -m "feat: multi-TCG platform pivot + Vercel deployment support"
git push origin main

# Load issues for agent coder
chmod +x create-multi-tcg-issues.sh
./create-multi-tcg-issues.sh

# After migration: seed game records
npm run db:seed:games
```
