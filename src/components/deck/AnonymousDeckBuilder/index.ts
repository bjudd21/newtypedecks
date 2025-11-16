/**
 * AnonymousDeckBuilder Module Exports
 *
 * This module provides an anonymous deck builder with:
 * - Offline-first deck building with local storage
 * - Card search and drag-and-drop interface
 * - Deck validation and statistics
 * - Export functionality (JSON, CSV, text, MTGA)
 * - Share deck with URL generation
 */

// Main component
export { AnonymousDeckBuilderComponent } from './AnonymousDeckBuilderComponent';

// Types
export type {
  AnonymousDeckBuilderProps,
  DeckCardWithCard,
  DeckStats,
  CardsByType,
  ExportFormat,
  SaveStatus,
} from './types';

// Hooks
export { useDeckHandlers } from './hooks/useDeckHandlers';
export { useDeckCalculations } from './hooks/useDeckCalculations';

// Sub-components
export { DeckNameEditor } from './DeckNameEditor';
export { CardSearchPanel } from './CardSearchPanel';
export { EmptyDeckState } from './EmptyDeckState';
export { DeckCardsList } from './DeckCardsList';
export { DeckContentsPanel } from './DeckContentsPanel';
export { DeckActionsBar } from './DeckActionsBar';
export { AnonymousFeaturesNotice } from './AnonymousFeaturesNotice';
