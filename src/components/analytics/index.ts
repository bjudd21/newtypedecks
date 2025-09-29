// Analytics components exports
export { DeckAnalyticsDisplay } from './DeckAnalyticsDisplay';
export { DistributionChart } from './DistributionChart';
export { SuggestionsList } from './SuggestionsList';
export { CompetitiveRating } from './CompetitiveRating';
export { MetaGameInsights } from './MetaGameInsights';

// Re-export types from the service for convenience
export type {
  DeckAnalytics,
  DeckCard,
  DeckSuggestion,
  DeckImprovement,
  MetaGameData
} from '@/lib/services/deckAnalyticsService';