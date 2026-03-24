# Newtype Decks — Database & Prisma Skill

## When to use

Apply when modifying the Prisma schema, writing migrations, optimizing queries, or working with the database layer.

## Schema Location

`prisma/schema.prisma` — single schema file, PostgreSQL provider.

## Connection Setup

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Pooled (pgbouncer) — runtime queries
  directUrl = env("DIRECT_DATABASE_URL") // Direct — migrations only
}
```

**Local:** Docker PostgreSQL via `npm run docker:dev`
**Production:** Neon Postgres on Vercel

## Key Models and Their Relationships

```
Game (1) ──── (*) Card
  │              ├── gameAttributes: Json (JSONB — game-specific fields)
  │              ├── type → CardType (scoped by gameId)
  │              ├── rarity → Rarity (scoped by gameId)
  │              └── set → Set (scoped by gameId)
  │
  ├──── (*) Deck
  │          ├── visibility: DeckVisibility (DRAFT/PRIVATE/PUBLIC)
  │          ├── deckCode: String? (unique, for sharing)
  │          ├── viewCount, likeCount (social metrics)
  │          ├── cards → DeckCard[]
  │          ├── versions → DeckVersion[]
  │          ├── likes → DeckLike[]
  │          └── favoritedBy → UserFavoriteDeck[]
  │
  └──── (*) Collection (one per user per game)
              └── cards → CollectionCard[]
```

## JSONB Patterns

### Writing game attributes

```typescript
await prisma.card.create({
  data: {
    name: 'Monkey D. Luffy',
    cost: 5,
    gameId: onepieceGameId,
    gameAttributes: {
      color: ['Red'],
      power: 6000,
      counter: '+1000',
      life: 4,
      attribute: 'Strike',
      trait: ['Straw Hat Crew', 'Supernovas'],
    },
    // ... other fields
  },
});
```

### Querying JSONB fields

```typescript
// Exact match on a string field
where: {
  gameAttributes: {
    path: ['faction'],
    equals: 'Earth Federation',
  },
}

// Text search (contains)
where: {
  gameAttributes: {
    path: ['pilot'],
    string_contains: 'Amuro',
  },
}

// Numeric comparison
where: {
  gameAttributes: {
    path: ['power'],
    gte: 5000,
  },
}

// Array contains (for multi-select fields)
where: {
  gameAttributes: {
    path: ['color'],
    array_contains: ['Red'],
  },
}
```

### Selecting JSONB fields

Prisma returns the entire `gameAttributes` object. Parse it in the application layer:

```typescript
const card = await prisma.card.findUnique({ where: { id } });
const attrs = card.gameAttributes as Record<string, unknown>;
const faction = attrs.faction as string | undefined;
```

## Migration Patterns

### Creating migrations

```bash
npx prisma migrate dev --name descriptive_name
```

### Production migration (Vercel)

```bash
npx prisma migrate deploy  # Runs via DIRECT_DATABASE_URL
```

### Adding a column safely

1. Add as optional (`String?`) first
2. Deploy + backfill existing data
3. Make required in a second migration if needed

### Backfill pattern

```sql
-- In a migration SQL or standalone script
UPDATE "cards" SET "gameId" = 'gundam-game-id' WHERE "gameId" IS NULL;
```

### Adding a new enum value

```prisma
enum DeckVisibility {
  DRAFT
  PRIVATE
  PUBLIC
  UNLISTED  // ← new value
}
```

Then `npx prisma migrate dev --name add_unlisted_visibility`

## Index Strategy

### Current compound indexes (Card)

```prisma
@@index([gameId])
@@index([gameId, name])
@@index([gameId, typeId])
@@index([gameId, cost])
@@index([gameId, level])
```

### When to add indexes

- Any field used in `WHERE` clauses frequently
- Any field used in `ORDER BY`
- Compound indexes for common filter combinations
- GIN index for JSONB: `@@index([gameAttributes], type: Gin)` if JSON path queries become slow

### Query performance rules

1. Always use `select` or `include` — never fetch entire rows when you only need a few fields
2. Use `take` + `skip` for pagination, never fetch all rows
3. Batch operations: `createMany`, `updateMany` instead of loops
4. Avoid N+1: use `include` to eager-load relations in one query
5. For count-heavy pages: `prisma.$queryRaw` with a single COUNT query instead of multiple `count()` calls

## Prisma Client Singleton

```typescript
// src/lib/database/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Always import from `@/lib/database`**, never create a new PrismaClient instance.

## Deprecated Columns (DO NOT USE in new code)

These flat columns on `Card` are deprecated — read from `gameAttributes` JSONB instead:

- `faction` → `gameAttributes.faction`
- `pilot` → `gameAttributes.pilot`
- `model` → `gameAttributes.model`
- `series` → `gameAttributes.series`
- `nation` → `gameAttributes.nation`

They still exist in the schema for backward compatibility but will be dropped in a future migration.
