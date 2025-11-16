/**
 * Basic Calculation Utilities
 */

import type { DeckCard } from '../types';

export function calculateTotalCards(deckCards: DeckCard[]): number {
  return deckCards.reduce((total, dc) => total + dc.quantity, 0);
}

export function calculateTotalCost(deckCards: DeckCard[]): number {
  return deckCards.reduce((total, dc) => {
    const cost = dc.card.cost || 0;
    return total + cost * dc.quantity;
  }, 0);
}

export function calculateAverageCost(deckCards: DeckCard[]): number {
  const totalCost = calculateTotalCost(deckCards);
  const totalCards = calculateTotalCards(deckCards);
  return totalCards > 0 ? Math.round((totalCost / totalCards) * 100) / 100 : 0;
}
