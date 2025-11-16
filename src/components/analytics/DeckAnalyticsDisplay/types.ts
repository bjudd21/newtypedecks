/**
 * Type definitions for DeckAnalyticsDisplay components
 */

import type { DeckAnalytics, DeckCard } from '@/lib/services/deckAnalyticsService';

export interface DeckAnalyticsDisplayProps {
  deckCards: DeckCard[];
  deckName?: string;
  className?: string;
  onAnalysisUpdate?: (analytics: DeckAnalytics) => void;
}

export type TabType = 'overview' | 'distributions' | 'suggestions' | 'improvements';

export { DeckAnalytics, DeckCard };
