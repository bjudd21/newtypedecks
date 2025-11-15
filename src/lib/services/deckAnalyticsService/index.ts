/**
 * Deck Analytics Service
 * Provides comprehensive deck analysis and meta-game statistics
 */

import type { DeckCard, DeckAnalytics } from './types';
import {
  calculateTotalCards,
  calculateAverageCost,
  calculateTotalCost,
} from './utils/calculations';
import {
  calculateTypeDistribution,
  calculateRarityDistribution,
  calculateCostDistribution,
  calculateFactionDistribution,
} from './statistics/distributions';
import { calculateCardEfficiency } from './metrics/efficiency';
import { calculateDeckBalance } from './metrics/balance';
import { calculateSynergyScore } from './metrics/synergy';
import { calculateCompetitiveRating } from './metrics/competitive';
import { generateSuggestions } from './recommendations/suggestions';
import { findMissingCards } from './recommendations/missingCards';
import { analyzeImprovements } from './recommendations/improvements';
import { getMetaGameData } from './meta/data';
import { compareDecks as compareDeckAnalytics } from './comparison/decks';

export type {
  DeckCard,
  DeckAnalytics,
  DeckSuggestion,
  DeckImprovement,
  MetaGameData,
} from './types';

class DeckAnalyticsService {
  /**
   * Analyze a complete deck for statistics and recommendations
   */
  analyzeDeck(deckCards: DeckCard[]): DeckAnalytics {
    const mainDeckCards = deckCards.filter((dc) => dc.category !== 'side');

    return {
      // Basic stats
      totalCards: calculateTotalCards(mainDeckCards),
      uniqueCards: mainDeckCards.length,
      averageCost: calculateAverageCost(mainDeckCards),
      totalCost: calculateTotalCost(mainDeckCards),

      // Distributions
      typeDistribution: calculateTypeDistribution(mainDeckCards),
      rarityDistribution: calculateRarityDistribution(mainDeckCards),
      costDistribution: calculateCostDistribution(mainDeckCards),
      factionDistribution: calculateFactionDistribution(mainDeckCards),

      // Advanced metrics
      cardEfficiency: calculateCardEfficiency(mainDeckCards),
      deckBalance: calculateDeckBalance(mainDeckCards),
      synergyScore: calculateSynergyScore(mainDeckCards),
      competitiveRating: calculateCompetitiveRating(mainDeckCards),

      // Recommendations
      suggestions: generateSuggestions(mainDeckCards),
      missingCards: findMissingCards(mainDeckCards),
      improvements: analyzeImprovements(mainDeckCards),
    };
  }

  /**
   * Meta-game analysis
   */
  async getMetaGameData() {
    return getMetaGameData();
  }

  /**
   * Compare two decks for analysis
   */
  compareDecks(deck1: DeckCard[], deck2: DeckCard[]) {
    const analytics1 = this.analyzeDeck(deck1);
    const analytics2 = this.analyzeDeck(deck2);
    return compareDeckAnalytics(analytics1, analytics2);
  }
}

export const deckAnalyticsService = new DeckAnalyticsService();
export default deckAnalyticsService;
