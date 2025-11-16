/**
 * Optimized Query Builder
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';
import { buildWhereClause } from './filters';
import { buildOrderByClause } from './sorting';

export function buildOptimizedCardQuery(
  filters: CardSearchFilters,
  options: CardSearchOptions
) {
  return {
    where: buildWhereClause(filters),
    orderBy: buildOrderByClause(options),
  };
}
