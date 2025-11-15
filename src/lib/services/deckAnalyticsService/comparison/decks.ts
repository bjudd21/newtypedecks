/**
 * Deck Comparison
 */

import type { DeckCard, DeckAnalytics } from '../types';

export function compareDecks(
  analytics1: DeckAnalytics,
  analytics2: DeckAnalytics
) {
  return {
    deck1: analytics1,
    deck2: analytics2,
    comparison: {
      efficiencyDiff: analytics1.cardEfficiency - analytics2.cardEfficiency,
      balanceDiff: analytics1.deckBalance - analytics2.deckBalance,
      synergyDiff: analytics1.synergyScore - analytics2.synergyScore,
      competitiveDiff:
        analytics1.competitiveRating - analytics2.competitiveRating,
    },
  };
}
