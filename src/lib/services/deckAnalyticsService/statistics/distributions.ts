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
  return calculateDistribution(deckCards, (dc) => {
    // faction lives in gameAttributes JSONB. Try `faction` (Gundam) then
    // `color` (One Piece) so this works across all supported games.
    const attrs = dc.card.gameAttributes;
    if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
      const a = attrs as Record<string, unknown>;
      const value = a.faction ?? a.color;
      if (typeof value === 'string' && value.trim() !== '') return value;
    }
    return 'Neutral';
  });
}
