/**
 * Distribution Statistics
 */

import type { DeckCard } from '../types';
import { calculateDistribution } from '../utils/distributions';

export function calculateTypeDistribution(
  deckCards: DeckCard[]
): Record<string, { count: number; percentage: number }> {
  return calculateDistribution(
    deckCards,
    (dc) => dc.card.type?.name || 'Unknown'
  );
}

export function calculateRarityDistribution(
  deckCards: DeckCard[]
): Record<string, { count: number; percentage: number }> {
  return calculateDistribution(
    deckCards,
    (dc) => dc.card.rarity?.name || 'Unknown'
  );
}

export function calculateCostDistribution(
  deckCards: DeckCard[]
): Record<number, { count: number; percentage: number }> {
  return calculateDistribution(deckCards, (dc) => dc.card.cost || 0);
}

export function calculateFactionDistribution(
  deckCards: DeckCard[]
): Record<string, { count: number; percentage: number }> {
  return calculateDistribution(deckCards, (dc) => dc.card.faction || 'Neutral');
}
