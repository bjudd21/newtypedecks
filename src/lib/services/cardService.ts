/**
 * Card service layer - Reusable data access functions
 *
 * This service provides reusable functions for card data operations
 * that can be used by API routes, components, and other parts of the application.
 */

import { PrismaClient } from '@prisma/client';
import type {
  CardWithRelations,
  CreateCardData,
  UpdateCardData,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '../types/card';
import { CardModel, CardValidator, CardUtils } from '../models/card';

// Initialize Prisma client (will be imported from database/index.ts in real usage)
let prisma: PrismaClient;

// This will be replaced with the actual database import
const getDatabaseClient = async () => {
  if (!prisma) {
    const { prisma: dbClient } = await import('../database');
    prisma = dbClient;
  }
  return prisma;
};

/**
 * Card Service class - Provides reusable data access methods
 */
export class CardService {
  /**
   * Get all cards with optional filters and pagination
   */
  static async searchCards(
    filters: CardSearchFilters = {},
    options: CardSearchOptions = {}
  ): Promise<CardSearchResult> {
    const db = await getDatabaseClient();
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      includeRelations = true
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause from filters
    const whereClause: any = {};

    // Text search filters
    if (filters.name) {
      whereClause.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }

    // Exact match filters
    if (filters.typeId) whereClause.typeId = filters.typeId;
    if (filters.rarityId) whereClause.rarityId = filters.rarityId;
    if (filters.setId) whereClause.setId = filters.setId;
    if (filters.faction) whereClause.faction = filters.faction;
    if (filters.series) whereClause.series = filters.series;
    if (filters.nation) whereClause.nation = filters.nation;
    if (filters.pilot) whereClause.pilot = { contains: filters.pilot, mode: 'insensitive' };
    if (filters.model) whereClause.model = { contains: filters.model, mode: 'insensitive' };
    if (filters.language) whereClause.language = filters.language;

    // Boolean filters
    if (filters.isFoil !== undefined) whereClause.isFoil = filters.isFoil;
    if (filters.isPromo !== undefined) whereClause.isPromo = filters.isPromo;
    if (filters.isAlternate !== undefined) whereClause.isAlternate = filters.isAlternate;

    // Numeric range filters
    const numericFilters: any = {};
    if (filters.levelMin !== undefined || filters.levelMax !== undefined) {
      numericFilters.level = {};
      if (filters.levelMin !== undefined) numericFilters.level.gte = filters.levelMin;
      if (filters.levelMax !== undefined) numericFilters.level.lte = filters.levelMax;
    }
    if (filters.costMin !== undefined || filters.costMax !== undefined) {
      numericFilters.cost = {};
      if (filters.costMin !== undefined) numericFilters.cost.gte = filters.costMin;
      if (filters.costMax !== undefined) numericFilters.cost.lte = filters.costMax;
    }
    if (filters.clashPointsMin !== undefined || filters.clashPointsMax !== undefined) {
      numericFilters.clashPoints = {};
      if (filters.clashPointsMin !== undefined) numericFilters.clashPoints.gte = filters.clashPointsMin;
      if (filters.clashPointsMax !== undefined) numericFilters.clashPoints.lte = filters.clashPointsMax;
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      numericFilters.price = {};
      if (filters.priceMin !== undefined) numericFilters.price.gte = filters.priceMin;
      if (filters.priceMax !== undefined) numericFilters.price.lte = filters.priceMax;
    }
    if (filters.hitPointsMin !== undefined || filters.hitPointsMax !== undefined) {
      numericFilters.hitPoints = {};
      if (filters.hitPointsMin !== undefined) numericFilters.hitPoints.gte = filters.hitPointsMin;
      if (filters.hitPointsMax !== undefined) numericFilters.hitPoints.lte = filters.hitPointsMax;
    }
    if (filters.attackPointsMin !== undefined || filters.attackPointsMax !== undefined) {
      numericFilters.attackPoints = {};
      if (filters.attackPointsMin !== undefined) numericFilters.attackPoints.gte = filters.attackPointsMin;
      if (filters.attackPointsMax !== undefined) numericFilters.attackPoints.lte = filters.attackPointsMax;
    }
    Object.assign(whereClause, numericFilters);

    // Array filters (keywords and tags)
    if (filters.keywords && filters.keywords.length > 0) {
      whereClause.keywords = {
        hasEvery: filters.keywords
      };
    }
    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = {
        hasEvery: filters.tags
      };
    }

    // Include relations if requested
    const include = includeRelations ? {
      type: true,
      rarity: true,
      set: true,
      rulings: true
    } : undefined;

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'name') orderBy.name = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else if (sortBy === 'setNumber') orderBy.setNumber = sortOrder;
    else orderBy[sortBy] = sortOrder;

    // Execute queries
    const [cards, total] = await Promise.all([
      db.card.findMany({
        where: whereClause,
        include,
        skip,
        take: limit,
        orderBy
      }) as Promise<CardWithRelations[]>,
      db.card.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      cards,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Get a single card by ID
   */
  static async getCardById(id: string, includeRelations = true): Promise<CardWithRelations | null> {
    const db = await getDatabaseClient();

    const include = includeRelations ? {
      type: true,
      rarity: true,
      set: true,
      rulings: true
    } : undefined;

    return db.card.findUnique({
      where: { id },
      include
    }) as Promise<CardWithRelations | null>;
  }

  /**
   * Get a single card by set and number
   */
  static async getCardBySetAndNumber(
    setId: string,
    setNumber: string,
    includeRelations = true
  ): Promise<CardWithRelations | null> {
    const db = await getDatabaseClient();

    const include = includeRelations ? {
      type: true,
      rarity: true,
      set: true,
      rulings: true
    } : undefined;

    return db.card.findUnique({
      where: {
        setId_setNumber: {
          setId,
          setNumber
        }
      },
      include
    }) as Promise<CardWithRelations | null>;
  }

  /**
   * Create a new card
   */
  static async createCard(data: CreateCardData): Promise<CardWithRelations> {
    const db = await getDatabaseClient();

    // Validate data first
    const validation = CardValidator.validateCreateData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Create the card
    const card = await db.card.create({
      data: {
        ...data,
        keywords: data.keywords || [],
        tags: data.tags || [],
        language: data.language || 'en'
      },
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true
      }
    }) as CardWithRelations;

    return card;
  }

  /**
   * Update an existing card
   */
  static async updateCard(data: UpdateCardData): Promise<CardWithRelations> {
    const db = await getDatabaseClient();

    // Validate data first
    const validation = CardValidator.validateUpdateData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const { id, ...updateData } = data;

    // Update the card
    const card = await db.card.update({
      where: { id },
      data: updateData,
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true
      }
    }) as CardWithRelations;

    return card;
  }

  /**
   * Delete a card
   */
  static async deleteCard(id: string): Promise<boolean> {
    const db = await getDatabaseClient();

    try {
      await db.card.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cards by IDs
   */
  static async getCardsByIds(ids: string[], includeRelations = true): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    const include = includeRelations ? {
      type: true,
      rarity: true,
      set: true,
      rulings: true
    } : undefined;

    return db.card.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include
    }) as Promise<CardWithRelations[]>;
  }

  /**
   * Get random cards
   */
  static async getRandomCards(count = 10, includeRelations = true): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    const include = includeRelations ? {
      type: true,
      rarity: true,
      set: true,
      rulings: true
    } : undefined;

    // Get total count first
    const total = await db.card.count();
    if (total === 0) return [];

    // Generate random skip values
    const randomCards: CardWithRelations[] = [];
    const usedSkips = new Set<number>();

    while (randomCards.length < count && usedSkips.size < total) {
      const skip = Math.floor(Math.random() * total);
      if (usedSkips.has(skip)) continue;

      usedSkips.add(skip);

      const card = await db.card.findFirst({
        skip,
        take: 1,
        include
      }) as CardWithRelations | null;

      if (card) {
        randomCards.push(card);
      }
    }

    return randomCards;
  }

  /**
   * Get cards by faction
   */
  static async getCardsByFaction(faction: string, limit = 20): Promise<CardWithRelations[]> {
    return this.searchCards(
      { faction },
      { limit, includeRelations: true }
    ).then(result => result.cards);
  }

  /**
   * Get cards by series
   */
  static async getCardsBySeries(series: string, limit = 20): Promise<CardWithRelations[]> {
    return this.searchCards(
      { series },
      { limit, includeRelations: true }
    ).then(result => result.cards);
  }

  /**
   * Get cards by type
   */
  static async getCardsByType(typeId: string, limit = 20): Promise<CardWithRelations[]> {
    return this.searchCards(
      { typeId },
      { limit, includeRelations: true }
    ).then(result => result.cards);
  }

  /**
   * Get cards by rarity
   */
  static async getCardsByRarity(rarityId: string, limit = 20): Promise<CardWithRelations[]> {
    return this.searchCards(
      { rarityId },
      { limit, includeRelations: true }
    ).then(result => result.cards);
  }

  /**
   * Get cards by set
   */
  static async getCardsBySet(setId: string, limit = 100): Promise<CardWithRelations[]> {
    return this.searchCards(
      { setId },
      { limit, sortBy: 'setNumber', sortOrder: 'asc', includeRelations: true }
    ).then(result => result.cards);
  }

  /**
   * Search cards by text (name, description, official text)
   */
  static async searchCardsByText(query: string, limit = 20): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    return db.card.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { officialText: { contains: query, mode: 'insensitive' } },
          { pilot: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    }) as Promise<CardWithRelations[]>;
  }

  /**
   * Get card statistics
   */
  static async getCardStatistics() {
    const db = await getDatabaseClient();

    // Get all cards for statistics
    const cards = await db.card.findMany({
      include: {
        type: true,
        rarity: true,
        set: true
      }
    }) as CardWithRelations[];

    return CardUtils.calculateStats(cards);
  }

  /**
   * Bulk import cards
   */
  static async bulkImportCards(cardsData: CreateCardData[]): Promise<{
    successful: CardWithRelations[];
    failed: Array<{ data: CreateCardData; error: string }>;
  }> {
    const successful: CardWithRelations[] = [];
    const failed: Array<{ data: CreateCardData; error: string }> = [];

    for (const cardData of cardsData) {
      try {
        const card = await this.createCard(cardData);
        successful.push(card);
      } catch (error) {
        failed.push({
          data: cardData,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { successful, failed };
  }
}

/**
 * Helper functions for common card operations
 */
export const CardHelpers = {
  /**
   * Format card display name
   */
  formatDisplayName: (card: CardWithRelations) => new CardModel(card).getDisplayName(),

  /**
   * Get card power level
   */
  getPowerLevel: (card: CardWithRelations) => new CardModel(card).getPowerLevel(),

  /**
   * Check if card matches filters
   */
  matchesFilters: (card: CardWithRelations, filters: CardSearchFilters) =>
    new CardModel(card).matchesFilters(filters),

  /**
   * Get sortable value for card
   */
  getSortableValue: (card: CardWithRelations, field: string) =>
    new CardModel(card).getSortableValue(field as any),

  /**
   * Validate card data
   */
  validateCard: CardValidator.validateCreateData,

  /**
   * Generate card tags
   */
  generateTags: CardUtils.generateCardTags,

  /**
   * Extract keywords from text
   */
  extractKeywords: CardUtils.extractKeywordsFromText,

  /**
   * Create image info
   */
  createImageInfo: CardUtils.createImageInfo
};

// Export the service for use in other modules
export default CardService;