# Newtype Decks — API Route Development Skill

## When to use

Apply when creating, modifying, or debugging any API route in `src/app/api/`.

## Route Architecture

### Directory structure

```
src/app/api/
├── _lib/resolveGame.ts     ← Shared game resolution (import in EVERY game-scoped route)
├── cards/
│   ├── route.ts            ← GET (list), POST (create — admin)
│   ├── helpers.ts           ← Filter parsing, validation helpers
│   ├── search/
│   │   ├── route.ts        ← POST (search with filters), GET (simple search)
│   │   └── helpers/        ← Sanitizers, validators, metadata builders
│   └── [id]/route.ts       ← GET, PUT, DELETE single card
├── decks/
│   ├── route.ts            ← GET (user's decks), POST (create)
│   ├── public/route.ts     ← GET (public deck library)
│   ├── by-code/route.ts    ← GET (resolve deck code)
│   └── [id]/
│       ├── route.ts        ← GET, PUT, DELETE single deck
│       ├── like/route.ts   ← POST (toggle like)
│       ├── view/route.ts   ← POST (increment view count)
│       └── versions/       ← Deck version history
├── collections/            ← Per-user per-game collection
├── favorites/              ← User favorite decks
├── templates/              ← Deck templates
├── reference/              ← Sets, types, rarities (read-only)
├── admin/                  ← Admin-only routes (games, users, stats)
└── auth/                   ← NextAuth + custom auth routes
```

### Game resolution — MANDATORY for all game-scoped routes

```typescript
import { resolveGameFromRequest } from '@/app/api/_lib/resolveGame';

// At the top of every handler:
const gameResult = await resolveGameFromRequest(request);
if (gameResult instanceof NextResponse) return gameResult;
const { gameId, game } = gameResult;

// Then use gameId in every Prisma query:
await prisma.card.findMany({ where: { gameId } });
```

For deck sub-routes (`/api/decks/[id]/*`), resolve game from the deck itself:

```typescript
const deck = await prisma.deck.findUnique({ where: { id: deckId } });
if (!deck) return NextResponse.json({ error: 'Not found' }, { status: 404 });
const gameId = deck.gameId; // Game comes from the deck, not the query string
```

### Auth patterns

```typescript
// Public route — no auth check
export async function GET(request: NextRequest) { ... }

// Authenticated route
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
}

// Admin route
import { requireAdmin } from '@/middleware/adminAuth';

const authError = await requireAdmin();
if (authError) return authError;
```

### Response patterns

```typescript
// Success
return NextResponse.json({ success: true, data: result }, { status: 200 });

// Success with pagination
return NextResponse.json({
  success: true,
  data: items,
  pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
});

// Error
return NextResponse.json({ error: 'Descriptive message' }, { status: 400 });

// Cached response (read-only endpoints)
return NextResponse.json(data, {
  status: 200,
  headers: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
});
```

### Caching pattern (card search)

```typescript
import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

// Wrap read operations
const cachedSearch = unstable_cache(
  (filters, options) => CardService.searchCards(filters, options),
  ['cards-search'],
  { tags: ['cards'], revalidate: 300 }
);

// Bust on mutations
export async function POST(request: NextRequest) {
  // ... create/update card ...
  revalidateTag('cards', {});
}
```

### gameAttributes JSONB queries

Game-specific card fields live in `Card.gameAttributes` JSONB. Query with Prisma JSON path:

```typescript
// Exact match
where: { gameAttributes: { path: ['faction'], equals: 'Earth Federation' } }

// Contains (text search)
where: { gameAttributes: { path: ['pilot'], string_contains: 'Amuro' } }

// Array contains (for multi-select fields like One Piece colors)
where: { gameAttributes: { path: ['color'], array_contains: ['Red'] } }

// Numeric comparison
where: { gameAttributes: { path: ['power'], gte: 5000 } }
```

### Helper extraction pattern

When a route handler exceeds ~50 lines, extract helpers:

```
src/app/api/cards/
├── route.ts           ← Thin handler: parse → validate → execute → respond
├── helpers.ts         ← parseFilterParams(), buildWhereClause(), etc.
└── helpers/           ← For complex routes, use a directory
    ├── filterSanitizers.ts
    ├── validators.ts
    └── responseBuilders.ts
```

### Deck visibility rules

```typescript
// Public library — only PUBLIC decks
where: {
  visibility: ('PUBLIC', gameId);
}

// User's own decks — all visibilities
where: {
  userId: (session.user.id, gameId);
}

// Shared by link — PRIVATE or PUBLIC
const deck = await prisma.deck.findUnique({ where: { id } });
if (deck.visibility === 'DRAFT' && deck.userId !== session?.user?.id) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
```

## Testing API Routes

```typescript
import { NextRequest } from 'next/server';

// Mock game resolution
jest.mock('@/app/api/_lib/resolveGame', () => ({
  resolveGameFromRequest: jest.fn().mockResolvedValue({
    gameId: 'test-game-id',
    gameName: 'Test',
    game: { id: 'test-game-id' },
  }),
}));

// Mock Prisma
jest.mock('@/lib/database', () => ({
  prisma: {
    card: { findMany: jest.fn(), count: jest.fn() },
  },
}));

// Build test request
const request = new NextRequest(
  'http://localhost:3000/api/cards?gameSlug=gundam'
);
```
