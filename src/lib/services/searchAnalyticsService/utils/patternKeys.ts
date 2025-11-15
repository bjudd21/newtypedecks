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
  if (filters.faction) parts.push(`Faction: ${filters.faction}`);
  if (filters.series) parts.push(`Series: ${filters.series}`);
  if (filters.pilot) parts.push(`Pilot: ${filters.pilot}`);
  if (filters.levelMin || filters.levelMax) {
    const min = filters.levelMin || 0;
    const max = filters.levelMax || '∞';
    parts.push(`Level: ${min}-${max}`);
  }

  return parts.join(', ') || 'All cards';
}
