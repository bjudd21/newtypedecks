/**
 * Deck Balance Metric
 */

import type { DeckCard } from '../types';
import {
  calculateCostDistribution,
  calculateTypeDistribution,
} from '../statistics/distributions';

export function calculateDeckBalance(deckCards: DeckCard[]): number {
  const costDist = calculateCostDistribution(deckCards);
  const typeDist = calculateTypeDistribution(deckCards);

  let costBalance = 0;
  let typeBalance = 0;

  // Cost curve balance (ideal: distributed across 0-6+ cost)
  const idealCostSpread = 7;
  const actualCostSpread = Object.keys(costDist).length;
  costBalance = Math.min(actualCostSpread / idealCostSpread, 1);

  // Type balance (no single type dominates too much)
  const typePercentages = Object.values(typeDist).map((t) => t.percentage);
  const maxTypePercentage = Math.max(...typePercentages);
  typeBalance =
    maxTypePercentage <= 50
      ? 1
      : Math.max(0, 1 - (maxTypePercentage - 50) / 50);

  return Math.round(((costBalance + typeBalance) / 2) * 100);
}
