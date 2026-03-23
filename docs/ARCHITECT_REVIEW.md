# Architecture Review — Newtype Decks

**Prepared for:** Sr. Architect Review
**Repository:** https://github.com/bjudd21/newtypedecks
**Date:** 2026-03-23
**Author:** Brian Judd

---

## What Is This Project?

Newtype Decks is a **multi-TCG (Trading Card Game) platform** for card database browsing, deck building, and collection management. It launched as a Gundam Card Game tool and has been pivoted into a game-agnostic platform that can support any TCG via configuration — no code changes required to add a new game.

Currently supported games:

- **Gundam Card Game** — fully seeded, production-ready
- **One Piece TCG** — seeded (OP-01 Romance Dawn), validation rules implemented

---

## Tech Stack

| Layer      | Technology                                                               |
| ---------- | ------------------------------------------------------------------------ |
| Framework  | Next.js 16 (App Router), TypeScript                                      |
| Styling    | Tailwind CSS                                                             |
| State      | Redux Toolkit (auth, cards, decks, collections, ui slices)               |
| ORM        | Prisma 6                                                                 |
| Database   | PostgreSQL (Neon for Vercel, Docker for local dev)                       |
| Auth       | NextAuth.js                                                              |
| Caching    | Next.js Data Cache (`unstable_cache`) + Redis (installed, not yet wired) |
| PDF        | jsPDF (client-side only, no server cost)                                 |
| Images     | Sharp (server-side resizing), next/image (delivery)                      |
| Deployment | Vercel (primary), Docker/k8s (secondary)                                 |

---

## What Was Built — Feature Summary

This captures work across the M1–M4 milestones and recent sessions.

### Foundation (M1–M2)

| Commit                | What                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `f593c48`             | Multi-TCG database schema — `Game` model with `config` JSONB, `gameAttributes` JSONB on `Card`, `DeckLike`, `DeckVisibility` enum |
| `7d482c8`             | Vercel deployment support, Neon Postgres config                                                                                   |
| `12cda77`             | All game-scoped pages moved under `/[gameSlug]/` routing                                                                          |
| `1db37e4`             | Landing page game selector, game-context-aware navigation                                                                         |
| `39e4a58` + `879b3c4` | Removed all hardcoded game names, legal text, card attributes from UI components                                                  |

### Multi-TCG Features (M3)

| Commit    | What                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| `bc5ac21` | One Piece TCG seed data — 55 OP-01 cards with JSONB game attributes                     |
| `b28b372` | Deck builder validated against One Piece rules (zones, copy limits, color restrictions) |
| `f315eff` | Cross-game user dashboard at `/dashboard` — decks grouped by game                       |

### UX Enhancements (M4)

| Commit    | What                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| `2425a24` | ISR for card detail pages (24h revalidate) and game home pages (1h)                                         |
| `790b830` | 3-tier deck visibility: `DRAFT` / `PRIVATE` / `PUBLIC` replaces boolean `isPublic`                          |
| `bfdd2d3` | Deck builder view modes: Image Grid / Text List / Spreadsheet (persisted to localStorage)                   |
| `c0b3c66` | Collection-aware deck building — ownership badges, summary bar, missing card export                         |
| `b356a0c` | Sample hand simulator — Fisher-Yates shuffle, game-config hand size, mulligan                               |
| `2b22927` | Deck codes — compact shareable `NTDK-GN-abc123` strings, copy/import in builder                             |
| `dd35310` | Deck library social metrics — view counts, like/unlike, trending sort                                       |
| `6ea8811` | Competitive/Casual ruleset toggle — casual mode demotes validation errors to warnings                       |
| `2147eb8` | Admin panel game management — CRUD UI, game config JSON editor, card filtering by game                      |
| `cbc70cf` | Proxy generator at `/[gameSlug]/proxies` — client-side PDF, 3×3 grid, cut marks                             |
| `0c1ad30` | Edge caching — `unstable_cache` wrapping card search, `Cache-Control` headers, `revalidateTag` on mutations |

---

## Core Architecture Decisions

### 1. Game Definition System

Every TCG is a `Game` database record with a `config` JSONB column (`GameConfig` TypeScript type). This config drives everything: card schema, deck rules, filter options, legal disclaimers, branding.

```typescript
// src/lib/types/game.ts
interface GameConfig {
  cardSchema: CardSchema; // field definitions, custom JSONB fields
  deckRules: DeckRules; // zones, card limits, copy limits, hand size
  cardTypes: string[]; // e.g. ['Unit', 'Command', 'Event']
  legalDisclaimer: string;
  copyrightNotice: string;
}
```

**Rationale:** Adding a new TCG is a config + seed script operation, not a code change. The deck builder, validator, and card browser all read from game config at runtime.

**Key files:**

- `src/lib/types/game.ts` — all TypeScript types
- `src/lib/config/games/gundam.ts` — Gundam config
- `src/lib/config/games/onepiece.ts` — One Piece config
- `src/contexts/GameContext.tsx` — `useGame()` hook
- `src/app/[gameSlug]/layout.tsx` — resolves game from DB, wraps in `GameProvider`

---

### 2. URL Structure and Game Scoping

```
/                           → Landing page (game selector)
/[gameSlug]/                → Game home
/[gameSlug]/cards           → Card database
/[gameSlug]/decks           → Public deck library
/[gameSlug]/decks/create    → Deck builder
/[gameSlug]/collection      → Collection tracker
/[gameSlug]/proxies         → Proxy generator (new)
/admin/*                    → Admin panel (not game-scoped)
/dashboard                  → Cross-game user dashboard
```

All API routes filter by `gameId`. Slug → ID resolution is centralized in `src/lib/database/games.ts:resolveGameId()`.

---

### 3. Card Data Model — Universal + JSONB

Universal card fields (name, cost, level, rarity, type, imageUrl, etc.) are standard Prisma columns. Game-specific fields live in `Card.gameAttributes` (JSONB):

- **Gundam:** `{ faction, pilot, model, series }`
- **One Piece:** `{ color, power, counter, life, attribute, trait }`

Each game's `GameConfig.cardSchema.customFields` declares what's in that JSONB.

**⚠️ Known debt:** The old flat columns (`faction`, `pilot`, `model`, `series`, `nation`) still exist on the `Card` model for backward compatibility during migration. All new code reads from `gameAttributes`. A cleanup migration should drop these after verifying no queries reference them.

---

### 4. Deck Visibility Tiers

Three-tier system replaces the old boolean `isPublic`:

| Tier      | Save validation      | Visibility              |
| --------- | -------------------- | ----------------------- |
| `DRAFT`   | None — save anytime  | Owner only              |
| `PRIVATE` | Must pass deck rules | Shareable by link       |
| `PUBLIC`  | Must pass deck rules | Public library + search |

Implemented as a Prisma enum `DeckVisibility`. The deck builder shows a selector; casual ruleset mode (`DeckRuleset.CASUAL`) demotes validation errors to warnings so drafts/casual builds save cleanly.

---

### 5. Caching Strategy

**Current implementation (as of latest commit):**

- **Next.js Data Cache** — `unstable_cache` wraps `CardService.searchCards` with a 5-minute TTL, tagged `'cards'`. Admin card mutations call `revalidateTag('cards', {})` to bust immediately.
- **ISR** — Card detail pages revalidate every 24h; game home/layout pages every 1h.
- **CDN edge** — `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` on GET card search endpoints.
- **Redis** — Installed (`ioredis` 5.9.0) but not yet wired. Currently only the Next.js Data Cache is active.

**⚠️ Note on `revalidateTag` API:** Next.js 16 changed the signature to require a second `profile` argument (`string | CacheLifeConfig`). Since `dynamicIO` is not enabled in `next.config.ts`, we pass `{}` as the profile. This works at runtime but may need revisiting if the project adopts Next.js 16's new `use cache` directive.

---

### 6. Authentication

NextAuth.js with a session-based pattern. Admin routes use a `requireAdmin()` middleware that checks `session.user.role === 'admin'`. The middleware is called at the top of each admin API route handler.

**⚠️ Current gap:** Admin auth is checked via `getServerSession()` inside each route — there's no middleware-level route guard at `middleware.ts` for `/admin/*` API routes. The page-level redirect exists but API routes rely on each handler calling `requireAdmin()` correctly.

---

### 7. Proxy Generator (client-side PDF)

`/[gameSlug]/proxies` generates print-ready PDFs entirely in the browser using jsPDF:

- US Letter (8.5"×11"), 3×3 card grid, 2.5"×3.5" per card
- Fetches card images as base64 data URLs at export time
- Corner cut marks + card name labels
- Zero backend cost
- Sheet state persists to `localStorage` per game

The PDF generation is a dynamic import (`await import('jspdf')`) to avoid SSR bundle bloat.

---

## File Size and Code Quality

- **0 ESLint errors**, ~124 warnings (mostly complexity in service layer — legitimate business logic)
- **TypeScript:** strict mode, passing clean
- **Tests:** 193 passing, 2 skipped
- **Pre-commit hook** enforces type-check + lint + format + file size on every commit

---

## Open Issues (Remaining Work)

| #   | Title                           | Notes                                                             |
| --- | ------------------------------- | ----------------------------------------------------------------- |
| #50 | Deck builder: custom categories | Drag-and-drop, stored in deck JSON. Highest complexity remaining. |
| #53 | Deck comparison tool            | Side-by-side diff view, stat charts                               |
| #61 | Image optimization for Vercel   | Audit next/image usage, srcSet, lazy load, Vercel Blob            |
| #62 | Production env validation       | Env var checklist, Sentry, health endpoint, connection pooling    |

---

## Questions for the Sr. Architect

### Caching

1. **`unstable_cache` vs `use cache` directive** — We're on Next.js 16 but `dynamicIO` is disabled. Should we adopt the new `use cache` + `cacheTag()` / `cacheLife()` API now, or stay with `unstable_cache` until the API stabilizes? The `revalidateTag` signature change (now requires a profile arg) suggests Next.js 16 expects `dynamicIO` to be enabled.

2. **Redis not wired** — Redis is installed and the Docker service runs, but no code uses it. Is there value in using Redis for distributed cache (e.g. across Vercel serverless function instances) rather than relying on Next.js Data Cache, which is per-instance? What would you prioritize caching in Redis first?

3. **POST search endpoint caching** — The primary card search is a `POST /api/cards/search` (body carries filters). CDN edge caches won't cache POST. `unstable_cache` helps within a single function instance. Would you recommend converting this to a GET with query params for true edge caching, or is the server-side cache sufficient?

### Database

4. **Deprecated flat columns** — `Card.faction`, `.pilot`, `.model`, `.series`, `.nation` still exist as Prisma columns. All new code reads from `gameAttributes` JSONB. What's the safest migration strategy to drop these? Should we write a data migration script that copies any remaining values into `gameAttributes` before the column drop?

5. **JSONB vs normalized tables for game attributes** — The current design uses `gameAttributes: Json` (JSONB) on `Card` for per-game fields. This gives flexibility but loses referential integrity and makes filtering/indexing harder. For example, filtering One Piece cards by `color` requires a JSONB path query. Would you prefer normalized tables (e.g. `CardAttribute` with `key/value` rows) or JSONB with partial indexes? Are there scale concerns with the current approach?

6. **Connection pooling** — Using Neon Postgres with pgbouncer (pooled `DATABASE_URL` + direct `DIRECT_DATABASE_URL` for migrations). Prisma's Accelerate is not in use. Is the current pooling setup adequate for Vercel's serverless concurrency, or should we layer Prisma Accelerate on top?

### Architecture

7. **Admin API security** — Admin routes call `requireAdmin()` which does `getServerSession()` inside the handler. There's no middleware-level enforcement at `middleware.ts`. Is this pattern acceptable, or should `/api/admin/*` be guarded at the middleware layer to prevent accidental exposure?

8. **Game config stored in DB vs code** — Game configs are seeded from TypeScript files (`src/lib/config/games/*.ts`) into the database. The DB version is authoritative at runtime. There's no sync mechanism — if `gundam.ts` changes, the DB record doesn't automatically update. Should we add an upsert on startup, or is the current "seed manually" approach fine for this scale?

9. **Multi-tenancy model** — Every query filters by `gameId`. There's no row-level security at the database — it's enforced in the application layer via Prisma queries. Is this appropriate, or would you recommend Postgres RLS policies as a belt-and-suspenders approach?

10. **`DeckRuleset` and `DeckVisibility` as Prisma enums** — These are database-level enums (`CREATE TYPE`). Adding a new value requires a migration. Would you prefer application-level string enums (with a `CHECK` constraint) for more flexibility, or is the current Prisma enum approach fine?

### Frontend

11. **Redux vs React Query** — The project uses Redux Toolkit for card/deck/collection state. Several components also do local `useState` + `useEffect` + `fetch` patterns (e.g. the admin pages). Is there a preference for consolidating on one data-fetching approach (Redux, React Query/TanStack Query, or Next.js Server Components + Server Actions)?

12. **`unstable_cache` in Next.js 16** — The function name includes `unstable_`. Is there a stable alternative in Next.js 16 we should be using instead?

---

## Repository Navigation

| Path                           | What's there                                                 |
| ------------------------------ | ------------------------------------------------------------ |
| `src/app/[gameSlug]/`          | All game-scoped pages and layouts                            |
| `src/app/api/`                 | All API routes (cards, decks, collections, auth, admin)      |
| `src/components/`              | UI, card, deck, collection, navigation, layout components    |
| `src/lib/config/games/`        | Per-game TypeScript config files                             |
| `src/lib/types/`               | All TypeScript types (game.ts, card.ts, collection.ts)       |
| `src/lib/services/`            | Business logic (cardService, deckValidationService, etc.)    |
| `src/contexts/GameContext.tsx` | useGame() hook — the primary way components read game config |
| `prisma/schema.prisma`         | Full database schema                                         |
| `scripts/seed-*.js`            | Game and card seed scripts                                   |
| `docs/ARCHITECTURE.md`         | Original architecture document (runtime, request flow)       |
| `docs/DEVELOPER_GUIDE.md`      | Full dev workflow, setup, conventions                        |
| `prd-multi-tcg-addendum.md`    | Product requirements for the multi-TCG pivot                 |
