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
  CardSortField,
} from '../types/card';
import { CardModel, CardValidator, CardUtils } from '../models/card';
import { DatabaseOptimizationService } from './databaseOptimizationService';
import { searchCache } from './searchCacheService';
import { searchAnalytics } from './searchAnalyticsService';

// Get the optimization service instance
const dbOptimizer = DatabaseOptimizationService.getInstance();

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
    options: CardSearchOptions = {},
    context: {
      sessionId?: string;
      userId?: string;
      source?: 'manual' | 'suggestion' | 'filter' | 'sort';
      userAgent?: string;
      referer?: string;
    } = {}
  ): Promise<CardSearchResult> {
    const startTime = Date.now();

    // Try to get from cache first
    const cachedResult = await searchCache.get(filters, options);
    if (cachedResult) {
      // Track cache hit
      const responseTime = Date.now() - startTime;
      await searchAnalytics.trackSearch(
        filters,
        options,
        cachedResult.total,
        responseTime,
        { ...context, source: context.source || 'manual' }
      );

      return cachedResult;
    }

    // If not in cache, query database with monitoring
    const result = await dbOptimizer.monitorQuery(
      'search-cards',
      async () => {
        const db = await getDatabaseClient();
        const {
          page = 1,
          limit = 20,
          sortBy: _sortBy = 'name',
          sortOrder: _sortOrder = 'asc',
          includeRelations = true,
        } = options;

        const skip = (page - 1) * limit;

        // Use optimized query builder
        const { where: whereClause, orderBy } =
          dbOptimizer.buildOptimizedCardQuery(filters, options);

        // Include relations if requested
        const include = includeRelations
          ? {
              type: true,
              rarity: true,
              set: true,
              rulings: true,
            }
          : undefined;

        // Execute queries
        const [cards, total] = await Promise.all([
          db.card.findMany({
            where: whereClause,
            include,
            skip,
            take: limit,
            orderBy: orderBy as any, // TODO: Fix buildOptimizedCardQuery to return proper Prisma types
          }) as Promise<CardWithRelations[]>,
          db.card.count({ where: whereClause }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
          cards,
          total,
          page,
          limit,
          totalPages,
        };
      },
      {
        filters: filters as Record<string, unknown>,
        options: options as Record<string, unknown>,
      } // TODO: Update monitorQuery to accept proper types
    );

    // Track the search analytics
    const responseTime = Date.now() - startTime;
    await searchAnalytics.trackSearch(
      filters as CardSearchFilters,
      options as CardSearchOptions,
      result.total,
      responseTime,
      { ...context, source: context.source || 'manual' }
    );

    // Cache the result for future requests
    await searchCache.set(filters, options, result);

    return result;
  }

  /**
   * Get a single card by ID
   */
  static async getCardById(
    id: string,
    includeRelations = true
  ): Promise<CardWithRelations | null> {
    const db = await getDatabaseClient();

    const include = includeRelations
      ? {
          type: true,
          rarity: true,
          set: true,
          rulings: true,
        }
      : undefined;

    return db.card.findUnique({
      where: { id },
      include,
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

    const include = includeRelations
      ? {
          type: true,
          rarity: true,
          set: true,
          rulings: true,
        }
      : undefined;

    return db.card.findUnique({
      where: {
        setId_setNumber: {
          setId,
          setNumber,
        },
      },
      include,
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
    const card = (await db.card.create({
      data: {
        ...data,
        keywords: data.keywords || [],
        tags: data.tags || [],
        language: data.language || 'en',
      },
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true,
      },
    })) as CardWithRelations;

    // Invalidate related cache entries
    await searchCache.invalidateByFilters({
      typeId: card.typeId,
      rarityId: card.rarityId,
      setId: card.setId,
      faction: card.faction || undefined,
      series: card.series || undefined,
      nation: card.nation || undefined,
    });

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

    // Get the existing card to know which cache entries to invalidate
    const existingCard = await db.card.findUnique({
      where: { id },
      select: {
        typeId: true,
        rarityId: true,
        setId: true,
        faction: true,
        series: true,
        nation: true,
      },
    });

    // Update the card
    const card = (await db.card.update({
      where: { id },
      data: updateData,
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true,
      },
    })) as CardWithRelations;

    // Invalidate cache entries for both old and new values
    if (existingCard) {
      await searchCache.invalidateByFilters({
        typeId: existingCard.typeId,
        rarityId: existingCard.rarityId,
        setId: existingCard.setId,
        faction: existingCard.faction || undefined,
        series: existingCard.series || undefined,
        nation: existingCard.nation || undefined,
      });
    }

    await searchCache.invalidateByFilters({
      typeId: card.typeId,
      rarityId: card.rarityId,
      setId: card.setId,
      faction: card.faction || undefined,
      series: card.series || undefined,
      nation: card.nation || undefined,
    });

    return card;
  }

  /**
   * Delete a card
   */
  static async deleteCard(id: string): Promise<boolean> {
    const db = await getDatabaseClient();

    try {
      // Get the card details before deleting to invalidate cache
      const cardToDelete = await db.card.findUnique({
        where: { id },
        select: {
          typeId: true,
          rarityId: true,
          setId: true,
          faction: true,
          series: true,
          nation: true,
        },
      });

      await db.card.delete({
        where: { id },
      });

      // Invalidate cache entries
      if (cardToDelete) {
        await searchCache.invalidateByFilters({
          typeId: cardToDelete.typeId,
          rarityId: cardToDelete.rarityId,
          setId: cardToDelete.setId,
          faction: cardToDelete.faction || undefined,
          series: cardToDelete.series || undefined,
          nation: cardToDelete.nation || undefined,
        });
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cards by IDs
   */
  static async getCardsByIds(
    ids: string[],
    includeRelations = true
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    const include = includeRelations
      ? {
          type: true,
          rarity: true,
          set: true,
          rulings: true,
        }
      : undefined;

    return db.card.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include,
    }) as Promise<CardWithRelations[]>;
  }

  /**
   * Get random cards
   */
  static async getRandomCards(
    count = 10,
    includeRelations = true
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    const include = includeRelations
      ? {
          type: true,
          rarity: true,
          set: true,
          rulings: true,
        }
      : undefined;

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

      const card = (await db.card.findFirst({
        skip,
        take: 1,
        include,
      })) as CardWithRelations | null;

      if (card) {
        randomCards.push(card);
      }
    }

    return randomCards;
  }

  /**
   * Get cards by faction
   */
  static async getCardsByFaction(
    faction: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    return this.searchCards(
      { faction },
      { limit, includeRelations: true }
    ).then((result) => result.cards);
  }

  /**
   * Get cards by series
   */
  static async getCardsBySeries(
    series: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    return this.searchCards({ series }, { limit, includeRelations: true }).then(
      (result) => result.cards
    );
  }

  /**
   * Get cards by type
   */
  static async getCardsByType(
    typeId: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    return this.searchCards({ typeId }, { limit, includeRelations: true }).then(
      (result) => result.cards
    );
  }

  /**
   * Get cards by rarity
   */
  static async getCardsByRarity(
    rarityId: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    return this.searchCards(
      { rarityId },
      { limit, includeRelations: true }
    ).then((result) => result.cards);
  }

  /**
   * Get cards by set
   */
  static async getCardsBySet(
    setId: string,
    limit = 100
  ): Promise<CardWithRelations[]> {
    return this.searchCards(
      { setId },
      { limit, sortBy: 'setNumber', sortOrder: 'asc', includeRelations: true }
    ).then((result) => result.cards);
  }

  /**
   * Search cards by text (name, description, official text)
   */
  static async searchCardsByText(
    query: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();

    return db.card.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { officialText: { contains: query, mode: 'insensitive' } },
          { pilot: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        type: true,
        rarity: true,
        set: true,
        rulings: true,
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    }) as Promise<CardWithRelations[]>;
  }

  /**
   * Get card statistics
   */
  static async getCardStatistics() {
    const db = await getDatabaseClient();

    // Get all cards for statistics
    const cards = (await db.card.findMany({
      include: {
        type: true,
        rarity: true,
        set: true,
      },
    })) as CardWithRelations[];

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
          error: error instanceof Error ? error.message : 'Unknown error',
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
  formatDisplayName: (card: CardWithRelations) =>
    new CardModel(card).getDisplayName(),

  /**
   * Get card power level
   */
  getPowerLevel: (card: CardWithRelations) =>
    new CardModel(card).getPowerLevel(),

  /**
   * Check if card matches filters
   */
  matchesFilters: (card: CardWithRelations, filters: CardSearchFilters) =>
    new CardModel(card).matchesFilters(filters),

  /**
   * Get sortable value for card
   */
  getSortableValue: (card: CardWithRelations, field: string) =>
    new CardModel(card).getSortableValue(field as CardSortField),

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
  createImageInfo: CardUtils.createImageInfo,
};

// Export the service for use in other modules
export default CardService;
