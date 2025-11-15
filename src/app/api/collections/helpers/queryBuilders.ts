/**
 * Query Builders for Collections API
 *
 * Utilities for building Prisma query parameters
 */

import type { PrismaCardWhere } from '@/lib/types';

/**
 * Build where clause for card filtering in collections
 * @param search - Search term for name/description
 * @param rarity - Rarity filter
 * @param type - Card type filter
 * @param faction - Faction filter
 * @returns Prisma where clause for card filtering
 */
export function buildCardWhereClause(
  search?: string | null,
  rarity?: string | null,
  type?: string | null,
  faction?: string | null
): PrismaCardWhere {
  const cardWhere: PrismaCardWhere = {};

  if (search) {
    cardWhere.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (rarity) {
    cardWhere.rarity = { is: { name: rarity } };
  }

  if (type) {
    cardWhere.type = { is: { name: type } };
  }

  if (faction) {
    cardWhere.faction = faction;
  }

  return cardWhere;
}

/**
 * Parse pagination parameters from query string
 * @param pageParam - Page number parameter
 * @param limitParam - Limit parameter
 * @returns Parsed page, limit, and skip values
 */
export function parsePaginationParams(
  pageParam?: string | null,
  limitParam?: string | null
) {
  const page = parseInt(pageParam || '1');
  const limit = parseInt(limitParam || '20');
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
