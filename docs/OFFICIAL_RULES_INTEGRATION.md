# Official Gundam Card Game Rules Integration

This document outlines how the database schema and TypeScript interfaces have been updated to accurately reflect the official Gundam Card Game rules and mechanics.

## Overview

Based on the official comprehensive rules document, the database schema has been updated to use the correct terminology and game mechanics from the actual Gundam Card Game. This ensures accuracy and authenticity in our card database implementation.

## Key Updates Made

### 1. Card Categories (Official Types)

**Updated from generic categories to official Gundam Card Game types:**

- **Unit**: Mobile Suits, Mobile Armors, Cruisers, Colonies - primary combat units
- **Character**: Pilots and crew members that enhance unit capabilities  
- **Command**: Specific effects, often representing scenes from the anime (discarded after use)
- **Operation**: Ongoing effects that remain in play to influence game state
- **Generation**: Resource cards that produce "Nation Power" to play other cards

### 2. Card Attributes (Official Terminology)

**Replaced generic attributes with official Gundam Card Game mechanics:**

#### Before (Generic):
- `power` - Attack/Combat power
- `defense` - Defense value  
- `speed` - Speed/Mobility
- `range` - Attack range
- `attribute` - Element/Attribute

#### After (Official):
- `clashPoints` - Clash Points (CP) - battle strength
- `price` - Price - cost to play the card
- `hitPoints` - Hit Points (HP) - unit durability (for Unit cards)
- `attackPoints` - Attack Points (AP) - damage dealt (for Unit cards)
- `nation` - Nation/Country affiliation

### 3. Database Schema Updates

#### Prisma Schema Changes:
```prisma
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
```

#### New Indexes for Performance:
```prisma
@@index([nation])
@@index([clashPoints])
@@index([price])
```

### 4. TypeScript Interface Updates

#### Card Creation Interface:
```typescript
export interface CreateCardData {
  // Official Gundam Card Game attributes
  clashPoints?: number;  // Clash Points (CP) - battle strength
  price?: number;        // Price - cost to play the card
  hitPoints?: number;    // Hit Points (HP) - unit durability (for Unit cards)
  attackPoints?: number; // Attack Points (AP) - damage dealt (for Unit cards)
  faction?: string;      // Faction/Group (Earth Federation, Zeon, etc.)
  pilot?: string;        // Pilot name for mobile suits
  model?: string;        // Mobile suit model number
  series?: string;       // Anime series (UC, CE, AD, etc.)
  nation?: string;       // Nation/Country affiliation
}
```

#### Search Filters:
```typescript
export interface CardSearchFilters {
  // Official Gundam Card Game numeric ranges
  clashPointsMin?: number;
  clashPointsMax?: number;
  priceMin?: number;
  priceMax?: number;
  hitPointsMin?: number;
  hitPointsMax?: number;
  attackPointsMin?: number;
  attackPointsMax?: number;
}
```

### 5. Constants and Validation

#### Updated Constants:
```typescript
export const CARD_CONSTANTS = {
  MAX_CLASH_POINTS: 999,
  MAX_PRICE: 99,
  MAX_HIT_POINTS: 999,
  MAX_ATTACK_POINTS: 999,
  SUPPORTED_CATEGORIES: ['unit', 'character', 'command', 'operation', 'generation'] as const,
  SUPPORTED_FACTIONS: [
    'Earth Federation',
    'Principality of Zeon',
    'AEUG',
    'Titans',
    'Crossbone Vanguard',
    'ZAFT',
    'Orb Union',
    'Celestial Being',
    'A-LAWS'
  ] as const,
  SUPPORTED_SERIES: ['UC', 'CE', 'AD', 'AC', 'FC', 'AG', 'PD'] as const,
} as const;
```

### 6. Official Factions and Series

#### Supported Factions:
- **Earth Federation** - Primary Earth government
- **Principality of Zeon** - Space colony independence movement
- **AEUG** - Anti-Earth Union Group
- **Titans** - Earth Federation special forces
- **Crossbone Vanguard** - Space pirate organization
- **ZAFT** - Zodiac Alliance of Freedom Treaty
- **Orb Union** - Neutral nation
- **Celestial Being** - Gundam 00 organization
- **A-LAWS** - Advanced Long-range Strategic Tactical Armored Weapons

#### Supported Series:
- **UC** - Universal Century (Original timeline)
- **CE** - Cosmic Era (Gundam SEED)
- **AD** - Anno Domini (Gundam 00)
- **AC** - After Colony (Gundam Wing)
- **FC** - Future Century (G Gundam)
- **AG** - Advanced Generation (Gundam AGE)
- **PD** - Post Disaster (Gundam: Iron-Blooded Orphans)

## Game Mechanics Integration

### 1. Resource Management
- **Generation Cards** produce "Nation Power" (similar to mana in other card games)
- **Price** field tracks the cost to play each card
- **Nation** field tracks faction affiliation for resource generation

### 2. Combat System
- **Clash Points (CP)** determine battle strength
- **Hit Points (HP)** track unit durability
- **Attack Points (AP)** determine damage dealt
- **Faction** and **Nation** affect combat bonuses and restrictions

### 3. Card Interactions
- **Character Cards** can be assigned to **Unit Cards** for enhancements
- **Command Cards** provide one-time effects (discarded after use)
- **Operation Cards** remain in play for ongoing effects
- **Generation Cards** provide resources for playing other cards

## Database Migration

The schema updates were applied through two migrations:

1. **`20250919134502_enhance_card_schema`** - Initial comprehensive schema
2. **`20250919135305_update_card_schema_official_rules`** - Official rules alignment

## Benefits of Official Rules Integration

### 1. Accuracy
- Database schema now matches actual game mechanics
- Terminology is consistent with official rules
- Card attributes reflect real gameplay values

### 2. Authenticity
- Players will recognize familiar game terms
- Card data will be accurate to the actual game
- Search and filtering will use proper game terminology

### 3. Future-Proofing
- Schema supports all official card types
- Extensible for new sets and mechanics
- Compatible with official card data imports

### 4. User Experience
- Familiar terminology for players
- Accurate card information
- Proper game mechanics representation

## Implementation Notes

### 1. Backward Compatibility
- All new fields are optional to maintain compatibility
- Existing data remains valid during schema updates
- Gradual migration path for legacy data

### 2. Performance Optimization
- Strategic indexes on commonly queried fields
- Efficient search patterns for official attributes
- Optimized for typical card game queries

### 3. Data Validation
- Business rules aligned with official game mechanics
- Proper constraints for official attribute ranges
- Validation schemas for official terminology

## Conclusion

The database schema and TypeScript interfaces have been successfully updated to accurately reflect the official Gundam Card Game rules. This ensures that our card database will be authentic, accurate, and familiar to players of the actual game.

The integration of official rules provides a solid foundation for building a comprehensive and accurate Gundam Card Game database that players will trust and find useful for deck building, collection management, and game reference.
