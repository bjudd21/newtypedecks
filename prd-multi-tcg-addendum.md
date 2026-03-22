# PRD Addendum v2.0: Multi-TCG Platform Pivot

**Parent Document:** `prd-gundam-card-game-website.md`
**Status:** Approved — supersedes game-specific sections of the original PRD
**Date:** 2026-03-22

---

## Executive Summary

Newtype Decks pivots from a single-game Gundam Card Game tool to a multi-TCG platform supporting any trading card game the owner wants to add. The architecture introduces a **Game Definition System** where each TCG is described by a configuration object that drives the entire app — card schema, deck rules, UI branding, legal disclaimers — without code changes per game.

This is not a public "anyone can add a game" platform. It's a personal multi-game toolkit where Brian decides which games get added and manages their card data. The initial supported games are **Gundam Card Game**, **One Piece TCG**, and **Magic: The Gathering**, with the architecture designed so adding a new game is a config + seed operation, not a code deployment.

---

## Competitive Landscape & Design Influences

### ExBurst.dev (Primary Competitor)
Solo dev, Patreon-funded. Supports 7+ TCGs (Gundam, Union Arena, One Piece, Pokemon Pocket, Cyberpunk, Naruto Mythos, Riftbound). Per-game sections with deck builder, card list, collection tracker, tournament features. URL pattern: `/{game}/deckbuilder`, `/{game}/collection`.

**What to steal:** Multi-game URL routing pattern, per-game scoping of all features, the fact that one person can run this proves the model works.

**What to beat:** Better UX, better mobile experience, cleaner design, faster search, more flexible architecture that doesn't require code changes per game.

### Archidekt (Feature Benchmark — MTG Only)
Gold standard for deck building UX. 4,456 Patreon supporters at $2/mo. Key features worth adopting:

- **Custom categories/subcategories in deck builder** — users organize cards their way, not forced into predefined zones
- **Multiple view modes** — image grid, text list, spreadsheet view. Users pick their preference
- **Deck collaboration** — real-time collaborative editing (future phase)
- **Playtester/Fishbowl** — solitaire playtest mode to goldfish decks (future phase)
- **Collection-aware deck building** — shows which cards you own/need while building
- **Deck comparison** — side-by-side diff of two decks
- **Price integration** — real-time pricing from multiple sources (TCGPlayer, Card Kingdom, Cardmarket)

### Egman Events (Content/Meta Benchmark)
Tournament archive hub covering One Piece, Digimon, Dragon Ball, Gundam, Riftbound. Key features:

- **Tournament deck lists with meta breakdowns** — color/archetype distribution charts from events
- **Community event submission** — users submit tournament results
- **Per-set format archives** — browse meta by set release window

**Adoption plan:** Tournament results and meta tracking are Phase 3+. The immediate value is deck building and collection, which Egman doesn't do.

### Piltover Archive (Feature Density Benchmark — Riftbound)
Single-game site for Riot's Riftbound TCG. Solo/small team, Patreon-funded, 9,300+ Discord members, 4,000+ decks. Launched April 2025, already the #1 tool for its game. Key features worth adopting:

- **Proxy Generator** — dedicated page to build print-ready PDF proxy sheets. Browse cards, click to add, "Add 1x all" / "Add 3x all" buttons, export PDF. Physical TCG players use this constantly for playtesting before buying cards.
- **Sample Hand Simulator** — "Hand" tab in deck builder shows a randomized opening hand drawn from your deck. Click to redraw. Zero backend cost (client-side shuffle). Essential deck testing tool that every competitor has.
- **Deck Visibility Tiers** — Draft (save anytime, no validation required, only you can see), Private (must pass deck rules, shareable by link), Public (visible in deck library). Critical UX insight: users abandon sites that force them to finish a deck before saving. Our current boolean `isPublic` is insufficient.
- **Deck Codes** — compact encoded strings (adapted from LoR deck code format) for copy-paste sharing in Discord/chat. Way more practical than URLs for quick sharing in group chats.
- **Deck Library with Social Metrics** — view count (22.3k views on top decks), like count, trending sort, filter by Legend/leader, author avatars with Patreon badges. Makes the deck library a discovery engine, not just a list.
- **Ruleset Modes** — Competitive (strict validation) vs Casual (freeform, broken rules allowed). Toggle in the deck builder. Maps cleanly to our GameConfig system.
- **Compact/Full Card View Toggle** — compact shows base variant only, full shows all variants (foils, alt art). Good for large card pools.
- **Card Size Slider** — adjustable card image size in builder and library.

**What to steal:** Proxy generator, sample hand, draft saves, deck codes, social metrics on deck library. All high-value, low-backend-cost features.

**What to skip for now:** TTS export (too game-specific), foil visual effects (polish), news/blog (content management overhead).

### Moxfield (UX Benchmark — MTG Only)
Cleanest deck builder UI in the market. Free with $3-5/mo premium. Key lessons:

- **Speed above all** — card search must feel instant
- **Collection is secondary** — deck building is the core loop, collection tracking bolts on
- **Premium gating** — deck folders, advanced analytics behind paywall, core features free

---

## Architectural Decisions

### 1. Game Definition System

Each TCG is defined by a database record (`Game` table) plus a JSON configuration object (`GameConfig`). The config specifies everything the app needs to render and validate for that game:

```
Game {
  id, slug, name, shortName, publisher, copyrightHolder,
  logoUrl, iconUrl, bannerUrl,
  primaryColor, secondaryColor, accentColor,
  isActive, sortOrder,
  createdAt, updatedAt
}

GameConfig (stored as JSON in Game.config column) {
  cardSchema: {
    // Which fields are visible/required for this game
    fields: [
      { key: "cost", label: "Cost", type: "number", required: true },
      { key: "power", label: "Power", type: "number", required: false },
      { key: "color", label: "Color", type: "select", options: [...] },
      ...
    ],
    // Game-specific attributes stored in Card.gameAttributes JSONB
    customFields: [
      { key: "pilot", label: "Pilot", type: "text" },      // Gundam
      { key: "don", label: "DON!!", type: "number" },       // One Piece
      { key: "manaCost", label: "Mana Cost", type: "text" } // MTG
    ]
  },
  deckRules: {
    minDeckSize: 50,
    maxDeckSize: 60,
    maxCopiesPerCard: 4,
    zones: [
      { key: "main", label: "Main Deck", required: true },
      { key: "sideboard", label: "Sideboard", required: false, maxSize: 15 },
      { key: "leader", label: "Leader", required: true, maxSize: 1 },  // One Piece
      { key: "extra", label: "Extra Deck", required: false, maxSize: 15 } // Future
    ],
    specialRules: [] // Game-specific validation functions by ID
  },
  cardTypes: ["Unit", "Character", "Command", "Operation"],
  rarities: ["Common", "Uncommon", "Rare", "Super Rare", "Secret Rare"],
  importFormats: ["text", "csv", "json"],
  exportFormats: ["text", "csv", "json"],
  legalDisclaimer: "Gundam Card Game © Bandai Namco Entertainment Inc...",
  copyrightNotice: "...",
  dataSourceUrl: "https://...",
  keywords: ["Mobile Suit", "Newtype", "Ace Pilot"]
}
```

**Why this approach:** Adding One Piece TCG or any new game requires zero code changes — just a new Game record, its config JSON, and seeded card data. The entire UI reads from the game context.

### 2. URL Routing Structure

```
/                           → Landing page (game selector)
/[gameSlug]/                → Game home page
/[gameSlug]/cards           → Card database
/[gameSlug]/cards/[cardId]  → Card detail
/[gameSlug]/decks           → Public deck browser
/[gameSlug]/decks/create    → Deck builder
/[gameSlug]/decks/[deckId]  → Deck detail
/[gameSlug]/collection      → Collection tracker
/[gameSlug]/analytics       → Meta analytics
/[gameSlug]/templates       → Deck templates

# Non-game-scoped routes (shared)
/auth/*                     → Authentication
/dashboard                  → User dashboard (cross-game)
/profile                    → Profile settings
/admin/*                    → Admin panel
/settings/*                 → User settings
```

**Implementation:** Next.js dynamic route `src/app/[gameSlug]/` with a layout that loads the game context. The existing page components move under this dynamic segment.

### 3. Database Schema Changes

**New tables:**
- `Game` — game definitions with config JSON
- Existing tables get a `gameId` foreign key: `Card`, `Deck`, `Collection`, `Set`, `CardType`, `Rarity`, `DeckCard`, `DeckVersion`

**Card model changes:**
- Keep universal fields: `name`, `cost`, `level`, `type`, `rarity`, `set`, `image`, `description`, `officialText`, `abilities`
- Add `gameId` (required FK to Game)
- Add `gameAttributes` (JSONB) for game-specific fields — replaces hardcoded `faction`, `pilot`, `model`, `series` columns
- Drop or migrate: `faction`, `pilot`, `model`, `series` → move into `gameAttributes`

**Why JSONB for game attributes:** Avoids schema migrations when adding new games. Postgres JSONB is indexable with GIN indexes, so search performance is maintained. Each game defines which attributes exist in its config; the UI renders them dynamically.

**Migration path:** Write a migration that creates the Game table, seeds the Gundam game record, adds `gameId` to existing tables (defaulting to the Gundam game), and migrates `faction`/`pilot`/`model`/`series` into `gameAttributes` JSONB. Non-destructive — existing data is preserved.

### 4. Game Context Provider

A React context (`GameProvider`) wraps all `[gameSlug]` routes. It:
- Loads the game config from the API (cached aggressively via ISR)
- Provides `useGame()` hook to all components
- Drives: card field rendering, deck validation, filter options, branding colors, legal text, export formats
- Falls back to a 404 for invalid game slugs

```typescript
const { game, config, isLoading } = useGame();
// game.name → "Gundam Card Game"
// config.deckRules.minDeckSize → 50
// config.cardSchema.customFields → [{ key: "pilot", ... }]
```

### 5. De-hardcoding Strategy

The codebase has **~150 Gundam-specific references** across source files. These fall into categories:

| Category | Count | Strategy |
|---|---|---|
| UI strings ("Gundam Card Game") | ~50 | Replace with `game.name` from context |
| Metadata (page titles, descriptions) | ~25 | Template: `${pageTitle} \| ${game.name}` |
| Card field references (faction, pilot) | ~20 | Render from `config.cardSchema` |
| Validation rules (deck size, copy limits) | ~10 | Read from `config.deckRules` |
| Legal/copyright text | ~15 | Read from `config.legalDisclaimer` |
| Export strings ("Gundam Card Game Builder") | ~10 | Template with `game.name` |
| Sample/placeholder data | ~15 | Make game-aware or generic |
| Config defaults (DB name, Docker network) | ~5 | Already env vars, leave as-is |

### 6. Landing Page

The root `/` becomes a game selector — a clean grid of supported games with logos, card counts, and descriptions. Clicking a game navigates to `/{gameSlug}/`. This replaces the current Gundam-specific landing page.

The existing landing page content moves to `/gundam/` as the Gundam game home.

### 7. Cross-Game Dashboard

The user dashboard at `/dashboard` shows a unified view:
- Decks across all games, grouped by game
- Collection stats per game
- Recent activity across games

---

## Cost Optimization for Vercel

### Database (Neon Postgres)
- **Free tier:** 0.5 GB storage, 190 compute hours/mo
- **Card data is small.** A full TCG card set (500-2000 cards) is ~2-5 MB of text/JSON data. Three games fit comfortably in free tier.
- **Images stored externally.** Card images go to Vercel Blob or Cloudinary, not the database.
- **Connection pooling.** Already configured with pgbouncer via `DATABASE_URL` / `DIRECT_DATABASE_URL` split.

### Bandwidth (Vercel)
- **Free tier:** 100 GB/mo bandwidth
- **Use `next/image` aggressively.** Automatic WebP/AVIF conversion, responsive sizing, CDN caching. Card images are the #1 bandwidth cost.
- **ISR for card pages.** Card detail pages are rarely-changing content — use Incremental Static Regeneration with 24h revalidation instead of SSR on every request.
- **API route caching.** Card search results can be cached at the edge for popular queries.

### Compute (Vercel)
- **Free tier:** 10s function timeout, 100K invocations/mo
- **Card search is the hot path.** Optimize with DB indexes (already have compound indexes on card attributes) and consider edge caching for common queries.
- **Avoid N+1 queries.** Use Prisma `include` and `select` to batch-load related data.

### Per-Game Cost Impact
- Adding a new game costs ~0 in compute/bandwidth (same infrastructure).
- Storage cost scales linearly with card data (~2-5 MB per game).
- The JSONB approach avoids schema complexity that would add migration overhead.

---

## Phased Implementation

### Phase 1: Multi-Game Foundation (Milestones 1-2)
- Game model + migration + seed Gundam as first game
- Route restructure to `[gameSlug]` pattern
- Game context provider
- De-hardcode ~150 references
- Landing page game selector
- All existing features work under `/gundam/` exactly as before

**Exit criteria:** Existing Gundam functionality is identical, just at `/gundam/cards` instead of `/cards`. No regressions.

### Phase 2: Second Game + Schema Flexibility (Milestone 3)
- Add One Piece TCG game config
- Seed One Piece card data (initial set)
- Validate deck builder works with different deck rules (One Piece has leaders, DON!! cards)
- Collection tracker works per-game
- Cross-game dashboard

**Exit criteria:** Can build and save a One Piece deck with proper validation. Collection is per-game scoped.

### Phase 3: UX Enhancements from Competitors (Milestone 4)
- Custom categories in deck builder (Archidekt-inspired)
- Multiple deck view modes (image grid, text, spreadsheet)
- Collection-aware deck building (shows owned/needed cards)
- Deck comparison tool
- ISR optimization for card pages

### Phase 3.5: Deck Builder Power Features (Milestone 4b — Piltover Archive-inspired)
- **Proxy Generator** — print-ready PDF sheet builder (client-side PDF gen, zero backend cost)
- **Sample Hand Simulator** — randomized opening hand from deck (client-side, zero cost)
- **Deck Visibility Tiers** — Draft/Private/Public (replaces boolean isPublic)
- **Deck Codes** — compact encoded shareable strings for Discord/chat
- **Deck Library Social Metrics** — view count, likes, trending sort
- **Ruleset Modes** — Competitive (strict) vs Casual (freeform) toggle in builder

### Phase 4: Future (Not in this scope)
- Playtester/fishbowl mode
- Tournament results tracking (Egman-inspired)
- Price integration
- Deck collaboration
- Magic: The Gathering as third game
- Community features (comments, ratings, following)

---

## What This Replaces in the Original PRD

| Original PRD Section | Change |
|---|---|
| Introduction/Overview | Now multi-TCG, not Gundam-specific |
| Goals #1 | "most user-friendly **TCG** database" (game-agnostic) |
| Data Management #3 | Per-game data sources, not just gundam-gcg.com |
| Design Considerations | Per-game theming, not "Gundam-inspired aesthetic" |
| Technical Stack | Add Vercel deployment, remove Docker as primary |
| Legal/IP | Per-game copyright notices from game config |
| Success Metrics | Per-game + aggregate metrics |

All other sections (auth, security, code quality, PWA, mobile, testing, etc.) remain unchanged — they're already game-agnostic infrastructure.

---

## Non-Goals

- **Public game submission** — Brian decides which games to add, not users
- **Card data API for third parties** — not in MVP (future monetization opportunity)
- **Automated card data scraping** — manual seed + admin upload for now
- **Cross-game deck building** — decks are scoped to one game
- **Price tracking** — future phase, requires external API integration
- **MTG in Phase 2** — MTG's card pool is massive (30K+ cards), defer until architecture is proven with smaller games
