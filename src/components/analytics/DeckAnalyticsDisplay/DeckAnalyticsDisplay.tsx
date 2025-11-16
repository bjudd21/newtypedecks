/**
 * Deck analytics display component - main orchestrator
 */

'use client';

import React from 'react';
import { useDeckAnalytics } from './hooks/useDeckAnalytics';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { TabNavigation } from './components/TabNavigation';
import { OverviewTab } from './components/OverviewTab';
import { DistributionsTab } from './components/DistributionsTab';
import { ImprovementsTab } from './components/ImprovementsTab';
import { SuggestionsList } from '../SuggestionsList';
import type { DeckAnalyticsDisplayProps } from './types';

export const DeckAnalyticsDisplay: React.FC<DeckAnalyticsDisplayProps> = ({
  deckCards,
  deckName = 'Deck',
  className,
  onAnalysisUpdate,
}) => {
  const { analytics, isAnalyzing, activeTab, setActiveTab } = useDeckAnalytics(
    deckCards,
    onAnalysisUpdate
  );

  if (isAnalyzing) {
    return <LoadingState className={className} />;
  }

  if (!analytics) {
    return <EmptyState className={className} />;
  }

  return (
    <div className={className}>
      {/* Header with Overall Rating */}
      <AnalyticsHeader deckName={deckName} analytics={analytics} />

      {/* Advanced Metrics */}
      <PerformanceMetrics analytics={analytics} />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab analytics={analytics} />}

      {activeTab === 'distributions' && (
        <DistributionsTab analytics={analytics} />
      )}

      {activeTab === 'suggestions' && (
        <SuggestionsList suggestions={analytics.suggestions} />
      )}

      {activeTab === 'improvements' && (
        <ImprovementsTab analytics={analytics} />
      )}
    </div>
  );
};

export default DeckAnalyticsDisplay;
