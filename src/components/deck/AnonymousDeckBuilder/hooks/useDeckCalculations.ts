/**
 * Custom hook for deck calculations
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  calculateDeckStats,
  groupCardsByType,
} from '@/lib/utils/deckCalculations';
import type { DeckStats, CardsByType } from '../types';

export function useDeckCalculations() {
  const { currentDeck } = useSelector((state: RootState) => state.decks);

  // Calculate deck statistics
  const stats: DeckStats = useMemo(() => {
    if (!currentDeck) {
      return { totalCards: 0, uniqueCards: 0, totalCost: 0 };
    }
    return calculateDeckStats(currentDeck.cards);
  }, [currentDeck]);

  // Group cards by type for better organization
  const cardsByType: CardsByType = useMemo(() => {
    if (!currentDeck) {
      return {};
    }
    return groupCardsByType(currentDeck.cards) as CardsByType;
  }, [currentDeck]);

  return {
    stats,
    cardsByType,
  };
}
