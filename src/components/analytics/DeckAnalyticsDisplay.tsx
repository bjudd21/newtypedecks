/**
 * DeckAnalyticsDisplay - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckAnalyticsDisplay/ directory.
 */

export { DeckAnalyticsDisplay } from './DeckAnalyticsDisplay/DeckAnalyticsDisplay';
export { useDeckAnalytics } from './DeckAnalyticsDisplay/hooks/useDeckAnalytics';
export { LoadingState } from './DeckAnalyticsDisplay/components/LoadingState';
export { EmptyState } from './DeckAnalyticsDisplay/components/EmptyState';
export { AnalyticsHeader } from './DeckAnalyticsDisplay/components/AnalyticsHeader';
export { PerformanceMetrics } from './DeckAnalyticsDisplay/components/PerformanceMetrics';
export { TabNavigation } from './DeckAnalyticsDisplay/components/TabNavigation';
export { OverviewTab } from './DeckAnalyticsDisplay/components/OverviewTab';
export { DistributionsTab } from './DeckAnalyticsDisplay/components/DistributionsTab';
export { ImprovementsTab } from './DeckAnalyticsDisplay/components/ImprovementsTab';
export type {
  DeckAnalyticsDisplayProps,
  TabType,
  DeckAnalytics,
  DeckCard,
} from './DeckAnalyticsDisplay/types';
export {
  getRatingColor,
  severityColors,
  severityIcons,
} from './DeckAnalyticsDisplay/utils';
export { DeckAnalyticsDisplay as default } from './DeckAnalyticsDisplay/DeckAnalyticsDisplay';
