/**
 * Hook for client-side card filtering and sorting
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CardWithRelations,
  CardSearchFilters,
  CardSortField,
  CardSortOrder,
} from '../../lib/types/card';
import { CardUtils } from '../../lib/models/card';

export function useCardFiltering(cards: CardWithRelations[]) {
  const [filteredCards, setFilteredCards] =
    useState<CardWithRelations[]>(cards);
  const [currentFilters, setCurrentFilters] = useState<CardSearchFilters>({});
  const [sortField, setSortField] = useState<CardSortField>('name');
  const [sortOrder, setSortOrder] = useState<CardSortOrder>('asc');

  const applyFilters = useCallback(
    (filters: CardSearchFilters) => {
      let filtered = CardUtils.filterCards(cards, filters);
      filtered = CardUtils.sortCards(filtered, sortField, sortOrder);
      setFilteredCards(filtered);
      setCurrentFilters(filters);
    },
    [cards, sortField, sortOrder]
  );

  const applySorting = useCallback(
    (field: CardSortField, order: CardSortOrder) => {
      const sorted = CardUtils.sortCards(filteredCards, field, order);
      setFilteredCards(sorted);
      setSortField(field);
      setSortOrder(order);
    },
    [filteredCards]
  );

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
    totalOriginal: cards.length,
  };
}
