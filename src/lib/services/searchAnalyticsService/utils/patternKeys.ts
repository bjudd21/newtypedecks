/**
 * Pattern Key Generation
 */

import type { CardSearchFilters } from '@/lib/types/card';

/**
 * Generate a consistent key from search filters
 */
export function generatePatternKey(filters: CardSearchFilters): string {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce(
      (obj, key) => {
        const value = filters[key as keyof CardSearchFilters];
        if (value !== undefined && value !== null && value !== '') {
          (obj as Record<string, unknown>)[key] = value;
        }
        return obj;
      },
      {} as Record<string, unknown>
    );

  return JSON.stringify(sortedFilters);
}

/**
 * Convert pattern filters to readable query string
 */
export function patternToReadableQuery(
  filters: Partial<CardSearchFilters>
): string {
  const parts: string[] = [];

  if (filters.name) parts.push(`"${filters.name}"`);

  // Game-specific string filters — derive label from key name to avoid hardcoding
  // game-specific field names (e.g. Gundam's faction/pilot, One Piece's color/power).
  const gameSpecificKeys = [
    'faction',
    'series',
    'pilot',
    'nation',
    'model',
  ] as const;
  for (const key of gameSpecificKeys) {
    const val = filters[key as keyof typeof filters];
    if (val) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      parts.push(`${label}: ${val}`);
    }
  }

  if (filters.levelMin || filters.levelMax) {
    const min = filters.levelMin || 0;
    const max = filters.levelMax || '∞';
    parts.push(`Level: ${min}-${max}`);
  }

  return parts.join(', ') || 'All cards';
}
