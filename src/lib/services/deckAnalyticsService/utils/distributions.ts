/**
 * Distribution Calculation Helper
 */

import type { DeckCard } from '../types';
import { calculateTotalCards } from './calculations';

type DistributionValue = { count: number; percentage: number };

export function calculateDistribution<T extends string | number>(
  deckCards: DeckCard[],
  getValue: (dc: DeckCard) => T
): Record<string, DistributionValue> {
  const totalCards = calculateTotalCards(deckCards);
  const valueMap: Record<string, number> = {};

  deckCards.forEach((dc) => {
    const value = String(getValue(dc));
    valueMap[value] = (valueMap[value] || 0) + dc.quantity;
  });

  return Object.entries(valueMap).reduce(
    (result, [key, count]) => {
      result[key] = {
        count,
        percentage: Math.round((count / totalCards) * 100 * 100) / 100,
      };
      return result;
    },
    {} as Record<string, DistributionValue>
  );
}
