/**
 * Custom React hooks for card operations
 *
 * These hooks provide reusable logic for card-related operations
 * that can be used across different components.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSearchOptions,
  CardSearchResult,
  CardSortField,
  CardSortOrder,
} from '../lib/types/card';
import { CardUtils } from '../lib/models/card';

/**
 * Hook for managing card search state and operations
 */
export function useCardSearch(initialFilters: CardSearchFilters = {}) {
  const [filters, setFilters] = useState<CardSearchFilters>(initialFilters);
  const [options, setOptions] = useState<CardSearchOptions>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc',
    includeRelations: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<CardSearchResult>({
    cards: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  const searchCards = useCallback(async (
    newFilters?: CardSearchFilters,
    newOptions?: CardSearchOptions
  ) => {
    const searchFilters = newFilters || filters;
    const searchOptions = { ...options, ...newOptions };

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cards/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: searchFilters,
          options: searchOptions
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const result: CardSearchResult = await response.json();
      setSearchResult(result);

      if (newFilters) setFilters(newFilters);
      if (newOptions) setOptions(prev => ({ ...prev, ...newOptions }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Card search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, options]);

  const updateFilters = useCallback((newFilters: Partial<CardSearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    searchCards(updatedFilters, { ...options, page: 1 }); // Reset to first page
  }, [filters, options, searchCards]);

  const updateOptions = useCallback((newOptions: Partial<CardSearchOptions>) => {
    const updatedOptions = { ...options, ...newOptions };
    setOptions(updatedOptions);
    searchCards(filters, updatedOptions);
  }, [filters, options, searchCards]);

  const clearFilters = useCallback(() => {
    const clearedFilters: CardSearchFilters = {};
    setFilters(clearedFilters);
    searchCards(clearedFilters, { ...options, page: 1 });
  }, [options, searchCards]);

  const nextPage = useCallback(() => {
    if (searchResult.page < searchResult.totalPages) {
      updateOptions({ page: searchResult.page + 1 });
    }
  }, [searchResult.page, searchResult.totalPages, updateOptions]);

  const previousPage = useCallback(() => {
    if (searchResult.page > 1) {
      updateOptions({ page: searchResult.page - 1 });
    }
  }, [searchResult.page, updateOptions]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= searchResult.totalPages) {
      updateOptions({ page });
    }
  }, [searchResult.totalPages, updateOptions]);

  const sortBy = useCallback((field: CardSortField, order?: CardSortOrder) => {
    const sortOrder = order || (options.sortBy === field && options.sortOrder === 'asc' ? 'desc' : 'asc');
    updateOptions({ sortBy: field, sortOrder });
  }, [options.sortBy, options.sortOrder, updateOptions]);

  // Initial search effect
  useEffect(() => {
    searchCards();
  }, []); // Only run once on mount

  return {
    // State
    filters,
    options,
    isLoading,
    error,
    searchResult,

    // Actions
    searchCards,
    updateFilters,
    updateOptions,
    clearFilters,
    nextPage,
    previousPage,
    goToPage,
    sortBy,

    // Computed values
    hasNextPage: searchResult.page < searchResult.totalPages,
    hasPreviousPage: searchResult.page > 1,
    isEmpty: searchResult.cards.length === 0 && !isLoading,
    totalCards: searchResult.total
  };
}

/**
 * Hook for managing a single card
 */
export function useCard(cardId: string | null) {
  const [card, setCard] = useState<CardWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cards/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Card not found');
        }
        throw new Error(`Failed to fetch card: ${response.statusText}`);
      }

      const cardData: CardWithRelations = await response.json();
      setCard(cardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch card');
      console.error('Card fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cardId) {
      fetchCard(cardId);
    } else {
      setCard(null);
      setError(null);
    }
  }, [cardId, fetchCard]);

  return {
    card,
    isLoading,
    error,
    refetch: () => cardId ? fetchCard(cardId) : null
  };
}

/**
 * Hook for card collection operations
 */
export function useCardCollection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCollection = useCallback(async (cardId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/collection/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to add card to collection: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card to collection');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCollection = useCallback(async (cardId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/collection/cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to remove card from collection: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove card from collection');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (cardId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/collection/cards', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to update card quantity: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    addToCollection,
    removeFromCollection,
    updateQuantity
  };
}

/**
 * Hook for deck building operations
 */
export function useDeckBuilder(deckId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToDeck = useCallback(async (cardId: string, quantity = 1, category = 'main') => {
    if (!deckId) throw new Error('No deck selected');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity, category })
      });

      if (!response.ok) {
        throw new Error(`Failed to add card to deck: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card to deck');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  const removeFromDeck = useCallback(async (cardId: string, quantity = 1) => {
    if (!deckId) throw new Error('No deck selected');

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, quantity })
      });

      if (!response.ok) {
        throw new Error(`Failed to remove card from deck: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove card from deck');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  return {
    isLoading,
    error,
    addToDeck,
    removeFromDeck,
    canAddToDeck: !!deckId
  };
}

/**
 * Hook for client-side card filtering and sorting
 */
export function useCardFiltering(cards: CardWithRelations[]) {
  const [filteredCards, setFilteredCards] = useState<CardWithRelations[]>(cards);
  const [currentFilters, setCurrentFilters] = useState<CardSearchFilters>({});
  const [sortField, setSortField] = useState<CardSortField>('name');
  const [sortOrder, setSortOrder] = useState<CardSortOrder>('asc');

  const applyFilters = useCallback((filters: CardSearchFilters) => {
    let filtered = CardUtils.filterCards(cards, filters);
    filtered = CardUtils.sortCards(filtered, sortField, sortOrder);
    setFilteredCards(filtered);
    setCurrentFilters(filters);
  }, [cards, sortField, sortOrder]);

  const applySorting = useCallback((field: CardSortField, order: CardSortOrder) => {
    const sorted = CardUtils.sortCards(filteredCards, field, order);
    setFilteredCards(sorted);
    setSortField(field);
    setSortOrder(order);
  }, [filteredCards]);

  const clearFilters = useCallback(() => {
    const sorted = CardUtils.sortCards(cards, sortField, sortOrder);
    setFilteredCards(sorted);
    setCurrentFilters({});
  }, [cards, sortField, sortOrder]);

  // Update filtered cards when original cards change
  useEffect(() => {
    if (Object.keys(currentFilters).length > 0) {
      applyFilters(currentFilters);
    } else {
      const sorted = CardUtils.sortCards(cards, sortField, sortOrder);
      setFilteredCards(sorted);
    }
  }, [cards, currentFilters, sortField, sortOrder, applyFilters]);

  const statistics = useMemo(() => {
    return CardUtils.calculateStats(filteredCards);
  }, [filteredCards]);

  return {
    filteredCards,
    currentFilters,
    sortField,
    sortOrder,
    statistics,
    applyFilters,
    applySorting,
    clearFilters,
    hasFilters: Object.keys(currentFilters).length > 0,
    totalFiltered: filteredCards.length,
    totalOriginal: cards.length
  };
}

/**
 * Hook for card comparison
 */
export function useCardComparison() {
  const [comparisonList, setComparisonList] = useState<CardWithRelations[]>([]);

  const addToComparison = useCallback((card: CardWithRelations) => {
    setComparisonList(prev => {
      if (prev.find(c => c.id === card.id)) return prev; // Already in comparison
      if (prev.length >= 4) return prev; // Max 4 cards for comparison
      return [...prev, card];
    });
  }, []);

  const removeFromComparison = useCallback((cardId: string) => {
    setComparisonList(prev => prev.filter(card => card.id !== cardId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const isInComparison = useCallback((cardId: string) => {
    return comparisonList.some(card => card.id === cardId);
  }, [comparisonList]);

  const canAddMore = comparisonList.length < 4;

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    count: comparisonList.length
  };
}