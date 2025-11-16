/**
 * PublicDeckBrowser - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./PublicDeckBrowser/ directory.
 */

export { PublicDeckBrowser } from './PublicDeckBrowser/PublicDeckBrowser';
export { usePublicDecks } from './PublicDeckBrowser/hooks/usePublicDecks';
export { FilterPanel } from './PublicDeckBrowser/components/FilterPanel';
export { LoadingState } from './PublicDeckBrowser/components/LoadingState';
export { EmptyState } from './PublicDeckBrowser/components/EmptyState';
export { ErrorDisplay } from './PublicDeckBrowser/components/ErrorDisplay';
export { DeckCard } from './PublicDeckBrowser/components/DeckCard';
export { DeckStatistics } from './PublicDeckBrowser/components/DeckStatistics';
export { CardPreview } from './PublicDeckBrowser/components/CardPreview';
export { Pagination } from './PublicDeckBrowser/components/Pagination';
export type {
  PublicDeck,
  PublicDeckBrowserProps,
  DeckFilters,
  PaginationState,
} from './PublicDeckBrowser/types';
export { PublicDeckBrowser as default } from './PublicDeckBrowser/PublicDeckBrowser';
