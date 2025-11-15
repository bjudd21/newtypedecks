/**
 * Statistics Calculators for Collections
 *
 * Utilities for calculating collection statistics
 */

import { prisma } from '@/lib/database';

export interface CollectionStatistics {
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
}

/**
 * Calculate collection statistics for a user
 * @param userId - User ID
 * @returns Collection statistics including total cards, unique cards, and completion percentage
 */
export async function calculateCollectionStatistics(
  userId: string
): Promise<CollectionStatistics> {
  const [userStats, totalCards] = await Promise.all([
    prisma.collectionCard.aggregate({
      where: {
        collection: {
          userId,
        },
      },
      _sum: { quantity: true },
      _count: { id: true },
    }),
    prisma.card.count(),
  ]);

  return {
    totalCards: userStats._sum?.quantity || 0,
    uniqueCards: userStats._count?.id || 0,
    completionPercentage:
      totalCards > 0
        ? Math.round(((userStats._count?.id || 0) / totalCards) * 100)
        : 0,
  };
}

/**
 * Get empty collection response for users without collections
 * @param userId - User ID
 * @param page - Current page
 * @param limit - Items per page
 * @returns Empty collection structure
 */
export function getEmptyCollectionResponse(
  userId: string,
  page: number,
  limit: number
) {
  return {
    collection: {
      userId,
      cards: [],
      statistics: {
        totalCards: 0,
        uniqueCards: 0,
        completionPercentage: 0,
      },
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    },
  };
}
