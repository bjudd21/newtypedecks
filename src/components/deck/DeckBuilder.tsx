/**
 * DeckBuilder - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckBuilder/ directory.
 */

export { DeckBuilderComponent as DeckBuilder } from './DeckBuilder/DeckBuilderComponent';
export { useDeckState } from './DeckBuilder/hooks/useDeckState';
export { useDeckHandlers } from './DeckBuilder/hooks/useDeckHandlers';
export { useDeckCalculations } from './DeckBuilder/hooks/useDeckCalculations';
export { DeckBuilderComponent as default } from './DeckBuilder/DeckBuilderComponent';
