/**
 * API utilities for card search
 */

import type { CardWithRelations, CardSearchFilters } from '@/lib/types/card';
import type { SearchSuggestion } from '@/components/ui/Search';

export async function fetchCardSuggestions(
  query: string,
  maxSuggestions: number
): Promise<SearchSuggestion[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch('/api/cards/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          name: query,
        },
        options: {
          page: 1,
          limit: maxSuggestions,
          sortBy: 'name',
          sortOrder: 'asc',
          includeRelations: true,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.cards.map((card: CardWithRelations) => ({
        id: card.id,
        label: card.name,
        value: card.name,
        category: card.type?.name || 'Card',
      }));
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch card suggestions:', error);
    return [];
  }
}

export async function performCardSearch(
  query: string,
  searchFilters: CardSearchFilters = {}
): Promise<CardWithRelations[]> {
  try {
    const searchQuery: CardSearchFilters = {
      ...searchFilters,
    };

    // If there's a text query, search across name, pilot, and model
    if (query.trim()) {
      searchQuery.name = query.trim();
    }

    const response = await fetch('/api/cards/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: searchQuery,
        options: {
          page: 1,
          limit: 50,
          sortBy: 'name',
          sortOrder: 'asc',
          includeRelations: true,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.cards;
    }

    return [];
  } catch (error) {
    console.error('Failed to perform card search:', error);
    return [];
  }
}
