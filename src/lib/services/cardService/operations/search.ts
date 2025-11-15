/**
 * Search Operations for Cards
 */

import { PrismaClient } from '@prisma/client';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';
import { DatabaseOptimizationService } from '@/lib/services/databaseOptimizationService';
import { searchCache } from '@/lib/services/searchCacheService';
import { searchAnalytics } from '@/lib/services/searchAnalyticsService';

// Get the optimization service instance
const dbOptimizer = DatabaseOptimizationService.getInstance();

/**
 * Search cards with filters and pagination
 */
export async function searchCards(
  db: PrismaClient,
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
          orderBy: orderBy as unknown as Record<string, unknown>,
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
    }
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
