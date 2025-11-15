/**
 * Query Builders for Collection Export
 *
 * Utilities for building Prisma query parameters
 */

import { Prisma } from '@prisma/client';

/**
 * Build where clause for collection cards based on filter options
 * @param filterBy - Filter type ('owned', 'complete', 'valuable', or undefined)
 * @returns Prisma where clause for filtering collection cards
 */
export function buildCollectionWhereClause(
  filterBy?: string | null
): Prisma.CollectionCardWhereInput {
  if (filterBy === 'owned' || filterBy === 'complete') {
    return { quantity: { gt: 0 } };
  }
  return {};
}

/**
 * Build include clause for collection export queries
 * Always includes card with its type, rarity, and set relations
 */
export function buildCollectionIncludeClause() {
  return {
    cards: {
      include: {
        card: {
          include: {
            type: true,
            rarity: true,
            set: true,
          },
        },
      },
      orderBy: [
        { card: { set: { name: 'asc' as const } } },
        { card: { setNumber: 'asc' as const } },
        { card: { name: 'asc' as const } },
      ],
    },
  };
}
