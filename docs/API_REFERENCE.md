# API & Database Reference

> Complete technical reference for API endpoints, database schema, and data operations

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
   - [Base URL](#base-url)
   - [Authentication](#authentication)
   - [Response Formats](#response-formats)
   - [Health Check](#health-check)
   - [Cards API](#cards-api)
   - [Decks API](#decks-api)
   - [Collections API](#collections-api)
   - [Authentication API](#authentication-api)
   - [File Upload API](#file-upload-api)
   - [Error Codes](#error-codes)
   - [Rate Limiting](#rate-limiting)
   - [Pagination](#pagination)
   - [Filtering and Sorting](#filtering-and-sorting)
2. [Database Schema](#database-schema)
   - [Overview](#schema-overview)
   - [Core Models](#core-models)
   - [Game Organization Models](#game-organization-models)
   - [Deck Building Models](#deck-building-models)
   - [Collection Management Models](#collection-management-models)
   - [Rules and Clarifications](#rules-and-clarifications)
   - [Database Indexes](#database-indexes)
   - [Data Relationships](#data-relationships)
3. [Database Operations](#database-operations)
   - [Prisma Client Usage](#prisma-client-usage)
   - [Common Queries](#common-queries)
   - [Query Optimization](#query-optimization)
   - [Database Migrations](#database-migrations)
4. [Data Validation & Security](#data-validation--security)
   - [Data Validation Rules](#data-validation-rules)
   - [Database Security](#database-security)
   - [Access Control](#access-control)
   - [Performance Monitoring](#performance-monitoring)

---

## REST API Endpoints

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication

Most endpoints require authentication. Include the session cookie or JWT token in requests.

### Response Formats

All API responses follow a consistent format:

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Health Check

#### GET /api/health
Check the health status of the application.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Cards API

#### GET /api/cards
Get a list of cards with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search query
- `type` (string, optional): Filter by card type
- `rarity` (string, optional): Filter by rarity
- `set` (string, optional): Filter by set
- `sort` (string, optional): Sort by field (name, level, cost, createdAt)
- `order` (string, optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "card-001",
      "name": "RX-78-2 Gundam",
      "level": 3,
      "cost": 2,
      "type": "Mobile Suit",
      "rarity": "Rare",
      "set": "Awakening of the New Era",
      "setNumber": "ST01-001",
      "imageUrl": "/images/cards/ST01-001.jpg",
      "description": "The legendary RX-78-2 Gundam"
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/cards/[id]
Get a specific card by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "card-001",
    "name": "RX-78-2 Gundam",
    "level": 3,
    "cost": 2,
    "type": "Mobile Suit",
    "rarity": "Rare",
    "set": "Awakening of the New Era",
    "setNumber": "ST01-001",
    "imageUrl": "/images/cards/ST01-001.jpg",
    "imageUrlSmall": "/images/cards/ST01-001_small.jpg",
    "imageUrlLarge": "/images/cards/ST01-001_large.jpg",
    "description": "The legendary RX-78-2 Gundam",
    "rulings": "Official rulings text",
    "officialText": "When this unit is deployed, draw 1 card.",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/cards
Create a new card (Admin only).

**Request Body:**
```json
{
  "name": "New Card",
  "level": 2,
  "cost": 1,
  "typeId": "type-mobile-suit",
  "rarityId": "rarity-common",
  "setId": "set-01",
  "setNumber": "ST01-999",
  "description": "Card description",
  "officialText": "Card effect text"
}
```

#### PUT /api/cards/[id]
Update a card (Admin only).

**Request Body:** Same as POST

#### DELETE /api/cards/[id]
Delete a card (Admin only).

### Decks API

#### GET /api/decks
Get a list of decks with pagination and filtering.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page
- `search` (string, optional): Search query
- `public` (boolean, optional): Filter public decks
- `userId` (string, optional): Filter by user
- `sort` (string, optional): Sort by field (name, createdAt, updatedAt)
- `order` (string, optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "deck-001",
      "name": "Gundam Deck",
      "description": "A powerful Gundam deck",
      "isPublic": true,
      "userId": "user-001",
      "cards": [
        {
          "cardId": "card-001",
          "quantity": 2
        }
      ],
      "statistics": {
        "totalCards": 50,
        "uniqueCards": 25,
        "averageCost": 2.5
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/decks/[id]
Get a specific deck by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deck-001",
    "name": "Gundam Deck",
    "description": "A powerful Gundam deck",
    "isPublic": true,
    "userId": "user-001",
    "cards": [
      {
        "card": {
          "id": "card-001",
          "name": "RX-78-2 Gundam",
          "imageUrl": "/images/cards/ST01-001.jpg"
        },
        "quantity": 2
      }
    ],
    "statistics": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/decks
Create a new deck.

**Request Body:**
```json
{
  "name": "My New Deck",
  "description": "Deck description",
  "isPublic": false,
  "cards": [
    {
      "cardId": "card-001",
      "quantity": 2
    }
  ]
}
```

#### PUT /api/decks/[id]
Update a deck.

**Request Body:** Same as POST

#### DELETE /api/decks/[id]
Delete a deck.

### Collections API

#### GET /api/collections
Get user's collection.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "collection-001",
    "userId": "user-001",
    "cards": [
      {
        "card": {
          "id": "card-001",
          "name": "RX-78-2 Gundam",
          "imageUrl": "/images/cards/ST01-001.jpg"
        },
        "quantity": 3
      }
    ],
    "statistics": {
      "totalCards": 150,
      "uniqueCards": 75,
      "completionPercentage": 45.5
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/collections
Add cards to collection.

**Request Body:**
```json
{
  "cards": [
    {
      "cardId": "card-001",
      "quantity": 2
    }
  ]
}
```

#### GET /api/collections/[cardId]
Get collection entry for a specific card.

**Query Parameters:**
- `userId` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "collection-card-001",
    "collectionId": "collection-001",
    "cardId": "card-001",
    "quantity": 3,
    "card": {
      "id": "card-001",
      "name": "RX-78-2 Gundam",
      "imageUrl": "/images/cards/ST01-001.jpg"
    }
  }
}
```

#### PUT /api/collections/[cardId]
Update quantity of a card in collection.

**Request Body:**
```json
{
  "quantity": 5
}
```

#### DELETE /api/collections/[cardId]
Remove card from collection.

### Authentication API

#### POST /api/auth/login
User login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-001",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "jwt-token"
  }
}
```

#### POST /api/auth/register
User registration.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:** Same as login

#### POST /api/auth/logout
User logout.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/me
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/auth/me
Update current user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

### File Upload API

#### POST /api/upload/card-image
Upload card image.

**Request:** Multipart form data with `image` field

**Response:**
```json
{
  "success": true,
  "data": {
    "original": "/uploads/cards/original/card-123.jpg",
    "thumbnail": "/uploads/cards/thumbnails/card-123-thumb.jpg",
    "large": "/uploads/cards/large/card-123-large.jpg",
    "metadata": {
      "width": 800,
      "height": 600,
      "format": "jpeg",
      "size": 125000
    }
  }
}
```

### Error Codes

#### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

#### Common Error Types
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication required
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

### Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Default**: 100 requests per 15 minutes
- **Authentication**: 10 requests per minute
- **File Upload**: 5 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Pagination

List endpoints support pagination with the following parameters:
- `page` - Page number (1-based)
- `limit` - Items per page (max 100)

Pagination information is included in the response:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filtering and Sorting

#### Cards
- `search` - Search in name and description
- `type` - Filter by card type
- `rarity` - Filter by rarity
- `set` - Filter by set
- `sort` - Sort by field (name, level, cost, createdAt)
- `order` - Sort order (asc, desc)

#### Decks
- `search` - Search in name and description
- `public` - Filter public/private decks
- `userId` - Filter by user
- `sort` - Sort by field (name, createdAt, updatedAt)
- `order` - Sort order (asc, desc)

---

## Database Schema

### Schema Overview

The database schema is designed with the following principles:
- **Normalization**: Proper relational structure to avoid data duplication
- **Flexibility**: Support for various card types and game mechanics
- **Performance**: Optimized indexes for common queries
- **Extensibility**: Easy to add new features and card attributes
- **Data Integrity**: Foreign key constraints and validation rules

The application uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access.

### Core Models

#### User
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
- `role` - User role (USER, ADMIN, MODERATOR)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

**UserRole Enum:**
```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR
}
```

#### Card
Individual card records with comprehensive game attributes.

```prisma
model Card {
  id           String   @id @default(cuid())
  name         String
  level        Int?
  cost         Int?
  typeId       String
  rarityId     String
  setId        String
  setNumber    String
  imageUrl     String
  imageUrlSmall String?
  imageUrlLarge String?
  description  String?
  rulings      String?
  officialText String?

  // Official Gundam Card Game attributes
  clashPoints  Int?     // Clash Points (CP) - battle strength
  price        Int?     // Price - cost to play the card
  hitPoints    Int?     // Hit Points (HP) - unit durability
  attackPoints Int?     // Attack Points (AP) - damage dealt
  faction      String?  // Faction/Group (Earth Federation, Zeon, etc.)
  pilot        String?  // Pilot name for mobile suits
  model        String?  // Mobile suit model number
  series       String?  // Anime series (UC, CE, AD, etc.)
  nation       String?  // Nation/Country affiliation

  // Card mechanics
  abilities    String?  // Special abilities (JSON string)
  keywords     String[] // Searchable keywords
  tags         String[] // Categorization tags

  // Metadata
  isFoil       Boolean  @default(false)
  isPromo      Boolean  @default(false)
  isAlternate  Boolean  @default(false)
  language     String   @default("en")

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relationships
  type           CardType         @relation(fields: [typeId], references: [id])
  rarity         Rarity           @relation(fields: [rarityId], references: [id])
  set            Set              @relation(fields: [setId], references: [id])
  deckCards      DeckCard[]
  collectionCards CollectionCard[]

  @@unique([setId, setNumber])
  @@index([name])
  @@index([faction])
  @@index([series])
  @@index([keywords])
  @@map("cards")
}
```

**Key Features:**
- Flexible game mechanics support
- Multiple image sizes for different use cases
- Searchable keywords and tags
- Support for special card variants (foil, promo, alternate)
- Multilingual support
- Performance indexes on commonly queried fields

#### CardType
Categories for different types of cards.

```prisma
model CardType {
  id          String  @id @default(cuid())
  name        String  @unique
  description String?
  category    String? // e.g., "Unit", "Pilot", "Command", "Event", "Support"

  // Relationships
  cards Card[]

  @@map("card_types")
}
```

**Official Categories:**
- **Unit**: Mobile Suits, Mobile Armors, Cruisers, Colonies - primary combat units
- **Character**: Pilots and crew members that enhance unit capabilities
- **Command**: Specific effects, often representing scenes from the anime (discarded after use)
- **Operation**: Ongoing effects that remain in play to influence game state
- **Generation**: Resource cards that produce "Nation Power" to play other cards

#### Rarity
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

**Common Rarities:**
- Common (Gray)
- Uncommon (Green)
- Rare (Blue)
- Epic (Purple)
- Legendary (Gold)
- Mythic (Red)

#### Set
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

### Game Organization Models

#### Faction
Faction-based card organization.

```prisma
model Faction {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  color       String? // Hex color for UI
  imageUrl    String?

  // Relationships
  cards Card[]
}
```

**Common Factions:**
- Earth Federation
- Principality of Zeon
- AEUG (Anti-Earth Union Group)
- Titans
- Crossbone Vanguard
- ZAFT
- Orb Union

#### Series
Gundam series organization.

```prisma
model Series {
  id          String @id @default(cuid())
  name        String @unique
  code        String @unique // e.g., "UC", "CE", "AD"
  description String?
  imageUrl    String?

  // Relationships
  cards Card[]
}
```

**Common Series:**
- **UC** (Universal Century): Original timeline
- **CE** (Cosmic Era): Gundam SEED
- **AD** (Anno Domini): Gundam 00
- **AC** (After Colony): Gundam Wing
- **FC** (Future Century): G Gundam

### Deck Building Models

#### Deck
User-created deck collections.

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
  user      User       @relation(fields: [userId], references: [id])
  deckCards DeckCard[]

  @@map("decks")
}
```

**Features:**
- Public/private deck visibility
- User ownership and permissions
- Timestamps for version tracking

#### DeckCard
Junction table for cards in decks.

```prisma
model DeckCard {
  id       String @id @default(cuid())
  deckId   String
  cardId   String
  quantity Int    @default(1)
  category String?

  // Relationships
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id])

  @@unique([deckId, cardId])
  @@map("deck_cards")
}
```

**Features:**
- Quantity tracking for multiple copies
- Optional categorization (e.g., "Main", "Side", "Extra")
- Cascade deletion when deck is removed

### Collection Management Models

#### Collection
User's personal card collection.

```prisma
model Collection {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  user            User             @relation(fields: [userId], references: [id])
  collectionCards CollectionCard[]

  @@map("collections")
}
```

**Features:**
- One collection per user
- Quantity tracking for owned cards
- Integration with deck building

#### CollectionCard
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

**Features:**
- Quantity tracking for owned cards
- Cascade deletion when collection is removed

### Rules and Clarifications

#### CardRuling
Official rulings and clarifications for card interactions.

```prisma
model CardRuling {
  id          String   @id @default(cuid())
  cardId      String
  question    String
  answer      String
  source      String?  // Official source (e.g., "Bandai FAQ")
  isOfficial  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
}
```

**Features:**
- Question/answer format
- Source attribution
- Official vs. community rulings
- Cascade deletion when card is removed

### Database Indexes

#### Performance Optimization

Strategic indexes for optimal query performance:

```sql
-- Card model indexes
@@index([name])                  -- Card name searches
@@index([faction])               -- Faction filtering
@@index([series])                -- Series filtering
@@index([keywords])              -- Keyword searches
@@unique([setId, setNumber])     -- Unique card identification

-- User model indexes
@@unique([email])                -- User authentication

-- Collection model indexes
@@unique([userId])               -- One collection per user

-- Junction table indexes
@@unique([deckId, cardId])       -- Unique deck-card relationships
@@unique([collectionId, cardId]) -- Unique collection-card relationships
```

#### Recommended Additional Indexes

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
CREATE INDEX idx_cards_search ON cards
  USING gin(to_tsvector('english', name || ' ' || description));
```

### Data Relationships

#### Entity Relationship Diagram

```
User (1) ----< (N) Deck
User (1) ----< (1) Collection

Deck (1) ----< (N) DeckCard (N) >---- (1) Card
Collection (1) ----< (N) CollectionCard (N) >---- (1) Card

Card (N) >---- (1) CardType
Card (N) >---- (1) Rarity
Card (N) >---- (1) Set
Card (1) ----< (N) CardRuling

Faction (1) ----< (N) Card
Series (1) ----< (N) Card
```

#### Relationship Rules

1. **User → Decks**: One-to-many - A user can have multiple decks
2. **User → Collection**: One-to-one - Each user has exactly one collection
3. **Deck → Cards**: Many-to-many (via DeckCard) - Tracks quantity per card
4. **Collection → Cards**: Many-to-many (via CollectionCard) - Tracks owned quantity
5. **Card → CardType**: Many-to-one - Each card has exactly one type
6. **Card → Rarity**: Many-to-one - Each card has exactly one rarity
7. **Card → Set**: Many-to-one - Each card belongs to exactly one set
8. **Card → CardRuling**: One-to-many - Cards can have multiple rulings

---

## Database Operations

### Prisma Client Usage

#### Basic Operations

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

// Search by keywords
const keywordResults = await prisma.card.findMany({
  where: {
    keywords: {
      hasSome: ['mobile suit', 'gundam'],
    },
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

### Query Optimization

#### Optimize Field Selection

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
```

#### Implement Pagination

```typescript
// Use pagination for large datasets
const cards = await prisma.card.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { name: 'asc' },
});
```

#### Raw Queries for Complex Operations

```typescript
// Use raw queries for complex aggregations
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

### Database Migrations

#### Creating Migrations

```bash
# Create a new migration
npm run db:migrate

# Deploy migrations to production
npm run db:migrate:deploy

# Reset database (development only)
npm run db:reset
```

#### Migration Best Practices

1. **Always backup production data** before running migrations
2. **Test migrations** on a copy of production data
3. **Use transactions** for complex migrations
4. **Add indexes** for frequently queried fields
5. **Consider data migration** for schema changes

#### Example Migration

```sql
-- Migration: Add card search index
CREATE INDEX CONCURRENTLY idx_cards_name_search
ON cards USING gin(to_tsvector('english', name));

-- Migration: Add deck statistics
ALTER TABLE decks ADD COLUMN card_count INTEGER DEFAULT 0;
ALTER TABLE decks ADD COLUMN total_cost INTEGER DEFAULT 0;
```

---

## Data Validation & Security

### Data Validation Rules

#### Business Logic Constraints

1. **Card Uniqueness**: Each card must have a unique combination of `setId` and `setNumber`
2. **Collection Uniqueness**: Each user can have only one collection
3. **Deck Ownership**: Users can only modify their own decks
4. **Quantity Validation**: Deck and collection quantities must be positive integers
5. **Image Requirements**: Cards must have at least one image URL
6. **Set Number Format**: Set numbers should follow consistent formatting (e.g., "ST01-001")

#### Data Type Constraints

**String Lengths:**
- Card names: 1-100 characters
- Descriptions: 0-1000 characters
- Set codes: 2-10 characters

**Numeric Ranges:**
- Level: 0-99
- Cost: 0-99
- Power/Defense/Speed: 0-999

**Array Limits:**
- Keywords: Maximum 20 items
- Tags: Maximum 10 items

### Database Security

#### Access Control

1. **User Authentication** - All user data is protected by authentication
2. **Role-based Access** - Admin users have additional permissions
3. **Data Isolation** - Users can only access their own data
4. **Input Validation** - All inputs are validated before database operations

#### Data Protection

1. **Encryption** - Sensitive data is encrypted at rest
2. **Backups** - Regular automated backups
3. **Audit Logging** - Track all database changes
4. **Connection Security** - SSL/TLS for all connections

### Access Control

#### Permission Levels

**Public Access:**
- Card browsing
- Public deck viewing

**User Access:**
- Personal collection management
- Deck creation and management
- Profile management

**Admin Access:**
- Card data management
- User administration
- System configuration

**Moderator Access:**
- Content moderation
- Ruling management
- Community oversight

### Performance Monitoring

#### Health Checks

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

#### Monitoring Areas

1. **Query Performance** - Monitor slow queries
2. **Connection Pooling** - Efficient connection management
3. **Index Usage** - Monitor index effectiveness
4. **Resource Usage** - Track CPU, memory, and disk usage

#### Maintenance Tasks

1. **Vacuum and Analyze** - Regular database maintenance
2. **Index Rebuilding** - Optimize index performance
3. **Statistics Updates** - Keep query planner statistics current
4. **Log Rotation** - Manage database logs

#### Performance Tuning

1. **Query Optimization** - Analyze and optimize slow queries
2. **Index Tuning** - Add or remove indexes as needed
3. **Connection Pooling** - Optimize connection settings
4. **Memory Configuration** - Tune PostgreSQL memory settings

---

## Additional Information

### Data Seeding

The database can be seeded with initial data for development:

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

**Running Seeds:**
```bash
# Seed the database
npm run db:seed

# Reset and seed
npm run db:reset
npm run db:seed
```

### Backup and Recovery

#### Backup Strategy

```bash
# Create database backup
pg_dump -h localhost -U gundam_user -d gundam_card_game > backup.sql

# Restore from backup
psql -h localhost -U gundam_user -d gundam_card_game < backup.sql
```

#### Recovery Procedures

1. **Point-in-time Recovery** - Restore to specific timestamp
2. **Data Corruption Recovery** - Repair corrupted data
3. **Disaster Recovery** - Full system restoration
4. **Testing Recovery** - Regular recovery testing

### SDK and Client Libraries

#### JavaScript/TypeScript

```typescript
import { GundamCardGameAPI } from '@gundam-card-game/api-client';

const api = new GundamCardGameAPI({
  baseURL: 'https://api.gundam-card-game.com',
  apiKey: 'your-api-key'
});

// Get cards
const cards = await api.cards.list({
  page: 1,
  limit: 20,
  search: 'gundam'
});

// Create deck
const deck = await api.decks.create({
  name: 'My Deck',
  description: 'A powerful deck',
  cards: [
    { cardId: 'card-001', quantity: 2 }
  ]
});
```

### API Testing

#### Using Test Utilities

```typescript
import { testAPI } from '@/lib/test-utils';

describe('Cards API', () => {
  it('should return cards list', async () => {
    const response = await testAPI.get('/api/cards');
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });
});
```

#### Postman Collection

A Postman collection is available for API testing:
- Import `docs/postman/Gundam-Card-Game-API.postman_collection.json`
- Set environment variables for different environments
- Use the collection for manual testing and documentation

---

**Version**: 1.0.0
**Last Updated**: 2024-01-01
**Maintained By**: Gundam Card Game Development Team
