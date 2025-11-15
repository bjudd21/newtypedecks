/**
 * Competitive Rating Metric
 */

import type { DeckCard } from '../types';
import { calculateTotalCards } from '../utils/calculations';
import { calculateCardEfficiency } from './efficiency';
import { calculateDeckBalance } from './balance';
import { calculateSynergyScore } from './synergy';

export function calculateCompetitiveRating(deckCards: DeckCard[]): number {
  const efficiency = calculateCardEfficiency(deckCards);
  const balance = calculateDeckBalance(deckCards);
  const synergy = calculateSynergyScore(deckCards);
  const totalCards = calculateTotalCards(deckCards);

  // Deck size optimization (50-60 cards is optimal)
  let sizeScore = 100;
  if (totalCards < 40) sizeScore = 60;
  else if (totalCards < 50) sizeScore = 80;
  else if (totalCards <= 60) sizeScore = 100;
  else if (totalCards <= 70) sizeScore = 85;
  else sizeScore = 70;

  // Weighted average
  const weights = {
    efficiency: 0.25,
    balance: 0.25,
    synergy: 0.25,
    size: 0.25,
  };
  const rating =
    efficiency * weights.efficiency +
    balance * weights.balance +
    synergy * weights.synergy +
    sizeScore * weights.size;

  return Math.round(rating);
}
