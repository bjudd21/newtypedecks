/**
 * API utilities for proxy generator card search
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export async function searchProxyCards(
  searchQuery: string,
  page: number
): Promise<{ cards: unknown[]; total: number; totalPages: number }> {
  const filters: CardSearchFilters = { name: searchQuery };
  const options: CardSearchOptions = {
    page,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc',
  };

  const response = await fetch('/api/cards/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters, options }),
  });

  if (!response.ok) throw new Error('Failed to search cards');
  return response.json();
}
