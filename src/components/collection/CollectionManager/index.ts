/**
 * CollectionManager module exports
 */

// Main component
export { CollectionManagerComponent } from './CollectionManagerComponent';
export { CollectionManagerComponent as default } from './CollectionManagerComponent';

// Types
export * from './types';

// Constants
export { CARD_CONDITIONS, DEFAULT_FILTERS, DEFAULT_CONDITION } from './constants';

// Hooks
export { useCollectionState } from './hooks/useCollectionState';
export { useCollectionLoader } from './hooks/useCollectionLoader';
export { useFilterManagement } from './hooks/useFilterManagement';
export { useCardEditing } from './hooks/useCardEditing';

// UI Components
export { UnauthenticatedView } from './components/UnauthenticatedView';
export { ErrorDisplay } from './components/ErrorDisplay';
export { LoadingState } from './components/LoadingState';
export { EmptyState } from './components/EmptyState';
export { CollectionContent } from './components/CollectionContent';

// Existing sub-components
export { CollectionStatistics } from './CollectionStatistics';
export { TabNavigation, type TabType } from './TabNavigation';
export { CollectionFilters } from './CollectionFilters';
export { CollectionCardItem } from './CollectionCardItem';
export { CollectionPagination } from './CollectionPagination';
