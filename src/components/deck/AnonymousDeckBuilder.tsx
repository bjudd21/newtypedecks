/**
 * AnonymousDeckBuilder - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into AnonymousDeckBuilder/
 */

// Main component exports
export { AnonymousDeckBuilderComponent as AnonymousDeckBuilder } from './AnonymousDeckBuilder/AnonymousDeckBuilderComponent';
export { AnonymousDeckBuilderComponent as default } from './AnonymousDeckBuilder/AnonymousDeckBuilderComponent';

// Type exports
export type {
  AnonymousDeckBuilderProps,
  DeckCardWithCard,
  DeckStats,
  CardsByType,
  ExportFormat,
  SaveStatus,
} from './AnonymousDeckBuilder/types';

// Hook exports
export { useDeckHandlers } from './AnonymousDeckBuilder/hooks/useDeckHandlers';
export { useDeckCalculations } from './AnonymousDeckBuilder/hooks/useDeckCalculations';

// Sub-component exports
export { DeckNameEditor } from './AnonymousDeckBuilder/DeckNameEditor';
export { CardSearchPanel } from './AnonymousDeckBuilder/CardSearchPanel';
export { EmptyDeckState } from './AnonymousDeckBuilder/EmptyDeckState';
export { DeckCardsList } from './AnonymousDeckBuilder/DeckCardsList';
export { DeckContentsPanel } from './AnonymousDeckBuilder/DeckContentsPanel';
export { DeckActionsBar } from './AnonymousDeckBuilder/DeckActionsBar';
export { AnonymousFeaturesNotice } from './AnonymousDeckBuilder/AnonymousFeaturesNotice';
