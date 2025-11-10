/**
 * Card-related TypeScript interfaces and types
 *
 * This file defines comprehensive types for the Gundam Card Game card system,
 * including all the enhanced attributes and relationships.
 */

import type { Card, CardType, Rarity, Set, CardRuling } from '@prisma/client';

// Base card interface with all enhanced attributes
export interface CardWithRelations extends Card {
  type: CardType;
  rarity: Rarity;
  set: Set;
  rulings?: CardRuling[];
}

// Card creation/update interfaces
export interface CreateCardData {
  name: string;
  level?: number;
  cost?: number;
  typeId: string;
  rarityId: string;
  setId: string;
  setNumber: string;
  imageUrl: string;
  imageUrlSmall?: string;
  imageUrlLarge?: string;
  description?: string;
  officialText?: string;

  // Official Gundam Card Game attributes
  clashPoints?: number; // Clash Points (CP) - battle strength
  price?: number; // Price - cost to play the card
  hitPoints?: number; // Hit Points (HP) - unit durability (for Unit cards)
  attackPoints?: number; // Attack Points (AP) - damage dealt (for Unit cards)
  faction?: string; // Faction/Group (Earth Federation, Zeon, etc.)
  pilot?: string; // Pilot name for mobile suits
  model?: string; // Mobile suit model number
  series?: string; // Anime series (UC, CE, AD, etc.)
  nation?: string; // Nation/Country affiliation

  // Card mechanics
  abilities?: string; // JSON string
  keywords?: string[];
  tags?: string[];

  // Metadata
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;
}

export interface UpdateCardData extends Partial<CreateCardData> {
  id: string;
}

// Card search and filtering interfaces
export interface CardSearchFilters {
  name?: string;
  typeId?: string;
  rarityId?: string;
  setId?: string;
  faction?: string;
  series?: string;
  nation?: string;
  pilot?: string;
  model?: string;
  keywords?: string[];
  tags?: string[];
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;

  // Official Gundam Card Game numeric ranges
  levelMin?: number;
  levelMax?: number;
  costMin?: number;
  costMax?: number;
  clashPointsMin?: number;
  clashPointsMax?: number;
  priceMin?: number;
  priceMax?: number;
  hitPointsMin?: number;
  hitPointsMax?: number;
  attackPointsMin?: number;
  attackPointsMax?: number;
}

export interface CardSearchOptions {
  page?: number;
  limit?: number;
  sortBy?:
    | 'name'
    | 'level'
    | 'cost'
    | 'clashPoints'
    | 'price'
    | 'hitPoints'
    | 'attackPoints'
    | 'setNumber'
    | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  includeRelations?: boolean;
}

export interface CardSearchResult {
  cards: CardWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Card abilities and mechanics
export interface CardAbility {
  name: string;
  description: string;
  cost?: number;
  type: 'passive' | 'active' | 'trigger' | 'continuous';
  conditions?: string[];
  effects?: string[];
}

export interface CardMechanics {
  abilities?: CardAbility[];
  keywords?: string[];
  tags?: string[];
  restrictions?: string[];
  synergies?: string[];
}

// Card statistics and analytics
export interface CardStatistics {
  totalCards: number;
  cardsByType: Record<string, number>;
  cardsByRarity: Record<string, number>;
  cardsByFaction: Record<string, number>;
  cardsBySeries: Record<string, number>;
  averagePower: number;
  averageDefense: number;
  averageSpeed: number;
  mostCommonKeywords: Array<{ keyword: string; count: number }>;
  mostCommonTags: Array<{ tag: string; count: number }>;
}

// Card comparison and analysis
export interface CardComparison {
  card1: CardWithRelations;
  card2: CardWithRelations;
  differences: {
    attribute: string;
    card1Value: unknown;
    card2Value: unknown;
  }[];
  similarities: string[];
}

// Card validation and business rules
export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CardBusinessRules {
  maxLevel: number;
  maxCost: number;
  maxPower: number;
  maxDefense: number;
  maxSpeed: number;
  maxKeywords: number;
  maxTags: number;
  requiredFields: string[];
  uniqueConstraints: string[];
}

// Card import/export interfaces
export interface CardImportData {
  cards: CreateCardData[];
  metadata: {
    source: string;
    version: string;
    importedAt: Date;
    totalCards: number;
  };
}

export interface CardExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  includeImages: boolean;
  includeRelations: boolean;
  filters?: CardSearchFilters;
}

// Card image management
export interface CardImageInfo {
  originalUrl: string;
  smallUrl?: string;
  largeUrl?: string;
  thumbnailUrl?: string;
  altText: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  format: string;
}

// Card ruling interfaces
export interface CreateCardRulingData {
  cardId: string;
  question: string;
  answer: string;
  source?: string;
  isOfficial?: boolean;
}

export interface UpdateCardRulingData extends Partial<CreateCardRulingData> {
  id: string;
}

// Card type and rarity management
export interface CreateCardTypeData {
  name: string;
  description?: string;
  category?: string;
}

export interface CreateRarityData {
  name: string;
  color: string;
  description?: string;
}

export interface CreateSetData {
  name: string;
  code: string;
  releaseDate: Date;
  description?: string;
  imageUrl?: string;
}

// Card collection and deck integration
export interface CardInCollection {
  card: CardWithRelations;
  quantity: number;
  addedAt: Date;
  notes?: string;
}

export interface CardInDeck {
  card: CardWithRelations;
  quantity: number;
  category?: string;
  notes?: string;
}

// Card market and pricing (for future features)
export interface CardPrice {
  cardId: string;
  price: number;
  currency: string;
  source: string;
  lastUpdated: Date;
  condition: 'mint' | 'near-mint' | 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CardMarketData {
  card: CardWithRelations;
  prices: CardPrice[];
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  priceHistory: Array<{
    date: Date;
    price: number;
  }>;
}

// Utility types for card operations
export type CardSortField =
  | 'name'
  | 'level'
  | 'cost'
  | 'clashPoints'
  | 'price'
  | 'hitPoints'
  | 'attackPoints'
  | 'setNumber'
  | 'createdAt';
export type CardSortOrder = 'asc' | 'desc';
export type CardLanguage =
  | 'en'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru';
export type CardAttribute =
  | 'fire'
  | 'water'
  | 'earth'
  | 'wind'
  | 'light'
  | 'dark'
  | 'neutral';
export type CardRange = 'close' | 'medium' | 'long' | 'support' | 'command';
export type CardCategory =
  | 'unit'
  | 'character'
  | 'command'
  | 'operation'
  | 'generation';

// Constants for official Gundam Card Game system
export const CARD_CONSTANTS = {
  MAX_LEVEL: 99,
  MAX_COST: 99,
  MAX_CLASH_POINTS: 999,
  MAX_PRICE: 99,
  MAX_HIT_POINTS: 999,
  MAX_ATTACK_POINTS: 999,
  MAX_KEYWORDS: 20,
  MAX_TAGS: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_OFFICIAL_TEXT_LENGTH: 2000,
  MAX_ABILITIES_LENGTH: 5000,
  SUPPORTED_LANGUAGES: [
    'en',
    'ja',
    'ko',
    'zh',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'ru',
  ] as const,
  SUPPORTED_CATEGORIES: [
    'unit',
    'character',
    'command',
    'operation',
    'generation',
  ] as const,
  SUPPORTED_FACTIONS: [
    'Earth Federation',
    'Principality of Zeon',
    'AEUG',
    'Titans',
    'Crossbone Vanguard',
    'ZAFT',
    'Orb Union',
    'Celestial Being',
    'A-LAWS',
  ] as const,
  SUPPORTED_SERIES: ['UC', 'CE', 'AD', 'AC', 'FC', 'AG', 'PD'] as const,
} as const;

// Validation schemas (for runtime validation)
export const CARD_VALIDATION_SCHEMAS = {
  name: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'\.]+$/,
  },
  setNumber: {
    pattern: /^[A-Z0-9]+-[0-9]+$/,
  },
  description: {
    maxLength: 1000,
  },
  officialText: {
    maxLength: 2000,
  },
  abilities: {
    maxLength: 5000,
  },
  keywords: {
    maxItems: 20,
    maxLength: 50,
  },
  tags: {
    maxItems: 10,
    maxLength: 30,
  },
} as const;
