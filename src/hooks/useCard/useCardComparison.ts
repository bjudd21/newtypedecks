/**
 * Hook for card comparison
 */

'use client';

import { useState, useCallback } from 'react';
import type { CardWithRelations } from '../../lib/types/card';

export function useCardComparison() {
  const [comparisonList, setComparisonList] = useState<CardWithRelations[]>([]);

  const addToComparison = useCallback((card: CardWithRelations) => {
    setComparisonList((prev) => {
      if (prev.find((c) => c.id === card.id)) return prev; // Already in comparison
      if (prev.length >= 4) return prev; // Max 4 cards for comparison
      return [...prev, card];
    });
  }, []);

  const removeFromComparison = useCallback((cardId: string) => {
    setComparisonList((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  const isInComparison = useCallback(
    (cardId: string) => {
      return comparisonList.some((card) => card.id === cardId);
    },
    [comparisonList]
  );

  const canAddMore = comparisonList.length < 4;

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore,
    count: comparisonList.length,
  };
}
