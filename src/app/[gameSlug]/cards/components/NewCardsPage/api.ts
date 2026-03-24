/**
 * API utilities for cards page
 */

import type { CardSearchFilters, CardSearchOptions } from '@/lib/types/card';

export async function fetchCards(
  filters: CardSearchFilters,
  options: CardSearchOptions,
  gameSlug: string
) {
  const response = await fetch(
    `/api/cards/search?gameSlug=${encodeURIComponent(gameSlug)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters, options }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }

  return response.json();
}

export async function fetchRandomCard() {
  const response = await fetch('/api/cards/random');
  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to fetch random card');
}
