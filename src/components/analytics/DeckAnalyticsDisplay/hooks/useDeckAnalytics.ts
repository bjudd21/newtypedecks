/**
 * Hook for managing deck analytics state and computation
 */

import { useState, useEffect } from 'react';
import { deckAnalyticsService } from '@/lib/services/deckAnalyticsService';
import type { DeckAnalytics, DeckCard, TabType } from '../types';

export function useDeckAnalytics(
  deckCards: DeckCard[],
  onAnalysisUpdate?: (analytics: DeckAnalytics) => void
) {
  const [analytics, setAnalytics] = useState<DeckAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Analyze deck when cards change
  useEffect(() => {
    if (deckCards.length === 0) {
      setAnalytics(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = deckAnalyticsService.analyzeDeck(deckCards);
      setAnalytics(result);
      onAnalysisUpdate?.(result);
    } catch (error) {
      console.error('Deck analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [deckCards, onAnalysisUpdate]);

  return {
    analytics,
    isAnalyzing,
    activeTab,
    setActiveTab,
  };
}
