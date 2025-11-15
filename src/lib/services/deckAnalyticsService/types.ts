/**
 * Type Definitions for Deck Analytics
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
