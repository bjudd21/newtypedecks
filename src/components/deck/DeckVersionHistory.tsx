/**
 * DeckVersionHistory - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckVersionHistory/ directory.
 */

export { DeckVersionHistory } from './DeckVersionHistory/DeckVersionHistory';
export { useVersionHistory } from './DeckVersionHistory/hooks/useVersionHistory';
export { useVersionActions } from './DeckVersionHistory/hooks/useVersionActions';
export { LoadingState } from './DeckVersionHistory/components/LoadingState';
export { ErrorDisplay } from './DeckVersionHistory/components/ErrorDisplay';
export { EmptyState } from './DeckVersionHistory/components/EmptyState';
export { VersionStats } from './DeckVersionHistory/components/VersionStats';
export { VersionCardGrid } from './DeckVersionHistory/components/VersionCardGrid';
export { VersionListItem } from './DeckVersionHistory/components/VersionListItem';
export type {
  DeckVersion,
  DeckVersionHistoryProps,
} from './DeckVersionHistory/types';
export { DeckVersionHistory as default } from './DeckVersionHistory/DeckVersionHistory';
