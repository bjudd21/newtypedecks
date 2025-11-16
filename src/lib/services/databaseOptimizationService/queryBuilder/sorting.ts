/**
 * Query Sorting Builders
 */

import type { CardSearchOptions } from '@/lib/types/card';

export function buildOrderByClause(options: CardSearchOptions): unknown[] {
  const orderBy: unknown[] = [];
  const sortBy = options.sortBy || 'name';
  const sortOrder = options.sortOrder || 'asc';

  // Use compound indexes for better performance
  switch (sortBy) {
    case 'name':
      orderBy.push({ name: sortOrder });
      if (sortOrder === 'asc') {
        orderBy.push({ createdAt: 'desc' }); // Secondary sort for consistency
      }
      break;

    case 'level':
      orderBy.push({ level: sortOrder });
      orderBy.push({ name: 'asc' }); // Secondary sort
      break;

    case 'cost':
      orderBy.push({ cost: sortOrder });
      orderBy.push({ name: 'asc' });
      break;

    case 'clashPoints':
      orderBy.push({ clashPoints: sortOrder });
      orderBy.push({ name: 'asc' });
      break;

    case 'createdAt':
      orderBy.push({ createdAt: sortOrder });
      orderBy.push({ name: 'asc' });
      break;

    default:
      // Default sort
      orderBy.push({ [sortBy]: sortOrder });
      orderBy.push({ name: 'asc' });
      break;
  }

  return orderBy;
}
