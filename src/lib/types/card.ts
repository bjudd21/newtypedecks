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
  
  // Game-specific attributes
  power?: number;
  defense?: number;
  speed?: number;
  range?: string;
  attribute?: string;
  faction?: string;
  pilot?: string;
  model?: string;
  series?: string;
  
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
  pilot?: string;
  model?: string;
  attribute?: string;
  range?: string;
  keywords?: string[];
  tags?: string[];
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
  language?: string;
  
  // Numeric ranges
  levelMin?: number;
  levelMax?: number;
  costMin?: number;
  costMax?: number;
  powerMin?: number;
  powerMax?: number;
  defenseMin?: number;
  defenseMax?: number;
  speedMin?: number;
  speedMax?: number;
}

export interface CardSearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'level' | 'cost' | 'power' | 'defense' | 'speed' | 'setNumber' | 'createdAt';
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
    card1Value: any;
    card2Value: any;
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
export type CardSortField = 'name' | 'level' | 'cost' | 'power' | 'defense' | 'speed' | 'setNumber' | 'createdAt';
export type CardSortOrder = 'asc' | 'desc';
export type CardLanguage = 'en' | 'ja' | 'ko' | 'zh' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru';
export type CardAttribute = 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark' | 'neutral';
export type CardRange = 'close' | 'medium' | 'long' | 'support' | 'command';
export type CardCategory = 'unit' | 'pilot' | 'command' | 'event' | 'support' | 'equipment';

// Constants for card system
export const CARD_CONSTANTS = {
  MAX_LEVEL: 99,
  MAX_COST: 99,
  MAX_POWER: 999,
  MAX_DEFENSE: 999,
  MAX_SPEED: 999,
  MAX_KEYWORDS: 20,
  MAX_TAGS: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_OFFICIAL_TEXT_LENGTH: 2000,
  MAX_ABILITIES_LENGTH: 5000,
  SUPPORTED_LANGUAGES: ['en', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru'] as const,
  SUPPORTED_ATTRIBUTES: ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'neutral'] as const,
  SUPPORTED_RANGES: ['close', 'medium', 'long', 'support', 'command'] as const,
  SUPPORTED_CATEGORIES: ['unit', 'pilot', 'command', 'event', 'support', 'equipment'] as const,
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
