/**
 * Deck Suggestions Generator
 */

import type { DeckCard, DeckSuggestion } from '../types';
import { calculateTotalCards } from '../utils/calculations';
import { calculateCostDistribution } from '../statistics/distributions';

export function generateSuggestions(deckCards: DeckCard[]): DeckSuggestion[] {
  const suggestions: DeckSuggestion[] = [];
  const totalCards = calculateTotalCards(deckCards);
  const costDist = calculateCostDistribution(deckCards);

  // Deck size suggestions
  if (totalCards < 40) {
    suggestions.push({
      type: 'add',
      reason: 'Deck size is below minimum recommended size',
      priority: 'high',
      impact: 0.8,
    });
  } else if (totalCards > 70) {
    suggestions.push({
      type: 'remove',
      reason: 'Deck size is too large, consider removing less impactful cards',
      priority: 'medium',
      impact: 0.6,
    });
  }

  // Cost curve suggestions
  const lowCostCards =
    (costDist[0]?.count || 0) +
    (costDist[1]?.count || 0) +
    (costDist[2]?.count || 0);
  const lowCostPercentage = (lowCostCards / totalCards) * 100;

  if (lowCostPercentage < 25) {
    suggestions.push({
      type: 'add',
      reason: 'Consider adding more low-cost cards for early game consistency',
      priority: 'medium',
      impact: 0.5,
    });
  }

  return suggestions;
}
