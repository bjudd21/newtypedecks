/**
 * Card Efficiency Metric
 */

import type { DeckCard } from '../types';

export function calculateCardEfficiency(deckCards: DeckCard[]): number {
  let totalEfficiency = 0;
  let cardCount = 0;

  deckCards.forEach((dc) => {
    const cost = dc.card.cost || 1;
    const attackPoints = dc.card.attackPoints || 0;
    const hitPoints = dc.card.hitPoints || 0;

    // Simple efficiency: (attackPoints + hitPoints) / cost
    const efficiency = cost > 0 ? (attackPoints + hitPoints) / cost : 0;
    totalEfficiency += efficiency * dc.quantity;
    cardCount += dc.quantity;
  });

  return cardCount > 0
    ? Math.round((totalEfficiency / cardCount) * 100) / 100
    : 0;
}
