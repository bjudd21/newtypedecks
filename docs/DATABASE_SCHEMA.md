# Database Schema Documentation

This document describes the comprehensive database schema for the Gundam Card Game website, designed to support a full-featured card database and deck building platform.

## Overview

The database schema is designed with the following principles:
- **Normalization**: Proper relational structure to avoid data duplication
- **Flexibility**: Support for various card types and game mechanics
- **Performance**: Optimized indexes for common queries
- **Extensibility**: Easy to add new features and card attributes
- **Data Integrity**: Foreign key constraints and validation rules

## Core Models

### User Management

#### User
```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  decks       Deck[]
  collections Collection[]
}
```

**Purpose**: User authentication and profile management
**Key Features**:
- Unique email addresses
- Role-based access control (USER, ADMIN, MODERATOR)
- Profile information with optional image
- Timestamps for audit trails

#### UserRole
```sql
enum UserRole {
  USER
  ADMIN
  MODERATOR
}
```

**Purpose**: Role-based access control system

### Card System

#### Card
```sql
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
  hitPoints    Int?     // Hit Points (HP) - unit durability (for Unit cards)
  attackPoints Int?     // Attack Points (AP) - damage dealt (for Unit cards)
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
}
```

**Purpose**: Core card data with comprehensive game attributes
**Key Features**:
- Flexible game mechanics support
- Multiple image sizes for different use cases
- Searchable keywords and tags
- Support for special card variants (foil, promo, alternate)
- Multilingual support
- Performance indexes on commonly queried fields

#### CardType
```sql
model CardType {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  category    String? // e.g., "Unit", "Pilot", "Command", "Event", "Support"

  // Relations
  cards Card[]
}
```

**Purpose**: Categorization of cards by type and function
**Categories** (Based on Official Gundam Card Game Rules):
- **Unit**: Mobile Suits, Mobile Armors, Cruisers, Colonies - primary combat units
- **Character**: Pilots and crew members that enhance unit capabilities
- **Command**: Specific effects, often representing scenes from the anime (discarded after use)
- **Operation**: Ongoing effects that remain in play to influence game state
- **Generation**: Resource cards that produce "Nation Power" to play other cards

#### Rarity
```sql
model Rarity {
  id          String @id @default(cuid())
  name        String @unique
  color       String
  description String?

  // Relations
  cards Card[]
}
```

**Purpose**: Card rarity system with visual indicators
**Common Rarities**:
- Common (Gray)
- Uncommon (Green)
- Rare (Blue)
- Epic (Purple)
- Legendary (Gold)
- Mythic (Red)

#### Set
```sql
model Set {
  id          String    @id @default(cuid())
  name        String    @unique
  code        String    @unique
  releaseDate DateTime
  description String?
  imageUrl    String?

  // Relations
  cards Card[]
}
```

**Purpose**: Card set organization and release tracking
**Features**:
- Unique set codes for easy identification
- Release date tracking
- Set-specific images and descriptions

### Game Organization

#### Faction
```sql
model Faction {
  id          String @id @default(cuid())
  name        String @unique
  description String?
  color       String? // Hex color for UI
  imageUrl    String?

  // Relations
  cards Card[]
}
```

**Purpose**: Faction-based card organization
**Common Factions**:
- Earth Federation
- Principality of Zeon
- AEUG (Anti-Earth Union Group)
- Titans
- Crossbone Vanguard
- ZAFT
- Orb Union

#### Series
```sql
model Series {
  id          String @id @default(cuid())
  name        String @unique
  code        String @unique // e.g., "UC", "CE", "AD"
  description String?
  imageUrl    String?

  // Relations
  cards Card[]
}
```

**Purpose**: Gundam series organization
**Common Series**:
- **UC** (Universal Century): Original timeline
- **CE** (Cosmic Era): Gundam SEED
- **AD** (Anno Domini): Gundam 00
- **AC** (After Colony): Gundam Wing
- **FC** (Future Century): G Gundam

### Deck Building

#### Deck
```sql
model Deck {
  id          String   @id @default(cuid())
  name        String
  description String?
  isPublic    Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user  User       @relation(fields: [userId], references: [id])
  cards DeckCard[]
}
```

**Purpose**: User-created deck collections
**Features**:
- Public/private deck visibility
- User ownership and permissions
- Timestamps for version tracking

#### DeckCard
```sql
model DeckCard {
  id       String @id @default(cuid())
  deckId   String
  cardId   String
  quantity Int
  category String?

  // Relations
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id])

  @@unique([deckId, cardId])
}
```

**Purpose**: Many-to-many relationship between decks and cards
**Features**:
- Quantity tracking for multiple copies
- Optional categorization (e.g., "Main", "Side", "Extra")
- Cascade deletion when deck is removed

### Collection Management

#### Collection
```sql
model Collection {
  id        String   @id @default(cuid())
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user  User             @relation(fields: [userId], references: [id])
  cards CollectionCard[]

  @@unique([userId])
}
```

**Purpose**: User's personal card collection
**Features**:
- One collection per user
- Quantity tracking for owned cards
- Integration with deck building

#### CollectionCard
```sql
model CollectionCard {
  id           String @id @default(cuid())
  collectionId String
  cardId       String
  quantity     Int

  // Relations
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  card       Card       @relation(fields: [cardId], references: [id])

  @@unique([collectionId, cardId])
}
```

**Purpose**: Many-to-many relationship between collections and cards
**Features**:
- Quantity tracking for owned cards
- Cascade deletion when collection is removed

### Rules and Clarifications

#### CardRuling
```sql
model CardRuling {
  id          String   @id @default(cuid())
  cardId      String
  question    String
  answer      String
  source      String?  // Official source (e.g., "Bandai FAQ")
  isOfficial  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
}
```

**Purpose**: Official rulings and clarifications for card interactions
**Features**:
- Question/answer format
- Source attribution
- Official vs. community rulings
- Cascade deletion when card is removed

## Database Indexes

### Performance Optimization

The schema includes strategic indexes for optimal query performance:

```sql
-- Card model indexes
@@index([name])           -- Card name searches
@@index([faction])        -- Faction filtering
@@index([series])         -- Series filtering
@@index([keywords])       -- Keyword searches
@@unique([setId, setNumber]) -- Unique card identification

-- User model indexes
@@unique([email])         -- User authentication

-- Collection model indexes
@@unique([userId])        -- One collection per user

-- Deck model indexes
@@unique([deckId, cardId]) -- Unique deck-card relationships
@@unique([collectionId, cardId]) -- Unique collection-card relationships
```

### Query Optimization Examples

```sql
-- Find all cards by faction
SELECT * FROM cards WHERE faction = 'Earth Federation';

-- Search cards by keywords
SELECT * FROM cards WHERE 'mobile suit' = ANY(keywords);

-- Find cards in a specific set
SELECT * FROM cards WHERE setId = 'set-id' ORDER BY setNumber;

-- Get user's collection with card details
SELECT c.*, cc.quantity 
FROM cards c 
JOIN collection_cards cc ON c.id = cc.cardId 
WHERE cc.collectionId = 'collection-id';
```

## Data Relationships

### Entity Relationship Diagram

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

### Relationship Rules

1. **User → Deck**: One user can have many decks
2. **User → Collection**: One user has exactly one collection
3. **Deck → Card**: Many-to-many through DeckCard with quantity
4. **Collection → Card**: Many-to-many through CollectionCard with quantity
5. **Card → CardType**: Many-to-one (cards belong to one type)
6. **Card → Rarity**: Many-to-one (cards have one rarity)
7. **Card → Set**: Many-to-one (cards belong to one set)
8. **Card → CardRuling**: One-to-many (cards can have multiple rulings)

## Data Validation Rules

### Business Logic Constraints

1. **Card Uniqueness**: Each card must have a unique combination of `setId` and `setNumber`
2. **Collection Uniqueness**: Each user can have only one collection
3. **Deck Ownership**: Users can only modify their own decks
4. **Quantity Validation**: Deck and collection quantities must be positive integers
5. **Image Requirements**: Cards must have at least one image URL
6. **Set Number Format**: Set numbers should follow consistent formatting (e.g., "ST01-001")

### Data Type Constraints

1. **String Lengths**: 
   - Card names: 1-100 characters
   - Descriptions: 0-1000 characters
   - Set codes: 2-10 characters
2. **Numeric Ranges**:
   - Level: 0-99
   - Cost: 0-99
   - Power/Defense/Speed: 0-999
3. **Array Limits**:
   - Keywords: Maximum 20 items
   - Tags: Maximum 10 items

## Migration Strategy

### Database Evolution

The schema is designed to support incremental migrations:

1. **Core Models**: User, Card, CardType, Rarity, Set
2. **Game Models**: Faction, Series, CardRuling
3. **User Features**: Deck, Collection, DeckCard, CollectionCard
4. **Future Extensions**: Tournament, Match, Statistics

### Backward Compatibility

- All new fields are optional to maintain compatibility
- Existing data remains valid during schema updates
- Gradual migration of legacy data to new structure

## Security Considerations

### Data Protection

1. **User Data**: Encrypted passwords, secure session management
2. **Card Data**: Public read access, admin write access
3. **Collection Data**: User-specific access control
4. **Deck Data**: Owner-only modification, public read (if enabled)

### Access Control

1. **Public Access**: Card browsing, public deck viewing
2. **User Access**: Personal collection and deck management
3. **Admin Access**: Card data management, user administration
4. **Moderator Access**: Content moderation, ruling management

## Performance Considerations

### Query Optimization

1. **Indexed Fields**: Name, faction, series, keywords
2. **Composite Indexes**: Set + setNumber for unique lookups
3. **Foreign Key Indexes**: Automatic indexes on foreign key fields
4. **Array Indexes**: GIN indexes for array field searches

### Caching Strategy

1. **Card Data**: Cache frequently accessed cards
2. **Set Data**: Cache set information and card lists
3. **User Collections**: Cache user collection summaries
4. **Search Results**: Cache common search queries

## Future Extensions

### Planned Features

1. **Tournament System**: Tournament models and match tracking
2. **Statistics**: Card usage statistics and meta analysis
3. **Trading System**: Card trading between users
4. **Wishlist**: User wishlist for desired cards
5. **Price Tracking**: Market price history and trends

### Schema Extensions

The current schema is designed to accommodate future features without major restructuring:

- Additional card attributes can be added as optional fields
- New relationship models can be created as needed
- Indexes can be added for new query patterns
- Views and stored procedures can be added for complex operations

## Conclusion

This database schema provides a solid foundation for a comprehensive Gundam Card Game website. It balances flexibility with performance, supports current requirements while allowing for future growth, and maintains data integrity through proper normalization and constraints.

The schema is designed to scale with the application and can be extended as new features are added to the platform.
