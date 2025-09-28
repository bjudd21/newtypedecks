import { deckAnalyticsService, type DeckAnalytics, type DeckCard } from './deckAnalyticsService';
import type { CardWithRelations } from '@/lib/types/card';

export interface ComparisonDeck {
  id: string;
  name: string;
  description?: string;
  cards: DeckCard[];
  analytics?: DeckAnalytics;
}

export interface DeckComparison {
  decks: ComparisonDeck[];
  summary: ComparisonSummary;
  differences: DeckDifferences;
  recommendations: ComparisonRecommendation[];
  winrateAnalysis?: WinrateComparison;
}

export interface ComparisonSummary {
  totalDecks: number;
  averageCardCount: number;
  averageCost: number;
  commonCards: CardWithRelations[];
  uniqueCards: Record<string, CardWithRelations[]>;
  mostDiverseAspect: string;
  mostSimilarDecks: [string, string];
  mostDifferentDecks: [string, string];
}

export interface DeckDifferences {
  cardCount: Record<string, number>;
  averageCost: Record<string, number>;
  typeDistribution: Record<string, Record<string, { count: number; percentage: number }>>;
  rarityDistribution: Record<string, Record<string, { count: number; percentage: number }>>;
  competitiveRating: Record<string, number>;
  strengthsAndWeaknesses: Record<string, {
    strengths: string[];
    weaknesses: string[];
  }>;
}

export interface ComparisonRecommendation {
  type: 'card_swap' | 'cost_optimization' | 'type_balance' | 'synergy_improvement' | 'competitive_adjustment';
  title: string;
  description: string;
  targetDeck: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: number; // 1-100
  suggestedCards?: {
    add: CardWithRelations[];
    remove: CardWithRelations[];
  };
}

export interface WinrateComparison {
  predicted: Record<string, number>;
  matchups: Record<string, Record<string, number>>; // deck A vs deck B winrates
  metaAdvantages: Record<string, string[]>;
  metaWeaknesses: Record<string, string[]>;
}

class DeckComparisonService {
  /**
   * Compare multiple decks and generate comprehensive analysis
   */
  async compareDecks(decks: ComparisonDeck[]): Promise<DeckComparison> {
    if (decks.length < 2) {
      throw new Error('At least 2 decks are required for comparison');
    }

    // Generate analytics for each deck if not already provided
    const decksWithAnalytics = await Promise.all(
      decks.map(async (deck) => ({
        ...deck,
        analytics: deck.analytics || await deckAnalyticsService.analyzeDeck(deck.cards)
      }))
    );

    const summary = this.generateComparisonSummary(decksWithAnalytics);
    const differences = this.analyzeDeckDifferences(decksWithAnalytics);
    const recommendations = this.generateComparisonRecommendations(decksWithAnalytics, differences);
    const winrateAnalysis = this.analyzeWinrates(decksWithAnalytics);

    return {
      decks: decksWithAnalytics,
      summary,
      differences,
      recommendations,
      winrateAnalysis
    };
  }

  /**
   * Generate summary statistics for deck comparison
   */
  private generateComparisonSummary(decks: ComparisonDeck[]): ComparisonSummary {
    const totalCardCounts = decks.map(deck =>
      deck.cards.reduce((sum, card) => sum + card.quantity, 0)
    );

    const averageCardCount = totalCardCounts.reduce((sum, count) => sum + count, 0) / decks.length;
    const averageCost = decks.reduce((sum, deck) => sum + (deck.analytics?.averageCost || 0), 0) / decks.length;

    // Find common cards across all decks
    const allCards = decks.map(deck => deck.cards.map(c => c.card.id));
    const commonCardIds = allCards[0] ? allCards[0].filter(cardId =>
      allCards.every(deckCards => deckCards.includes(cardId))
    ) : [];

    const commonCards = decks.length > 0 && commonCardIds.length > 0 ? decks[0].cards
      .filter(card => commonCardIds.includes(card.card.id))
      .map(card => card.card) : [];

    // Find unique cards per deck
    const uniqueCards: Record<string, CardWithRelations[]> = {};
    decks.forEach(deck => {
      const otherDecks = decks.filter(d => d.id !== deck.id);
      const otherCardIds = otherDecks.flatMap(d => d.cards.map(c => c.card.id));

      uniqueCards[deck.id] = deck.cards
        .filter(card => !otherCardIds.includes(card.card.id))
        .map(card => card.card);
    });

    // Find most diverse aspect by analyzing variance
    const aspects = ['typeDistribution', 'rarityDistribution', 'costDistribution'];
    let maxVariance = 0;
    let mostDiverseAspect = 'typeDistribution';

    aspects.forEach(aspect => {
      const variance = this.calculateDistributionVariance(decks, aspect);
      if (variance > maxVariance) {
        maxVariance = variance;
        mostDiverseAspect = aspect;
      }
    });

    // Find most similar and different decks
    const similarities = this.calculateDeckSimilarities(decks);
    const mostSimilarPair = this.findMostSimilarDecks(similarities);
    const mostDifferentPair = this.findMostDifferentDecks(similarities);

    return {
      totalDecks: decks.length,
      averageCardCount,
      averageCost,
      commonCards,
      uniqueCards,
      mostDiverseAspect,
      mostSimilarDecks: mostSimilarPair,
      mostDifferentDecks: mostDifferentPair
    };
  }

  /**
   * Analyze differences between decks
   */
  private analyzeDeckDifferences(decks: ComparisonDeck[]): DeckDifferences {
    const cardCount: Record<string, number> = {};
    const averageCost: Record<string, number> = {};
    const typeDistribution: Record<string, Record<string, { count: number; percentage: number }>> = {};
    const rarityDistribution: Record<string, Record<string, { count: number; percentage: number }>> = {};
    const competitiveRating: Record<string, number> = {};
    const strengthsAndWeaknesses: Record<string, { strengths: string[]; weaknesses: string[] }> = {};

    decks.forEach(deck => {
      cardCount[deck.id] = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
      averageCost[deck.id] = deck.analytics?.averageCost || 0;
      typeDistribution[deck.id] = deck.analytics?.typeDistribution || {};
      rarityDistribution[deck.id] = deck.analytics?.rarityDistribution || {};
      competitiveRating[deck.id] = deck.analytics?.competitiveRating || 0;

      // Analyze strengths and weaknesses
      const analytics = deck.analytics;
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (analytics) {
        if (analytics.competitiveRating >= 80) strengths.push('High competitive potential');
        if (analytics.deckBalance >= 0.8) strengths.push('Well-balanced card distribution');
        if (analytics.synergyScore >= 0.75) strengths.push('Strong card synergies');
        if (analytics.cardEfficiency >= 0.8) strengths.push('Efficient card choices');

        if (analytics.competitiveRating < 60) weaknesses.push('Low competitive viability');
        if (analytics.deckBalance < 0.6) weaknesses.push('Unbalanced card distribution');
        if (analytics.synergyScore < 0.5) weaknesses.push('Limited card synergies');
        if (analytics.cardEfficiency < 0.6) weaknesses.push('Inefficient card choices');
        if (cardCount[deck.id] < 40) weaknesses.push('Below minimum deck size');
        if (cardCount[deck.id] > 80) weaknesses.push('Oversized deck may lack consistency');
      }

      strengthsAndWeaknesses[deck.id] = { strengths, weaknesses };
    });

    return {
      cardCount,
      averageCost,
      typeDistribution,
      rarityDistribution,
      competitiveRating,
      strengthsAndWeaknesses
    };
  }

  /**
   * Generate recommendations based on deck comparison
   */
  private generateComparisonRecommendations(
    decks: ComparisonDeck[],
    differences: DeckDifferences
  ): ComparisonRecommendation[] {
    const recommendations: ComparisonRecommendation[] = [];

    decks.forEach(deck => {
      const analytics = deck.analytics;
      if (!analytics) return;

      // Cost optimization recommendations
      const avgCost = differences.averageCost[deck.id];
      const overallAvg = Object.values(differences.averageCost).reduce((sum, cost) => sum + cost, 0) / decks.length;

      if (avgCost > overallAvg + 0.5) {
        recommendations.push({
          type: 'cost_optimization',
          title: 'Consider Lower Cost Cards',
          description: `This deck has a higher average cost (${avgCost.toFixed(1)}) than others. Consider replacing some high-cost cards with more efficient alternatives.`,
          targetDeck: deck.id,
          priority: 'medium',
          impact: Math.min(85, Math.floor((avgCost - overallAvg) * 20))
        });
      }

      // Competitive rating recommendations
      const rating = differences.competitiveRating[deck.id];
      const maxRating = Math.max(...Object.values(differences.competitiveRating));

      if (rating < maxRating - 10) {
        recommendations.push({
          type: 'competitive_adjustment',
          title: 'Improve Competitive Rating',
          description: `This deck scores ${rating}/100 while the best deck in comparison scores ${maxRating}/100. Focus on card synergies and meta-relevant choices.`,
          targetDeck: deck.id,
          priority: rating < 50 ? 'high' : 'medium',
          impact: Math.floor(maxRating - rating)
        });
      }

      // Type balance recommendations
      const typeDistrib = differences.typeDistribution[deck.id];
      const totalCards = Object.values(typeDistrib).reduce((sum, data) => sum + data.count, 0);

      if (totalCards > 0) {
        const dominantType = Object.entries(typeDistrib)
          .reduce((max, [type, data]) => data.count > max.count ? { type, count: data.count } : max, { type: '', count: 0 });

        if (dominantType.count / totalCards > 0.7) {
          recommendations.push({
            type: 'type_balance',
            title: 'Diversify Card Types',
            description: `Over 70% of cards are ${dominantType.type}. Consider adding more variety for better strategic options.`,
            targetDeck: deck.id,
            priority: 'low',
            impact: 40
          });
        }
      }

      // Synergy improvements
      if (analytics.synergyScore < 0.6) {
        recommendations.push({
          type: 'synergy_improvement',
          title: 'Enhance Card Synergies',
          description: `Synergy score is ${(analytics.synergyScore * 100).toFixed(0)}%. Look for cards that work better together or support similar strategies.`,
          targetDeck: deck.id,
          priority: 'medium',
          impact: Math.floor((0.8 - analytics.synergyScore) * 100)
        });
      }
    });

    // Sort by priority and impact
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.impact - a.impact;
    });
  }

  /**
   * Analyze predicted winrates and matchups
   */
  private analyzeWinrates(decks: ComparisonDeck[]): WinrateComparison {
    const predicted: Record<string, number> = {};
    const matchups: Record<string, Record<string, number>> = {};
    const metaAdvantages: Record<string, string[]> = {};
    const metaWeaknesses: Record<string, string[]> = {};

    decks.forEach(deck => {
      const analytics = deck.analytics;
      if (!analytics) return;

      // Predict overall winrate based on competitive rating and balance
      const baseWinrate = 50; // Base 50% winrate
      const ratingBonus = (analytics.competitiveRating - 50) * 0.3; // Rating impact
      const balanceBonus = (analytics.deckBalance - 0.5) * 20; // Balance impact
      const synergyBonus = (analytics.synergyScore - 0.5) * 15; // Synergy impact

      predicted[deck.id] = Math.max(20, Math.min(80,
        baseWinrate + ratingBonus + balanceBonus + synergyBonus
      ));

      // Initialize matchup matrix
      matchups[deck.id] = {};
      metaAdvantages[deck.id] = [];
      metaWeaknesses[deck.id] = [];
    });

    // Calculate head-to-head matchups
    decks.forEach(deckA => {
      decks.forEach(deckB => {
        if (deckA.id === deckB.id) {
          matchups[deckA.id][deckB.id] = 50; // Mirror match
          return;
        }

        const analyticsA = deckA.analytics;
        const analyticsB = deckB.analytics;

        if (!analyticsA || !analyticsB) {
          matchups[deckA.id][deckB.id] = 50;
          return;
        }

        // Calculate matchup based on deck characteristics
        let advantage = 0;

        // Speed advantage (lower cost decks vs higher cost)
        const costDiff = analyticsB.averageCost - analyticsA.averageCost;
        if (costDiff > 1) advantage += 5; // Faster deck advantage
        if (costDiff < -1) advantage -= 5; // Slower deck disadvantage

        // Balance vs focus matchup
        const balanceDiff = analyticsA.deckBalance - analyticsB.deckBalance;
        if (balanceDiff > 0.2) advantage += 3; // More balanced deck slight advantage

        // Competitive rating impact
        const ratingDiff = analyticsA.competitiveRating - analyticsB.competitiveRating;
        advantage += ratingDiff * 0.2;

        // Convert advantage to winrate (50% base + advantage)
        matchups[deckA.id][deckB.id] = Math.max(25, Math.min(75, 50 + advantage));
      });
    });

    // Determine meta advantages and weaknesses
    decks.forEach(deck => {
      const analytics = deck.analytics;
      if (!analytics) return;

      const advantages: string[] = [];
      const weaknesses: string[] = [];

      // Analyze type distribution for meta calls
      const typeDistrib = analytics.typeDistribution;
      const dominantTypes = Object.entries(typeDistrib)
        .filter(([_, data]) => data.percentage > 30)
        .map(([type, _]) => type);

      if (dominantTypes.includes('Mobile Suit')) {
        advantages.push('Strong against control strategies');
        weaknesses.push('Vulnerable to removal-heavy decks');
      }

      if (dominantTypes.includes('Command')) {
        advantages.push('Good utility and versatility');
        advantages.push('Strong late-game presence');
      }

      if (analytics.averageCost < 2.5) {
        advantages.push('Fast early game pressure');
        weaknesses.push('May struggle in long games');
      } else if (analytics.averageCost > 4) {
        advantages.push('Powerful late-game threats');
        weaknesses.push('Slow start vulnerability');
      }

      metaAdvantages[deck.id] = advantages;
      metaWeaknesses[deck.id] = weaknesses;
    });

    return {
      predicted,
      matchups,
      metaAdvantages,
      metaWeaknesses
    };
  }

  /**
   * Calculate distribution variance for finding most diverse aspect
   */
  private calculateDistributionVariance(decks: ComparisonDeck[], aspect: string): number {
    const distributions = decks.map(deck => {
      const analytics = deck.analytics;
      if (!analytics) return {};

      switch (aspect) {
        case 'typeDistribution':
          return analytics.typeDistribution;
        case 'rarityDistribution':
          return analytics.rarityDistribution;
        case 'costDistribution':
          return analytics.costDistribution;
        default:
          return {};
      }
    });

    // Calculate variance in distribution percentages
    const allKeys = Array.from(new Set(distributions.flatMap(dist => Object.keys(dist))));
    let totalVariance = 0;

    allKeys.forEach(key => {
      const values = distributions.map(dist => {
        // Handle both string and number keys (for costDistribution vs typeDistribution/rarityDistribution)
        const entry = dist[key] || dist[parseInt(key, 10)];
        return entry && typeof entry === 'object' && 'percentage' in entry ? entry.percentage : 0;
      });
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      totalVariance += variance;
    });

    return totalVariance;
  }

  /**
   * Calculate similarity scores between all deck pairs
   */
  private calculateDeckSimilarities(decks: ComparisonDeck[]): Record<string, Record<string, number>> {
    const similarities: Record<string, Record<string, number>> = {};

    decks.forEach(deckA => {
      similarities[deckA.id] = {};

      decks.forEach(deckB => {
        if (deckA.id === deckB.id) {
          similarities[deckA.id][deckB.id] = 100;
          return;
        }

        // Calculate similarity based on shared cards, cost, and distribution
        const cardsA = new Set(deckA.cards.map(c => c.card.id));
        const cardsB = new Set(deckB.cards.map(c => c.card.id));
        const sharedCards = new Set(Array.from(cardsA).filter(id => cardsB.has(id)));

        const cardSimilarity = sharedCards.size / Math.max(cardsA.size, cardsB.size) * 100;

        const analyticsA = deckA.analytics;
        const analyticsB = deckB.analytics;

        let costSimilarity = 100;
        if (analyticsA && analyticsB) {
          const costDiff = Math.abs(analyticsA.averageCost - analyticsB.averageCost);
          costSimilarity = Math.max(0, 100 - costDiff * 20);
        }

        // Average the similarities
        similarities[deckA.id][deckB.id] = (cardSimilarity + costSimilarity) / 2;
      });
    });

    return similarities;
  }

  /**
   * Find the most similar pair of decks
   */
  private findMostSimilarDecks(similarities: Record<string, Record<string, number>>): [string, string] {
    let maxSimilarity = 0;
    let mostSimilarPair: [string, string] = ['', ''];

    Object.entries(similarities).forEach(([deckAId, deckASimilarities]) => {
      Object.entries(deckASimilarities).forEach(([deckBId, similarity]) => {
        if (deckAId !== deckBId && similarity > maxSimilarity) {
          maxSimilarity = similarity;
          mostSimilarPair = [deckAId, deckBId];
        }
      });
    });

    return mostSimilarPair;
  }

  /**
   * Find the most different pair of decks
   */
  private findMostDifferentDecks(similarities: Record<string, Record<string, number>>): [string, string] {
    let minSimilarity = 100;
    let mostDifferentPair: [string, string] = ['', ''];

    Object.entries(similarities).forEach(([deckAId, deckASimilarities]) => {
      Object.entries(deckASimilarities).forEach(([deckBId, similarity]) => {
        if (deckAId !== deckBId && similarity < minSimilarity) {
          minSimilarity = similarity;
          mostDifferentPair = [deckAId, deckBId];
        }
      });
    });

    return mostDifferentPair;
  }

  /**
   * Compare two specific decks in detail
   */
  async compareTwoDecks(deckA: ComparisonDeck, deckB: ComparisonDeck): Promise<{
    deckA: ComparisonDeck & { analytics: DeckAnalytics };
    deckB: ComparisonDeck & { analytics: DeckAnalytics };
    sharedCards: CardWithRelations[];
    uniqueToA: CardWithRelations[];
    uniqueToB: CardWithRelations[];
    winrateAdvantage: number;
    keyDifferences: string[];
    recommendations: string[];
  }> {
    const analyticsA = deckA.analytics || await deckAnalyticsService.analyzeDeck(deckA.cards);
    const analyticsB = deckB.analytics || await deckAnalyticsService.analyzeDeck(deckB.cards);

    const cardsA = new Set(deckA.cards.map(c => c.card.id));
    const cardsB = new Set(deckB.cards.map(c => c.card.id));

    const sharedCardIds = new Set(Array.from(cardsA).filter(id => cardsB.has(id)));
    const uniqueToAIds = new Set(Array.from(cardsA).filter(id => !cardsB.has(id)));
    const uniqueToBIds = new Set(Array.from(cardsB).filter(id => !cardsA.has(id)));

    const sharedCards = deckA.cards.filter(c => sharedCardIds.has(c.card.id)).map(c => c.card);
    const uniqueToA = deckA.cards.filter(c => uniqueToAIds.has(c.card.id)).map(c => c.card);
    const uniqueToB = deckB.cards.filter(c => uniqueToBIds.has(c.card.id)).map(c => c.card);

    // Calculate winrate advantage
    const ratingDiff = analyticsA.competitiveRating - analyticsB.competitiveRating;
    const costAdvantage = analyticsB.averageCost - analyticsA.averageCost > 1 ? 5 : 0; // Speed advantage
    const winrateAdvantage = ratingDiff * 0.3 + costAdvantage;

    // Key differences
    const keyDifferences: string[] = [];
    if (Math.abs(analyticsA.averageCost - analyticsB.averageCost) > 1) {
      keyDifferences.push(`Significant cost difference: ${analyticsA.averageCost.toFixed(1)} vs ${analyticsB.averageCost.toFixed(1)}`);
    }
    if (Math.abs(analyticsA.competitiveRating - analyticsB.competitiveRating) > 15) {
      keyDifferences.push(`Competitive rating gap: ${analyticsA.competitiveRating} vs ${analyticsB.competitiveRating}`);
    }
    if (sharedCardIds.size / Math.max(cardsA.size, cardsB.size) < 0.3) {
      keyDifferences.push('Very different card choices with low overlap');
    }

    // Recommendations
    const recommendations: string[] = [];
    if (analyticsA.competitiveRating < analyticsB.competitiveRating) {
      recommendations.push(`Consider adopting successful cards from ${deckB.name}`);
    }
    if (uniqueToB.length > uniqueToA.length) {
      recommendations.push(`${deckB.name} has more unique strategic options`);
    }

    return {
      deckA: { ...deckA, analytics: analyticsA },
      deckB: { ...deckB, analytics: analyticsB },
      sharedCards,
      uniqueToA,
      uniqueToB,
      winrateAdvantage,
      keyDifferences,
      recommendations
    };
  }
}

export const deckComparisonService = new DeckComparisonService();