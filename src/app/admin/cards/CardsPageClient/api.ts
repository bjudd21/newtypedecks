/**
 * API functions for admin cards management
 */

import type { Card, PaginationData } from './types';

interface LoadCardsResponse {
  success: boolean;
  cards: Card[];
  pagination: PaginationData;
}

export async function loadCards(
  page: number,
  searchQuery: string,
  gameSlug: string
): Promise<{ cards: Card[]; pagination: PaginationData } | null> {
  if (!gameSlug) return null;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      gameSlug,
    });

    if (searchQuery) {
      params.append('search', searchQuery);
    }

    const response = await fetch(`/api/cards?${params.toString()}`);
    const data: LoadCardsResponse = await response.json();

    if (data.success) {
      return {
        cards: data.cards || [],
        pagination: {
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0,
          hasMore: data.pagination?.hasMore || false,
        },
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to load cards:', error);
    return null;
  }
}
