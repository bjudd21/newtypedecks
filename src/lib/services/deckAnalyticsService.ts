/**
 * Deck Analytics Service
 * Provides comprehensive deck analysis and meta-game statistics
 */

import { CardWithRelations } from '@/lib/types/card';

export interface DeckCard {
  card: CardWithRelations;
  quantity: number;
  category?: 'main' | 'side' | 'extra';
}

export interface DeckAnalytics {
  // Basic Statistics
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
  totalCost: number;

  // Distribution Analysis
  typeDistribution: Record<string, { count: number; percentage: number }>;
  rarityDistribution: Record<string, { count: number; percentage: number }>;
  costDistribution: Record<number, { count: number; percentage: number }>;
  factionDistribution: Record<string, { count: number; percentage: number }>;

  // Advanced Metrics
  cardEfficiency: number;
  deckBalance: number;
  synergyScore: number;
  competitiveRating: number;

  // Recommendations
  suggestions: DeckSuggestion[];
  missingCards: CardWithRelations[];
  improvements: DeckImprovement[];
}

export interface DeckSuggestion {
  type: 'add' | 'remove' | 'replace';
  card?: CardWithRelations;
  targetCard?: CardWithRelations;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  impact: number;
}

export interface DeckImprovement {
  category: 'cost-curve' | 'card-draw' | 'removal' | 'finishers' | 'synergy';
  description: string;
  severity: 'minor' | 'moderate' | 'critical';
  suggestion: string;
}

export interface MetaGameData {
  popularCards: Array<{
    card: CardWithRelations;
    usageRate: number;
    winRate: number;
    decksUsed: number;
  }>;

  popularArchetypes: Array<{
    name: string;
    description: string;
    usageRate: number;
    winRate: number;
    keyCards: CardWithRelations[];
  }>;

  trendingCards: Array<{
    card: CardWithRelations;
    trendDirection: 'up' | 'down' | 'stable';
    changePercent: number;
    periodDays: number;
  }>;

  metaBreakdown: {
    controlDecks: number;
    aggroDecks: number;
    midrangeDecks: number;
    comboDecks: number;
  };
}

class DeckAnalyticsService {

  /**
   * Analyze a complete deck for statistics and recommendations
   */
  analyzeDeck(deckCards: DeckCard[]): DeckAnalytics {
    const mainDeckCards = deckCards.filter(dc => dc.category !== 'side');

    return {
      // Basic stats
      totalCards: this.calculateTotalCards(mainDeckCards),
      uniqueCards: mainDeckCards.length,
      averageCost: this.calculateAverageCost(mainDeckCards),
      totalCost: this.calculateTotalCost(mainDeckCards),

      // Distributions
      typeDistribution: this.calculateTypeDistribution(mainDeckCards),
      rarityDistribution: this.calculateRarityDistribution(mainDeckCards),
      costDistribution: this.calculateCostDistribution(mainDeckCards),
      factionDistribution: this.calculateFactionDistribution(mainDeckCards),

      // Advanced metrics
      cardEfficiency: this.calculateCardEfficiency(mainDeckCards),
      deckBalance: this.calculateDeckBalance(mainDeckCards),
      synergyScore: this.calculateSynergyScore(mainDeckCards),
      competitiveRating: this.calculateCompetitiveRating(mainDeckCards),

      // Recommendations
      suggestions: this.generateSuggestions(mainDeckCards),
      missingCards: this.findMissingCards(mainDeckCards),
      improvements: this.analyzeImprovements(mainDeckCards),
    };
  }

  /**
   * Basic Statistics Calculations
   */
  private calculateTotalCards(deckCards: DeckCard[]): number {
    return deckCards.reduce((total, dc) => total + dc.quantity, 0);
  }

  private calculateAverageCost(deckCards: DeckCard[]): number {
    const totalCost = this.calculateTotalCost(deckCards);
    const totalCards = this.calculateTotalCards(deckCards);
    return totalCards > 0 ? Math.round((totalCost / totalCards) * 100) / 100 : 0;
  }

  private calculateTotalCost(deckCards: DeckCard[]): number {
    return deckCards.reduce((total, dc) => {
      const cost = dc.card.cost || 0;
      return total + (cost * dc.quantity);
    }, 0);
  }

  /**
   * Distribution Analysis
   */
  private calculateTypeDistribution(deckCards: DeckCard[]): Record<string, { count: number; percentage: number }> {
    const totalCards = this.calculateTotalCards(deckCards);
    const typeMap: Record<string, number> = {};

    deckCards.forEach(dc => {
      const type = dc.card.type?.name || 'Unknown';
      typeMap[type] = (typeMap[type] || 0) + dc.quantity;
    });

    return Object.entries(typeMap).reduce((result, [type, count]) => {
      result[type] = {
        count,
        percentage: Math.round((count / totalCards) * 100 * 100) / 100
      };
      return result;
    }, {} as Record<string, { count: number; percentage: number }>);
  }

  private calculateRarityDistribution(deckCards: DeckCard[]): Record<string, { count: number; percentage: number }> {
    const totalCards = this.calculateTotalCards(deckCards);
    const rarityMap: Record<string, number> = {};

    deckCards.forEach(dc => {
      const rarity = dc.card.rarity?.name || 'Unknown';
      rarityMap[rarity] = (rarityMap[rarity] || 0) + dc.quantity;
    });

    return Object.entries(rarityMap).reduce((result, [rarity, count]) => {
      result[rarity] = {
        count,
        percentage: Math.round((count / totalCards) * 100 * 100) / 100
      };
      return result;
    }, {} as Record<string, { count: number; percentage: number }>);
  }

  private calculateCostDistribution(deckCards: DeckCard[]): Record<number, { count: number; percentage: number }> {
    const totalCards = this.calculateTotalCards(deckCards);
    const costMap: Record<number, number> = {};

    deckCards.forEach(dc => {
      const cost = dc.card.cost || 0;
      costMap[cost] = (costMap[cost] || 0) + dc.quantity;
    });

    return Object.entries(costMap).reduce((result, [cost, count]) => {
      result[parseInt(cost)] = {
        count,
        percentage: Math.round((count / totalCards) * 100 * 100) / 100
      };
      return result;
    }, {} as Record<number, { count: number; percentage: number }>);
  }

  private calculateFactionDistribution(deckCards: DeckCard[]): Record<string, { count: number; percentage: number }> {
    const totalCards = this.calculateTotalCards(deckCards);
    const factionMap: Record<string, number> = {};

    deckCards.forEach(dc => {
      const faction = dc.card.faction || 'Neutral';
      factionMap[faction] = (factionMap[faction] || 0) + dc.quantity;
    });

    return Object.entries(factionMap).reduce((result, [faction, count]) => {
      result[faction] = {
        count,
        percentage: Math.round((count / totalCards) * 100 * 100) / 100
      };
      return result;
    }, {} as Record<string, { count: number; percentage: number }>);
  }

  /**
   * Advanced Metrics
   */
  private calculateCardEfficiency(deckCards: DeckCard[]): number {
    // Calculate efficiency based on cost-to-value ratio
    let totalEfficiency = 0;
    let cardCount = 0;

    deckCards.forEach(dc => {
      const cost = dc.card.cost || 1;
      const power = dc.card.power || 0;
      const toughness = dc.card.toughness || 0;

      // Simple efficiency: (power + toughness) / cost
      const efficiency = cost > 0 ? (power + toughness) / cost : 0;
      totalEfficiency += efficiency * dc.quantity;
      cardCount += dc.quantity;
    });

    return cardCount > 0 ? Math.round((totalEfficiency / cardCount) * 100) / 100 : 0;
  }

  private calculateDeckBalance(deckCards: DeckCard[]): number {
    const costDist = this.calculateCostDistribution(deckCards);
    const typeDist = this.calculateTypeDistribution(deckCards);

    // Calculate balance based on distribution evenness
    let costBalance = 0;
    let typeBalance = 0;

    // Cost curve balance (ideal: distributed across 0-6+ cost)
    const idealCostSpread = 7;
    const actualCostSpread = Object.keys(costDist).length;
    costBalance = Math.min(actualCostSpread / idealCostSpread, 1);

    // Type balance (no single type dominates too much)
    const typePercentages = Object.values(typeDist).map(t => t.percentage);
    const maxTypePercentage = Math.max(...typePercentages);
    typeBalance = maxTypePercentage <= 50 ? 1 : Math.max(0, 1 - (maxTypePercentage - 50) / 50);

    return Math.round(((costBalance + typeBalance) / 2) * 100);
  }

  private calculateSynergyScore(deckCards: DeckCard[]): number {
    // Simplified synergy calculation based on faction consistency and type synergies
    const factionDist = this.calculateFactionDistribution(deckCards);
    const typeDist = this.calculateTypeDistribution(deckCards);

    // Faction synergy: higher score for consistent faction choices
    const factionEntries = Object.values(factionDist);
    const dominantFaction = Math.max(...factionEntries.map(f => f.percentage));
    const factionSynergy = dominantFaction >= 60 ? 0.8 : dominantFaction / 100;

    // Type synergy: bonus for good type distribution
    const hasUnits = 'Unit' in typeDist && typeDist.Unit.percentage >= 30;
    const hasCommands = 'Command' in typeDist && typeDist.Command.percentage >= 15;
    const hasPilots = 'Pilot' in typeDist && typeDist.Pilot.percentage >= 10;

    let typeSynergy = 0.5;
    if (hasUnits) typeSynergy += 0.2;
    if (hasCommands) typeSynergy += 0.15;
    if (hasPilots) typeSynergy += 0.15;

    return Math.round(((factionSynergy + typeSynergy) / 2) * 100);
  }

  private calculateCompetitiveRating(deckCards: DeckCard[]): number {
    // Competitive rating based on multiple factors
    const efficiency = this.calculateCardEfficiency(deckCards);
    const balance = this.calculateDeckBalance(deckCards);
    const synergy = this.calculateSynergyScore(deckCards);
    const totalCards = this.calculateTotalCards(deckCards);

    // Deck size optimization (50-60 cards is optimal)
    let sizeScore = 100;
    if (totalCards < 40) sizeScore = 60;
    else if (totalCards < 50) sizeScore = 80;
    else if (totalCards <= 60) sizeScore = 100;
    else if (totalCards <= 70) sizeScore = 85;
    else sizeScore = 70;

    // Weighted average
    const weights = { efficiency: 0.25, balance: 0.25, synergy: 0.25, size: 0.25 };
    const rating = (
      efficiency * weights.efficiency +
      balance * weights.balance +
      synergy * weights.synergy +
      sizeScore * weights.size
    );

    return Math.round(rating);
  }

  /**
   * Recommendations and Improvements
   */
  private generateSuggestions(deckCards: DeckCard[]): DeckSuggestion[] {
    const suggestions: DeckSuggestion[] = [];
    const totalCards = this.calculateTotalCards(deckCards);
    const costDist = this.calculateCostDistribution(deckCards);

    // Deck size suggestions
    if (totalCards < 40) {
      suggestions.push({
        type: 'add',
        reason: 'Deck size is below minimum recommended size',
        priority: 'high',
        impact: 0.8
      });
    } else if (totalCards > 70) {
      suggestions.push({
        type: 'remove',
        reason: 'Deck size is too large, consider removing less impactful cards',
        priority: 'medium',
        impact: 0.6
      });
    }

    // Cost curve suggestions
    const lowCostCards = (costDist[0]?.count || 0) + (costDist[1]?.count || 0) + (costDist[2]?.count || 0);
    const lowCostPercentage = (lowCostCards / totalCards) * 100;

    if (lowCostPercentage < 25) {
      suggestions.push({
        type: 'add',
        reason: 'Consider adding more low-cost cards for early game consistency',
        priority: 'medium',
        impact: 0.5
      });
    }

    return suggestions;
  }

  private findMissingCards(deckCards: DeckCard[]): CardWithRelations[] {
    // Placeholder for missing card suggestions based on archetype
    // In a real implementation, this would analyze popular cards in similar decks
    return [];
  }

  private analyzeImprovements(deckCards: DeckCard[]): DeckImprovement[] {
    const improvements: DeckImprovement[] = [];
    const costDist = this.calculateCostDistribution(deckCards);
    const typeDist = this.calculateTypeDistribution(deckCards);
    const totalCards = this.calculateTotalCards(deckCards);

    // Cost curve analysis
    const highCostCards = Object.entries(costDist)
      .filter(([cost]) => parseInt(cost) >= 6)
      .reduce((sum, [, data]) => sum + data.count, 0);

    if (highCostCards > totalCards * 0.2) {
      improvements.push({
        category: 'cost-curve',
        description: 'Deck has too many high-cost cards',
        severity: 'moderate',
        suggestion: 'Consider replacing some high-cost cards with lower cost alternatives'
      });
    }

    // Card draw analysis
    const commandPercentage = typeDist.Command?.percentage || 0;
    if (commandPercentage < 15) {
      improvements.push({
        category: 'card-draw',
        description: 'Deck may lack card draw and utility',
        severity: 'minor',
        suggestion: 'Add more Command cards for card advantage and utility'
      });
    }

    return improvements;
  }

  /**
   * Meta-game analysis
   */
  async getMetaGameData(): Promise<MetaGameData> {
    // This would typically fetch from a database of recent games/decks
    // For now, return mock data structure
    return {
      popularCards: [],
      popularArchetypes: [
        {
          name: 'Federation Control',
          description: 'Control-based deck focusing on Earth Federation units',
          usageRate: 15.2,
          winRate: 58.3,
          keyCards: []
        },
        {
          name: 'Zeon Aggro',
          description: 'Fast aggressive deck using Zeon mobile suits',
          usageRate: 18.7,
          winRate: 52.1,
          keyCards: []
        }
      ],
      trendingCards: [],
      metaBreakdown: {
        controlDecks: 35,
        aggroDecks: 28,
        midrangeDecks: 25,
        comboDecks: 12
      }
    };
  }

  /**
   * Compare two decks for analysis
   */
  compareDecks(deck1: DeckCard[], deck2: DeckCard[]) {
    const analytics1 = this.analyzeDeck(deck1);
    const analytics2 = this.analyzeDeck(deck2);

    return {
      deck1: analytics1,
      deck2: analytics2,
      comparison: {
        efficiencyDiff: analytics1.cardEfficiency - analytics2.cardEfficiency,
        balanceDiff: analytics1.deckBalance - analytics2.deckBalance,
        synergyDiff: analytics1.synergyScore - analytics2.synergyScore,
        competitiveDiff: analytics1.competitiveRating - analytics2.competitiveRating,
      }
    };
  }
}

export const deckAnalyticsService = new DeckAnalyticsService();
export default deckAnalyticsService;