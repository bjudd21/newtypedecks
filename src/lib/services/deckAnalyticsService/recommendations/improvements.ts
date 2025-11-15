/**
 * Deck Improvements Analyzer
 */

import type { DeckCard, DeckImprovement } from '../types';
import { calculateTotalCards } from '../utils/calculations';
import {
  calculateCostDistribution,
  calculateTypeDistribution,
} from '../statistics/distributions';

export function analyzeImprovements(deckCards: DeckCard[]): DeckImprovement[] {
  const improvements: DeckImprovement[] = [];
  const costDist = calculateCostDistribution(deckCards);
  const typeDist = calculateTypeDistribution(deckCards);
  const totalCards = calculateTotalCards(deckCards);

  // Cost curve analysis
  const highCostCards = Object.entries(costDist)
    .filter(([cost]) => parseInt(cost) >= 6)
    .reduce((sum, [, data]) => sum + data.count, 0);

  if (highCostCards > totalCards * 0.2) {
    improvements.push({
      category: 'cost-curve',
      description: 'Deck has too many high-cost cards',
      severity: 'moderate',
      suggestion:
        'Consider replacing some high-cost cards with lower cost alternatives',
    });
  }

  // Card draw analysis
  const commandPercentage = typeDist.Command?.percentage || 0;
  if (commandPercentage < 15) {
    improvements.push({
      category: 'card-draw',
      description: 'Deck may lack card draw and utility',
      severity: 'minor',
      suggestion: 'Add more Command cards for card advantage and utility',
    });
  }

  return improvements;
}
