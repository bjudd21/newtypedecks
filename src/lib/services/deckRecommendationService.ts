import { deckAnalyticsService, type DeckAnalytics, type DeckCard } from './deckAnalyticsService';
import { deckComparisonService, type ComparisonDeck } from './deckComparisonService';
import type { CardWithRelations } from '@/lib/types/card';

export interface UserPreferences {
  playStyle: 'aggressive' | 'control' | 'midrange' | 'combo' | 'balanced';
  favoriteTypes: string[];
  favoriteFactions: string[];
  preferredCostRange: [number, number];
  competitiveLevel: 'casual' | 'competitive' | 'tournament';
  deckSizePreference: 'minimal' | 'standard' | 'large';
  complexityPreference: 'simple' | 'moderate' | 'complex';
}

export interface DeckRecommendation {
  deck: RecommendedDeck;
  score: number;
  reasons: RecommendationReason[];
  matchPercentage: number;
  buildDifficulty: 'easy' | 'moderate' | 'hard';
  missingCards: {
    card: CardWithRelations;
    quantity: number;
    priority: 'essential' | 'important' | 'optional';
  }[];
  estimatedWinrate: number;
  metaPosition: 'top-tier' | 'competitive' | 'viable' | 'experimental';
}

export interface RecommendedDeck {
  id: string;
  name: string;
  description: string;
  cards: DeckCard[];
  archetype: string;
  totalCost: number;
  averageCost: number;
  analytics?: DeckAnalytics;
  isPublic: boolean;
  createdBy: string;
  popularity: number;
  recentWinrate: number;
}

export interface RecommendationReason {
  type: 'playstyle_match' | 'collection_synergy' | 'meta_advantage' | 'learning_opportunity' | 'upgrade_path' | 'budget_friendly';
  title: string;
  description: string;
  weight: number; // 0-1, how much this contributed to the recommendation
}

export interface UserCollection {
  cards: {
    cardId: string;
    card: CardWithRelations;
    quantity: number;
    condition?: string;
  }[];
  totalValue?: number;
  completionPercentage?: number;
}

export interface RecommendationFilters {
  maxMissingCards?: number;
  maxCost?: number;
  minWinrate?: number;
  excludeArchetypes?: string[];
  onlyFromCollection?: boolean;
  includeExperimental?: boolean;
}

class DeckRecommendationService {
  /**
   * Get personalized deck recommendations for a user
   */
  async getRecommendations(
    userPreferences: UserPreferences,
    userCollection?: UserCollection,
    currentDecks?: ComparisonDeck[],
    filters?: RecommendationFilters
  ): Promise<DeckRecommendation[]> {
    // In a real implementation, this would fetch from the database
    const availableDecks = await this.getAvailableDecks();

    const recommendations: DeckRecommendation[] = [];

    for (const deck of availableDecks) {
      // Calculate recommendation score
      const score = this.calculateRecommendationScore(
        deck,
        userPreferences,
        userCollection,
        currentDecks
      );

      // Skip decks with very low scores
      if (score < 0.3) continue;

      // Apply filters
      if (filters && !this.passesFilters(deck, filters, userCollection)) {
        continue;
      }

      // Generate analytics if not available
      if (!deck.analytics) {
        deck.analytics = await deckAnalyticsService.analyzeDeck(deck.cards);
      }

      // Calculate missing cards if user has a collection
      const missingCards = userCollection
        ? this.calculateMissingCards(deck, userCollection)
        : [];

      // Generate recommendation reasons
      const reasons = this.generateRecommendationReasons(
        deck,
        userPreferences,
        userCollection,
        currentDecks
      );

      // Calculate match percentage
      const matchPercentage = this.calculateMatchPercentage(deck, userPreferences);

      // Determine build difficulty
      const buildDifficulty = this.calculateBuildDifficulty(deck, userCollection);

      // Estimate winrate
      const estimatedWinrate = this.estimateWinrate(deck, userPreferences);

      // Determine meta position
      const metaPosition = this.determineMetaPosition(deck);

      const recommendation: DeckRecommendation = {
        deck,
        score,
        reasons,
        matchPercentage,
        buildDifficulty,
        missingCards,
        estimatedWinrate,
        metaPosition
      };

      recommendations.push(recommendation);
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Return top 20 recommendations
  }

  /**
   * Get upgrade recommendations for existing decks
   */
  async getDeckUpgrades(
    currentDeck: ComparisonDeck,
    userCollection?: UserCollection,
    budget?: number
  ): Promise<{
    cardUpgrades: {
      remove: CardWithRelations;
      add: CardWithRelations;
      reason: string;
      impact: number;
      cost: number;
    }[];
    sideboardSuggestions: {
      card: CardWithRelations;
      reason: string;
      matchups: string[];
    }[];
    overallImpact: number;
  }> {
    const currentAnalytics = currentDeck.analytics || await deckAnalyticsService.analyzeDeck(currentDeck.cards);

    const cardUpgrades = await this.generateCardUpgrades(currentDeck, userCollection, budget);
    const sideboardSuggestions = await this.generateSideboardSuggestions(currentDeck);

    // Calculate overall impact of upgrades
    const overallImpact = cardUpgrades.reduce((sum, upgrade) => sum + upgrade.impact, 0) / cardUpgrades.length;

    return {
      cardUpgrades,
      sideboardSuggestions,
      overallImpact
    };
  }

  /**
   * Get archetype recommendations based on user preferences
   */
  getArchetypeRecommendations(userPreferences: UserPreferences): {
    archetype: string;
    description: string;
    matchScore: number;
    keyCards: string[];
    playStyle: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[] {
    const archetypes = [
      {
        archetype: 'Aggro Rush',
        description: 'Fast, aggressive strategy focused on early pressure and quick wins',
        keyCards: ['Low-cost Mobile Suits', 'Direct damage cards', 'Speed boosters'],
        playStyle: 'aggressive',
        difficulty: 'beginner' as const,
        preferredTypes: ['Mobile Suit', 'Command'],
        costRange: [1, 3] as [number, number]
      },
      {
        archetype: 'Control Lock',
        description: 'Defensive strategy with removal and late-game threats',
        keyCards: ['Removal spells', 'Card draw', 'High-cost finishers'],
        playStyle: 'control',
        difficulty: 'advanced' as const,
        preferredTypes: ['Command', 'Character'],
        costRange: [3, 7] as [number, number]
      },
      {
        archetype: 'Midrange Value',
        description: 'Balanced approach with efficient threats and answers',
        keyCards: ['Versatile Mobile Suits', 'Value engines', 'Flexible answers'],
        playStyle: 'midrange',
        difficulty: 'intermediate' as const,
        preferredTypes: ['Mobile Suit', 'Command', 'Character'],
        costRange: [2, 5] as [number, number]
      },
      {
        archetype: 'Combo Engine',
        description: 'Synergy-based strategy with powerful card interactions',
        keyCards: ['Combo pieces', 'Card selection', 'Protection'],
        playStyle: 'combo',
        difficulty: 'advanced' as const,
        preferredTypes: ['Command', 'Mobile Suit'],
        costRange: [1, 6] as [number, number]
      }
    ];

    return archetypes
      .map(archetype => ({
        ...archetype,
        matchScore: this.calculateArchetypeMatch(archetype, userPreferences)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate recommendation score for a deck
   */
  private calculateRecommendationScore(
    deck: RecommendedDeck,
    preferences: UserPreferences,
    userCollection?: UserCollection,
    currentDecks?: ComparisonDeck[]
  ): number {
    let score = 0;

    // Base score from deck quality
    const analytics = deck.analytics;
    if (analytics) {
      score += analytics.competitiveRating * 0.3; // 30% weight for competitive rating
      score += analytics.deckBalance * 0.1; // 10% weight for balance
      score += analytics.synergyScore * 0.1; // 10% weight for synergy
    }

    // Play style match
    const playStyleMatch = this.calculatePlayStyleMatch(deck, preferences);
    score += playStyleMatch * 0.25; // 25% weight for play style

    // Type and faction preferences
    const typeMatch = this.calculateTypeMatch(deck, preferences.favoriteTypes);
    score += typeMatch * 0.1; // 10% weight for type preference

    // Cost curve preference
    const costMatch = this.calculateCostMatch(deck, preferences.preferredCostRange);
    score += costMatch * 0.05; // 5% weight for cost preference

    // Collection synergy
    if (userCollection) {
      const collectionMatch = this.calculateCollectionMatch(deck, userCollection);
      score += collectionMatch * 0.15; // 15% weight for collection match
    }

    // Diversity bonus (avoid recommending similar decks)
    if (currentDecks) {
      const diversityBonus = this.calculateDiversityBonus(deck, currentDecks);
      score += diversityBonus * 0.05; // 5% weight for diversity
    }

    // Popularity and meta relevance
    score += (deck.popularity / 100) * 0.03; // 3% weight for popularity
    score += (deck.recentWinrate / 100) * 0.02; // 2% weight for recent performance

    return Math.min(1, score); // Cap at 1.0
  }

  /**
   * Check if deck passes user-defined filters
   */
  private passesFilters(
    deck: RecommendedDeck,
    filters: RecommendationFilters,
    userCollection?: UserCollection
  ): boolean {
    if (filters.maxCost && deck.totalCost > filters.maxCost) {
      return false;
    }

    if (filters.minWinrate && deck.recentWinrate < filters.minWinrate) {
      return false;
    }

    if (filters.excludeArchetypes?.includes(deck.archetype)) {
      return false;
    }

    if (filters.maxMissingCards && userCollection) {
      const missingCards = this.calculateMissingCards(deck, userCollection);
      if (missingCards.length > filters.maxMissingCards) {
        return false;
      }
    }

    if (filters.onlyFromCollection && userCollection) {
      const missingCards = this.calculateMissingCards(deck, userCollection);
      if (missingCards.some(missing => missing.priority === 'essential')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate missing cards from user collection
   */
  private calculateMissingCards(
    deck: RecommendedDeck,
    userCollection: UserCollection
  ): DeckRecommendation['missingCards'] {
    const collectionMap = new Map(
      userCollection.cards.map(item => [item.cardId, item.quantity])
    );

    const missing: DeckRecommendation['missingCards'] = [];

    deck.cards.forEach(deckCard => {
      const owned = collectionMap.get(deckCard.card.id) || 0;
      const needed = deckCard.quantity;

      if (needed > owned) {
        const shortage = needed - owned;
        let priority: 'essential' | 'important' | 'optional' = 'important';

        // Determine priority based on card properties
        if (deckCard.card.rarity?.name === 'Rare' || deckCard.card.cost && deckCard.card.cost <= 2) {
          priority = 'essential';
        } else if (deckCard.card.rarity?.name === 'Uncommon') {
          priority = 'important';
        } else {
          priority = 'optional';
        }

        missing.push({
          card: deckCard.card,
          quantity: shortage,
          priority
        });
      }
    });

    return missing.sort((a, b) => {
      const priorityOrder = { essential: 3, important: 2, optional: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generate recommendation reasons
   */
  private generateRecommendationReasons(
    deck: RecommendedDeck,
    preferences: UserPreferences,
    userCollection?: UserCollection,
    currentDecks?: ComparisonDeck[]
  ): RecommendationReason[] {
    const reasons: RecommendationReason[] = [];

    // Play style match reason
    const playStyleMatch = this.calculatePlayStyleMatch(deck, preferences);
    if (playStyleMatch > 0.7) {
      reasons.push({
        type: 'playstyle_match',
        title: 'Matches Your Play Style',
        description: `This ${deck.archetype} deck aligns perfectly with your ${preferences.playStyle} preference`,
        weight: playStyleMatch * 0.3
      });
    }

    // Collection synergy reason
    if (userCollection) {
      const collectionMatch = this.calculateCollectionMatch(deck, userCollection);
      if (collectionMatch > 0.6) {
        reasons.push({
          type: 'collection_synergy',
          title: 'Uses Your Collection',
          description: `You already own ${Math.round(collectionMatch * 100)}% of the cards needed for this deck`,
          weight: collectionMatch * 0.25
        });
      }
    }

    // Meta advantage reason
    if (deck.recentWinrate > 65) {
      reasons.push({
        type: 'meta_advantage',
        title: 'Strong Meta Performance',
        description: `Currently performing well with ${deck.recentWinrate}% winrate in competitive play`,
        weight: 0.2
      });
    }

    // Learning opportunity reason
    if (preferences.competitiveLevel === 'casual' && deck.analytics?.competitiveRating && deck.analytics.competitiveRating > 70) {
      reasons.push({
        type: 'learning_opportunity',
        title: 'Great Learning Deck',
        description: 'Well-structured deck perfect for improving your skills and understanding game mechanics',
        weight: 0.15
      });
    }

    // Budget friendly reason
    if (deck.totalCost < 50) { // Assuming some cost threshold
      reasons.push({
        type: 'budget_friendly',
        title: 'Budget Friendly',
        description: 'Affordable deck that delivers competitive performance without breaking the bank',
        weight: 0.1
      });
    }

    return reasons.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Calculate play style match score
   */
  private calculatePlayStyleMatch(deck: RecommendedDeck, preferences: UserPreferences): number {
    const analytics = deck.analytics;
    if (!analytics) return 0.5;

    const avgCost = analytics.averageCost;

    switch (preferences.playStyle) {
      case 'aggressive':
        return avgCost <= 3 ? 0.9 : Math.max(0.1, 0.9 - (avgCost - 3) * 0.2);
      case 'control':
        return avgCost >= 4 ? 0.9 : Math.max(0.1, 0.9 - (4 - avgCost) * 0.25);
      case 'midrange':
        return avgCost >= 2.5 && avgCost <= 4.5 ? 0.9 : Math.max(0.1, 0.9 - Math.abs(avgCost - 3.5) * 0.2);
      case 'combo':
        return analytics.synergyScore > 0.7 ? 0.9 : analytics.synergyScore;
      case 'balanced':
        return analytics.deckBalance;
      default:
        return 0.5;
    }
  }

  /**
   * Calculate type preference match
   */
  private calculateTypeMatch(deck: RecommendedDeck, favoriteTypes: string[]): number {
    if (favoriteTypes.length === 0) return 0.5;

    const analytics = deck.analytics;
    if (!analytics) return 0.5;

    let totalMatch = 0;
    favoriteTypes.forEach(type => {
      const typeData = analytics.typeDistribution[type];
      if (typeData) {
        totalMatch += typeData.percentage / 100;
      }
    });

    return Math.min(1, totalMatch / favoriteTypes.length);
  }

  /**
   * Calculate cost range match
   */
  private calculateCostMatch(deck: RecommendedDeck, preferredRange: [number, number]): number {
    const avgCost = deck.averageCost;
    const [minCost, maxCost] = preferredRange;

    if (avgCost >= minCost && avgCost <= maxCost) {
      return 1;
    }

    // Calculate how far outside the preferred range
    const distance = avgCost < minCost ? minCost - avgCost : avgCost - maxCost;
    return Math.max(0, 1 - distance * 0.3);
  }

  /**
   * Calculate collection match score
   */
  private calculateCollectionMatch(deck: RecommendedDeck, userCollection: UserCollection): number {
    const collectionMap = new Map(
      userCollection.cards.map(item => [item.cardId, item.quantity])
    );

    let totalNeeded = 0;
    let totalOwned = 0;

    deck.cards.forEach(deckCard => {
      const owned = collectionMap.get(deckCard.card.id) || 0;
      const needed = deckCard.quantity;

      totalNeeded += needed;
      totalOwned += Math.min(owned, needed);
    });

    return totalNeeded > 0 ? totalOwned / totalNeeded : 0;
  }

  /**
   * Calculate diversity bonus to avoid recommending similar decks
   */
  private calculateDiversityBonus(deck: RecommendedDeck, currentDecks: ComparisonDeck[]): number {
    if (currentDecks.length === 0) return 0.5;

    let minSimilarity = 1;

    for (const currentDeck of currentDecks) {
      const similarity = this.calculateDeckSimilarity(deck, currentDeck);
      minSimilarity = Math.min(minSimilarity, similarity);
    }

    // Higher bonus for more diverse decks
    return 1 - minSimilarity;
  }

  /**
   * Calculate similarity between two decks
   */
  private calculateDeckSimilarity(deck1: RecommendedDeck, deck2: ComparisonDeck): number {
    const cards1 = new Set(deck1.cards.map(c => c.card.id));
    const cards2 = new Set(deck2.cards.map(c => c.card.id));

    const intersection = Array.from(cards1).filter(id => cards2.has(id)).length;
    const union = new Set([...Array.from(cards1), ...Array.from(cards2)]).size;

    return union > 0 ? intersection / union : 0;
  }

  /**
   * Calculate match percentage for display
   */
  private calculateMatchPercentage(deck: RecommendedDeck, preferences: UserPreferences): number {
    const playStyleMatch = this.calculatePlayStyleMatch(deck, preferences);
    const typeMatch = this.calculateTypeMatch(deck, preferences.favoriteTypes);
    const costMatch = this.calculateCostMatch(deck, preferences.preferredCostRange);

    return Math.round((playStyleMatch * 0.5 + typeMatch * 0.3 + costMatch * 0.2) * 100);
  }

  /**
   * Calculate build difficulty
   */
  private calculateBuildDifficulty(
    deck: RecommendedDeck,
    userCollection?: UserCollection
  ): 'easy' | 'moderate' | 'hard' {
    let difficulty = 0;

    // Base difficulty from deck complexity
    if (deck.analytics) {
      if (deck.analytics.synergyScore > 0.8) difficulty += 2;
      if (deck.analytics.competitiveRating > 85) difficulty += 1;
      if (deck.averageCost > 4) difficulty += 1;
    }

    // Collection-based difficulty
    if (userCollection) {
      const missingCards = this.calculateMissingCards(deck, userCollection);
      const essentialMissing = missingCards.filter(m => m.priority === 'essential').length;
      difficulty += essentialMissing > 5 ? 2 : essentialMissing > 2 ? 1 : 0;
    }

    if (difficulty >= 4) return 'hard';
    if (difficulty >= 2) return 'moderate';
    return 'easy';
  }

  /**
   * Estimate winrate for user
   */
  private estimateWinrate(deck: RecommendedDeck, preferences: UserPreferences): number {
    let baseWinrate = deck.recentWinrate || 50;

    // Adjust based on play style match
    const playStyleMatch = this.calculatePlayStyleMatch(deck, preferences);
    baseWinrate += (playStyleMatch - 0.5) * 10;

    // Adjust based on competitive level
    switch (preferences.competitiveLevel) {
      case 'casual':
        baseWinrate += 5; // Easier opponents
        break;
      case 'tournament':
        baseWinrate -= 10; // Harder opponents
        break;
    }

    return Math.max(30, Math.min(80, Math.round(baseWinrate)));
  }

  /**
   * Determine meta position
   */
  private determineMetaPosition(deck: RecommendedDeck): 'top-tier' | 'competitive' | 'viable' | 'experimental' {
    const winrate = deck.recentWinrate;
    const popularity = deck.popularity;

    if (winrate >= 65 && popularity >= 70) return 'top-tier';
    if (winrate >= 55 && popularity >= 40) return 'competitive';
    if (winrate >= 45) return 'viable';
    return 'experimental';
  }

  /**
   * Calculate archetype match score
   */
  private calculateArchetypeMatch(
    archetype: any,
    preferences: UserPreferences
  ): number {
    let score = 0;

    // Play style match (primary factor)
    if (archetype.playStyle === preferences.playStyle) {
      score += 0.5;
    } else if (preferences.playStyle === 'balanced') {
      score += 0.3; // Balanced players can enjoy any archetype
    }

    // Cost range match
    const [prefMin, prefMax] = preferences.preferredCostRange;
    const [archMin, archMax] = archetype.costRange;

    if (prefMin <= archMax && prefMax >= archMin) {
      const overlap = Math.min(prefMax, archMax) - Math.max(prefMin, archMin);
      const prefRange = prefMax - prefMin;
      score += (overlap / prefRange) * 0.2;
    }

    // Type preferences
    const typeMatch = archetype.preferredTypes.some((type: string) =>
      preferences.favoriteTypes.includes(type)
    );
    if (typeMatch) score += 0.2;

    // Complexity match
    const complexityMatch = this.getComplexityMatch(archetype.difficulty, preferences.complexityPreference);
    score += complexityMatch * 0.1;

    return Math.min(1, score);
  }

  /**
   * Get complexity match score
   */
  private getComplexityMatch(archetypeDifficulty: string, userPreference: string): number {
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const preferenceMap = { simple: 1, moderate: 2, complex: 3 };

    const archetypeLevel = difficultyMap[archetypeDifficulty as keyof typeof difficultyMap] || 2;
    const userLevel = preferenceMap[userPreference as keyof typeof preferenceMap] || 2;

    return Math.max(0, 1 - Math.abs(archetypeLevel - userLevel) * 0.3);
  }

  /**
   * Generate card upgrades for existing deck
   */
  private async generateCardUpgrades(
    deck: ComparisonDeck,
    userCollection?: UserCollection,
    budget?: number
  ): Promise<any[]> {
    // This would analyze the deck and suggest card swaps
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Generate sideboard suggestions
   */
  private async generateSideboardSuggestions(deck: ComparisonDeck): Promise<any[]> {
    // This would suggest sideboard cards based on meta matchups
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Get available decks (placeholder - would fetch from database)
   */
  private async getAvailableDecks(): Promise<RecommendedDeck[]> {
    // This would fetch from the actual database
    // For now, return empty array as placeholder
    return [];
  }
}

export const deckRecommendationService = new DeckRecommendationService();