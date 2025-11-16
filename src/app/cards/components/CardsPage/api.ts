/**
 * API utilities for cards page
 */

import type {
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
} from '@/lib/types/card';

export async function fetchCardsPage(
  filters: CardSearchFilters,
  options: CardSearchOptions
): Promise<CardSearchResult> {
  const response = await fetch('/api/cards/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters, options }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
}
