# Newtype Decks — Project Architecture Skill

## When to use

Apply this skill on ANY task in the newtypedecks repository. It defines the tech stack, project patterns, and architectural rules that every change must follow.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, ISR)
- **Language:** TypeScript (strict mode, path alias `@/*` → `./src/*`)
- **UI:** React 19 + Tailwind CSS 4 (utility-first, CSS variables for theming)
- **State:** Redux Toolkit (slices: auth, cards, decks, collections, ui)
- **ORM:** Prisma 6 with PostgreSQL (Neon for production, Docker for local)
- **Auth:** NextAuth.js (session-based, role-based access: USER, ADMIN, MODERATOR)
- **Testing:** Jest 30 + React Testing Library
- **Caching:** `unstable_cache` (Next.js Data Cache) + ISR + CDN edge headers
- **PDF:** jsPDF (client-side only — zero server cost)
- **Images:** Sharp (server-side resizing) + next/image (delivery + optimization)
- **Deployment:** Vercel primary, Docker/k8s secondary

## Multi-TCG Game Definition System

This is the core architectural pattern. Every TCG game is a `Game` database record with a `config` JSONB column (`GameConfig` type). The config drives everything:

```
Game record → config JSON → drives:
  ├── Card schema (which fields exist, which are JSONB custom fields)
  ├── Deck rules (zones, sizes, copy limits, hand size)
  ├── Card types and rarities
  ├── Keywords
  ├── Legal disclaimers and copyright text
  └── Branding colors
```

### Key files (memorize these paths)

| File                              | Purpose                                                       |
| --------------------------------- | ------------------------------------------------------------- |
| `src/lib/types/game.ts`           | All TypeScript types: Game, GameConfig, DeckRules, CardSchema |
| `src/lib/config/games/*.ts`       | Per-game config files (gundam.ts, onepiece.ts)                |
| `src/contexts/GameContext.tsx`    | React context: `useGame()` hook                               |
| `src/app/[gameSlug]/layout.tsx`   | Server layout — loads game, wraps in GameProvider             |
| `src/app/api/_lib/resolveGame.ts` | API helper: `resolveGameFromRequest()`                        |
| `src/lib/database/games.ts`       | DB utilities: `getGameBySlug()`, `resolveGameId()`            |

### Rules — ALWAYS follow these

1. **Never hardcode game names, card types, rarities, factions, or legal text.** Read from `useGame()` in components or `resolveGameFromRequest()` in API routes.
2. **All API queries for cards/decks/collections must filter by `gameId`.** Use `resolveGameFromRequest()` at the top of every handler.
3. **Game-specific card fields live in `Card.gameAttributes` JSONB**, not in flat columns. Query with Prisma JSON path syntax:
   ```typescript
   where: { gameAttributes: { path: ['color'], equals: 'Red' } }
   ```
4. **Use `DeckVisibility` enum** (DRAFT/PRIVATE/PUBLIC), not the deprecated `isPublic` boolean.
5. **Export filenames use `game.slug`**, not hardcoded 'gundam'.

## URL Structure

```
/                           → Landing page (game selector)
/[gameSlug]/                → Game home
/[gameSlug]/cards           → Card database
/[gameSlug]/decks           → Public deck library
/[gameSlug]/decks/create    → Deck builder
/[gameSlug]/collection      → Collection tracker
/[gameSlug]/proxies         → Proxy generator
/admin/*                    → Admin panel (not game-scoped)
/dashboard                  → Cross-game user dashboard
/auth/*                     → Auth pages (not game-scoped)
```

## API Route Pattern

Every API route follows this exact pattern:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

export async function GET(request: NextRequest) {
  try {
    // 1. Resolve game from ?gameSlug= query param
    const gameResult = await resolveGameFromRequest(request);
    if (gameResult instanceof NextResponse) return gameResult;
    const { gameId } = gameResult;

    // 2. Auth check (if needed)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    }

    // 3. Business logic with gameId in every Prisma query
    const data = await prisma.card.findMany({
      where: { gameId, ...otherFilters },
    });

    // 4. Return response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## Component Pattern

```typescript
'use client';
import { useGame } from '@/contexts/GameContext';

export function MyComponent() {
  const { game, config } = useGame();
  // game.name → "Gundam Card Game"
  // config.deckRules.minDeckSize → 50
  // config.cardSchema.customFields → [{ key: "faction", ... }]
}
```

## Database Schema Key Models

- **Game** — defines a TCG with config JSONB
- **Card** — universal fields + `gameAttributes` JSONB + `gameId` FK
- **Deck** — `visibility` enum (DRAFT/PRIVATE/PUBLIC), `deckCode`, `viewCount`, `likeCount`, `gameId` FK
- **Collection** — per-user per-game, `gameId` FK
- **DeckLike** — join table for social metrics
- **CardType, Rarity, Set** — all scoped by `gameId`

## CSS Theme

Dark purple theme using CSS variables in `globals.css`:

```css
--bg-primary: #1a1625;
--bg-secondary: #2a1f3d;
--bg-card: #2d2640;
--border-primary: #443a5c;
--accent-primary: #6b5a8a;
--text-primary: #ffffff;
--text-secondary: #9ca3af;
```

Use these variables via Tailwind arbitrary values: `bg-[var(--bg-card)]` or direct CSS.

## File Size and Quality Rules

- Refactor files over 200-300 lines
- Extract helper functions into `/helpers.ts` or `/utils.ts` alongside the route
- Extract React sub-components when complexity > 15
- Run `npm run check` (type-check + lint + test) before every commit
- No `console.log` — use `console.warn` or `console.error`
- No `any` types — use `unknown` with type narrowing

## Testing Pattern

```typescript
// Mock game resolution for API tests
jest.mock('@/app/api/_lib/resolveGame', () => ({
  resolveGameFromRequest: jest.fn().mockResolvedValue({
    gameId: 'test-game-id',
    gameName: 'Test Game',
    game: { id: 'test-game-id', slug: 'test', config: {} },
  }),
}));
```
