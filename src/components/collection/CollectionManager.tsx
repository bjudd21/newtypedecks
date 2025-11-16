/**
 * CollectionManager - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./CollectionManager/ directory.
 */

export { CollectionManagerComponent as CollectionManager } from './CollectionManager/CollectionManagerComponent';
export { CollectionManagerComponent as default } from './CollectionManager/CollectionManagerComponent';

// Re-export types
export type {
  CollectionCard,
  CollectionData,
  CollectionFilters,
  CollectionManagerProps,
  CollectionStats,
  CollectionPaginationType,
} from './CollectionManager/types';

// Re-export constants
export {
  CARD_CONDITIONS,
  DEFAULT_FILTERS,
  DEFAULT_CONDITION,
} from './CollectionManager/constants';

// Re-export hooks
export { useCollectionState } from './CollectionManager/hooks/useCollectionState';
export { useCollectionLoader } from './CollectionManager/hooks/useCollectionLoader';
export { useFilterManagement } from './CollectionManager/hooks/useFilterManagement';
export { useCardEditing } from './CollectionManager/hooks/useCardEditing';

// Re-export components
export { UnauthenticatedView } from './CollectionManager/components/UnauthenticatedView';
export { ErrorDisplay } from './CollectionManager/components/ErrorDisplay';
export { LoadingState } from './CollectionManager/components/LoadingState';
export { EmptyState } from './CollectionManager/components/EmptyState';
export { CollectionContent } from './CollectionManager/components/CollectionContent';
