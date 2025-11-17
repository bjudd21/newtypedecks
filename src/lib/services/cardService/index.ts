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
} from '@/lib/types/card';
import {
  createCard,
  updateCard,
  deleteCard,
  getCardById,
  getCardBySetAndNumber,
  getCardsByIds,
  getRandomCards,
  searchCardsByText,
  getCardStatistics,
  searchCards,
  getCardsByFaction,
  getCardsBySeries,
  getCardsByType,
  getCardsByRarity,
  getCardsBySet,
  bulkImportCards,
} from './operations';
import { CardHelpers } from './helpers';

// Initialize Prisma client
let prisma: PrismaClient;

// Database client getter
const getDatabaseClient = async () => {
  if (!prisma) {
    const { prisma: dbClient } = await import('@/lib/database');
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
    const db = await getDatabaseClient();
    return searchCards(db, filters, options, context);
  }

  /**
   * Get a single card by ID
   */
  static async getCardById(
    id: string,
    includeRelations = true
  ): Promise<CardWithRelations | null> {
    const db = await getDatabaseClient();
    return getCardById(db, id, includeRelations);
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
    return getCardBySetAndNumber(db, setId, setNumber, includeRelations);
  }

  /**
   * Create a new card
   */
  static async createCard(data: CreateCardData): Promise<CardWithRelations> {
    const db = await getDatabaseClient();
    return createCard(db, data);
  }

  /**
   * Update an existing card
   */
  static async updateCard(data: UpdateCardData): Promise<CardWithRelations> {
    const db = await getDatabaseClient();
    return updateCard(db, data);
  }

  /**
   * Delete a card
   */
  static async deleteCard(id: string): Promise<boolean> {
    const db = await getDatabaseClient();
    return deleteCard(db, id);
  }

  /**
   * Get cards by IDs
   */
  static async getCardsByIds(
    ids: string[],
    includeRelations = true
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsByIds(db, ids, includeRelations);
  }

  /**
   * Get random cards
   */
  static async getRandomCards(
    count = 10,
    includeRelations = true
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getRandomCards(db, count, includeRelations);
  }

  /**
   * Get cards by faction
   */
  static async getCardsByFaction(
    faction: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsByFaction(db, faction, limit);
  }

  /**
   * Get cards by series
   */
  static async getCardsBySeries(
    series: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsBySeries(db, series, limit);
  }

  /**
   * Get cards by type
   */
  static async getCardsByType(
    typeId: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsByType(db, typeId, limit);
  }

  /**
   * Get cards by rarity
   */
  static async getCardsByRarity(
    rarityId: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsByRarity(db, rarityId, limit);
  }

  /**
   * Get cards by set
   */
  static async getCardsBySet(
    setId: string,
    limit = 100
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return getCardsBySet(db, setId, limit);
  }

  /**
   * Search cards by text (name, description, official text)
   */
  static async searchCardsByText(
    query: string,
    limit = 20
  ): Promise<CardWithRelations[]> {
    const db = await getDatabaseClient();
    return searchCardsByText(db, query, limit);
  }

  /**
   * Get card statistics
   */
  static async getCardStatistics() {
    const db = await getDatabaseClient();
    return getCardStatistics(db);
  }

  /**
   * Bulk import cards
   */
  static async bulkImportCards(cardsData: CreateCardData[]): Promise<{
    successful: CardWithRelations[];
    failed: Array<{ data: CreateCardData; error: string }>;
  }> {
    const db = await getDatabaseClient();
    return bulkImportCards(db, cardsData);
  }
}

// Export helpers and service
export { CardHelpers };
export default CardService;
