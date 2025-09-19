# Database Documentation

This document describes the database schema, relationships, and data management for the Gundam Card Game website.

## Overview

The application uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access. The database is designed to support:

- Card database management
- User authentication and profiles
- Deck building and management
- Collection tracking
- File storage metadata

## Database Schema

### Core Entities

#### Users
User accounts and authentication information.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  decks       Deck[]
  collections Collection[]

  @@map("users")
}
```

**Fields:**
- `id` - Unique identifier (CUID)
- `email` - User email address (unique)
- `name` - Display name
- `image` - Profile image URL
- `role` - User role (USER, ADMIN)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### Card Types
Categories for different types of cards.

```prisma
model CardType {
  id          String  @id @default(cuid())
  name        String  @unique
  description String?

  // Relationships
  cards Card[]

  @@map("card_types")
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Type name (Mobile Suit, Character, etc.)
- `description` - Optional description

#### Rarities
Card rarity levels with visual indicators.

```prisma
model Rarity {
  id          String  @id @default(cuid())
  name        String  @unique
  color       String
  description String?

  // Relationships
  cards Card[]

  @@map("rarities")
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Rarity name (Common, Rare, etc.)
- `color` - Hex color code for visual representation
- `description` - Optional description

#### Sets
Card sets and expansions.

```prisma
model Set {
  id          String    @id @default(cuid())
  name        String    @unique
  code        String    @unique
  releaseDate DateTime
  description String?
  imageUrl    String?

  // Relationships
  cards Card[]

  @@map("sets")
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Set name
- `code` - Set code (ST01, ST02, etc.)
- `releaseDate` - Official release date
- `description` - Optional description
- `imageUrl` - Set image URL

#### Cards
Individual card records with all metadata.

```prisma
model Card {
  id            String   @id @default(cuid())
  name          String
  level         Int?
  cost          Int?
  typeId        String
  rarityId      String
  setId         String
  setNumber     String
  imageUrl      String?
  imageUrlSmall String?
  imageUrlLarge String?
  description   String?
  rulings       String?
  officialText  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relationships
  type           CardType       @relation(fields: [typeId], references: [id])
  rarity         Rarity         @relation(fields: [rarityId], references: [id])
  set            Set            @relation(fields: [setId], references: [id])
  deckCards      DeckCard[]
  collectionCards CollectionCard[]

  @@unique([setId, setNumber])
  @@map("cards")
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Card name
- `level` - Card level (optional)
- `cost` - Card cost (optional)
- `typeId` - Reference to CardType
- `rarityId` - Reference to Rarity
- `setId` - Reference to Set
- `setNumber` - Card number within set
- `imageUrl` - Main card image URL
- `imageUrlSmall` - Thumbnail image URL
- `imageUrlLarge` - High-resolution image URL
- `description` - Card description
- `rulings` - Official rulings text
- `officialText` - Card effect text
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Decks
User-created decks for gameplay.

```prisma
model Deck {
  id          String   @id @default(cuid())
  name        String
  description String?
  isPublic    Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  user     User      @relation(fields: [userId], references: [id])
  deckCards DeckCard[]

  @@map("decks")
}
```

**Fields:**
- `id` - Unique identifier
- `name` - Deck name
- `description` - Optional description
- `isPublic` - Whether deck is publicly visible
- `userId` - Reference to User
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Deck Cards
Junction table for cards in decks.

```prisma
model DeckCard {
  id       String @id @default(cuid())
  deckId   String
  cardId   String
  quantity Int    @default(1)

  // Relationships
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id])

  @@unique([deckId, cardId])
  @@map("deck_cards")
}
```

**Fields:**
- `id` - Unique identifier
- `deckId` - Reference to Deck
- `cardId` - Reference to Card
- `quantity` - Number of copies in deck

#### Collections
User card collections for tracking owned cards.

```prisma
model Collection {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  user  User            @relation(fields: [userId], references: [id])
  collectionCards CollectionCard[]

  @@map("collections")
}
```

**Fields:**
- `id` - Unique identifier
- `userId` - Reference to User (one-to-one)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

#### Collection Cards
Junction table for cards in collections.

```prisma
model CollectionCard {
  id           String @id @default(cuid())
  collectionId String
  cardId       String
  quantity     Int    @default(1)

  // Relationships
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  card       Card       @relation(fields: [cardId], references: [id])

  @@unique([collectionId, cardId])
  @@map("collection_cards")
}
```

**Fields:**
- `id` - Unique identifier
- `collectionId` - Reference to Collection
- `cardId` - Reference to Card
- `quantity` - Number of copies owned

### Enums

#### UserRole
User permission levels.

```prisma
enum UserRole {
  USER
  ADMIN
}
```

## Database Relationships

### Entity Relationship Diagram

```
User (1) ──── (N) Deck
User (1) ──── (1) Collection

Deck (1) ──── (N) DeckCard (N) ──── (1) Card
Collection (1) ──── (N) CollectionCard (N) ──── (1) Card

Card (N) ──── (1) CardType
Card (N) ──── (1) Rarity
Card (N) ──── (1) Set
```

### Relationship Details

1. **User → Decks**: One-to-many
   - A user can have multiple decks
   - Each deck belongs to one user

2. **User → Collection**: One-to-one
   - Each user has exactly one collection
   - Each collection belongs to one user

3. **Deck → Cards**: Many-to-many (via DeckCard)
   - A deck can contain multiple cards
   - A card can be in multiple decks
   - Junction table tracks quantity

4. **Collection → Cards**: Many-to-many (via CollectionCard)
   - A collection can contain multiple cards
   - A card can be in multiple collections
   - Junction table tracks quantity owned

5. **Card → CardType**: Many-to-one
   - Multiple cards can have the same type
   - Each card has exactly one type

6. **Card → Rarity**: Many-to-one
   - Multiple cards can have the same rarity
   - Each card has exactly one rarity

7. **Card → Set**: Many-to-one
   - Multiple cards can be in the same set
   - Each card belongs to exactly one set

## Database Operations

### Prisma Client Usage

```typescript
import { prisma } from '@/lib/database';

// Get all cards with relationships
const cards = await prisma.card.findMany({
  include: {
    type: true,
    rarity: true,
    set: true,
  },
});

// Get user's collection with cards
const collection = await prisma.collection.findUnique({
  where: { userId: 'user-id' },
  include: {
    collectionCards: {
      include: {
        card: {
          include: {
            type: true,
            rarity: true,
            set: true,
          },
        },
      },
    },
  },
});

// Create a new deck
const deck = await prisma.deck.create({
  data: {
    name: 'My Gundam Deck',
    description: 'A powerful deck',
    userId: 'user-id',
    deckCards: {
      create: [
        { cardId: 'card-1', quantity: 2 },
        { cardId: 'card-2', quantity: 1 },
      ],
    },
  },
});
```

### Common Queries

#### Card Search and Filtering
```typescript
// Search cards by name
const searchResults = await prisma.card.findMany({
  where: {
    name: {
      contains: searchQuery,
      mode: 'insensitive',
    },
  },
  include: {
    type: true,
    rarity: true,
    set: true,
  },
});

// Filter cards by type and rarity
const filteredCards = await prisma.card.findMany({
  where: {
    typeId: 'type-mobile-suit',
    rarityId: 'rarity-rare',
  },
  include: {
    type: true,
    rarity: true,
    set: true,
  },
});
```

#### Deck Management
```typescript
// Get user's decks with card counts
const userDecks = await prisma.deck.findMany({
  where: { userId: 'user-id' },
  include: {
    deckCards: {
      include: {
        card: true,
      },
    },
  },
});

// Calculate deck statistics
const deckStats = await prisma.deckCard.groupBy({
  by: ['deckId'],
  where: { deckId: 'deck-id' },
  _sum: { quantity: true },
  _count: { cardId: true },
});
```

#### Collection Management
```typescript
// Get collection with statistics
const collection = await prisma.collection.findUnique({
  where: { userId: 'user-id' },
  include: {
    collectionCards: {
      include: {
        card: {
          include: {
            type: true,
            rarity: true,
          },
        },
      },
    },
  },
});

// Calculate collection statistics
const stats = await prisma.collectionCard.aggregate({
  where: { collectionId: 'collection-id' },
  _sum: { quantity: true },
  _count: { cardId: true },
});
```

## Database Migrations

### Creating Migrations

```bash
# Create a new migration
npm run db:migrate

# Deploy migrations to production
npm run db:migrate:deploy

# Reset database (development only)
npm run db:reset
```

### Migration Best Practices

1. **Always backup production data** before running migrations
2. **Test migrations** on a copy of production data
3. **Use transactions** for complex migrations
4. **Add indexes** for frequently queried fields
5. **Consider data migration** for schema changes

### Example Migration

```sql
-- Migration: Add card search index
CREATE INDEX CONCURRENTLY idx_cards_name_search 
ON cards USING gin(to_tsvector('english', name));

-- Migration: Add deck statistics
ALTER TABLE decks ADD COLUMN card_count INTEGER DEFAULT 0;
ALTER TABLE decks ADD COLUMN total_cost INTEGER DEFAULT 0;
```

## Database Indexing

### Recommended Indexes

```sql
-- Card search optimization
CREATE INDEX idx_cards_name ON cards(name);
CREATE INDEX idx_cards_set_number ON cards(set_id, set_number);
CREATE INDEX idx_cards_type_rarity ON cards(type_id, rarity_id);

-- Deck optimization
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_public ON decks(is_public) WHERE is_public = true;

-- Collection optimization
CREATE INDEX idx_collection_cards_collection_id ON collection_cards(collection_id);
CREATE INDEX idx_deck_cards_deck_id ON deck_cards(deck_id);

-- Full-text search
CREATE INDEX idx_cards_search ON cards USING gin(to_tsvector('english', name || ' ' || description));
```

### Query Optimization

```typescript
// Use select to limit fields
const cards = await prisma.card.findMany({
  select: {
    id: true,
    name: true,
    imageUrl: true,
    type: { select: { name: true } },
    rarity: { select: { name: true, color: true } },
  },
});

// Use pagination for large datasets
const cards = await prisma.card.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { name: 'asc' },
});

// Use raw queries for complex operations
const stats = await prisma.$queryRaw`
  SELECT 
    c.type_id,
    ct.name as type_name,
    COUNT(*) as card_count,
    AVG(c.cost) as avg_cost
  FROM cards c
  JOIN card_types ct ON c.type_id = ct.id
  GROUP BY c.type_id, ct.name
  ORDER BY card_count DESC
`;
```

## Data Seeding

### Seed Data Structure

The database is seeded with initial data for development:

```typescript
// Card Types
const cardTypes = [
  { id: 'type-mobile-suit', name: 'Mobile Suit' },
  { id: 'type-character', name: 'Character' },
  { id: 'type-command', name: 'Command' },
  { id: 'type-event', name: 'Event' },
  { id: 'type-upgrade', name: 'Upgrade' },
];

// Rarities
const rarities = [
  { id: 'rarity-common', name: 'Common', color: '#9CA3AF' },
  { id: 'rarity-uncommon', name: 'Uncommon', color: '#3B82F6' },
  { id: 'rarity-rare', name: 'Rare', color: '#8B5CF6' },
  { id: 'rarity-epic', name: 'Epic', color: '#F59E0B' },
  { id: 'rarity-legendary', name: 'Legendary', color: '#EF4444' },
];

// Sample Sets
const sets = [
  {
    id: 'set-01',
    name: 'Awakening of the New Era',
    code: 'ST01',
    releaseDate: new Date('2024-01-01'),
  },
];
```

### Running Seeds

```bash
# Seed the database
npm run db:seed

# Reset and seed
npm run db:reset
npm run db:seed
```

## Database Security

### Access Control

1. **User Authentication** - All user data is protected by authentication
2. **Role-based Access** - Admin users have additional permissions
3. **Data Isolation** - Users can only access their own data
4. **Input Validation** - All inputs are validated before database operations

### Data Protection

1. **Encryption** - Sensitive data is encrypted at rest
2. **Backups** - Regular automated backups
3. **Audit Logging** - Track all database changes
4. **Connection Security** - SSL/TLS for all connections

### Performance Monitoring

1. **Query Performance** - Monitor slow queries
2. **Connection Pooling** - Efficient connection management
3. **Index Usage** - Monitor index effectiveness
4. **Resource Usage** - Track CPU, memory, and disk usage

## Backup and Recovery

### Backup Strategy

```bash
# Create database backup
pg_dump -h localhost -U gundam_user -d gundam_card_game > backup.sql

# Restore from backup
psql -h localhost -U gundam_user -d gundam_card_game < backup.sql
```

### Recovery Procedures

1. **Point-in-time Recovery** - Restore to specific timestamp
2. **Data Corruption Recovery** - Repair corrupted data
3. **Disaster Recovery** - Full system restoration
4. **Testing Recovery** - Regular recovery testing

## Monitoring and Maintenance

### Health Checks

```typescript
// Database health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

### Maintenance Tasks

1. **Vacuum and Analyze** - Regular database maintenance
2. **Index Rebuilding** - Optimize index performance
3. **Statistics Updates** - Keep query planner statistics current
4. **Log Rotation** - Manage database logs

### Performance Tuning

1. **Query Optimization** - Analyze and optimize slow queries
2. **Index Tuning** - Add or remove indexes as needed
3. **Connection Pooling** - Optimize connection settings
4. **Memory Configuration** - Tune PostgreSQL memory settings
