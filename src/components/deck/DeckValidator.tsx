/**
 * DeckValidator - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckValidator/ directory.
 */

export { DeckValidatorComponent as DeckValidator } from './DeckValidator/DeckValidatorComponent';
export { DeckValidatorComponent as default } from './DeckValidator/DeckValidatorComponent';

// Re-export types
export type {
  DeckCard,
  DeckValidatorProps,
  SeverityDisplay,
} from './DeckValidator/types';

// Re-export hooks
export { useValidation } from './DeckValidator/hooks/useValidation';

// Re-export components
export { EmptyState } from './DeckValidator/components/EmptyState';
export { ValidationHeader } from './DeckValidator/components/ValidationHeader';
export { SummaryBadges } from './DeckValidator/components/SummaryBadges';
export { ValidationResultsList } from './DeckValidator/components/ValidationResultsList';
export { SuggestionsSection } from './DeckValidator/components/SuggestionsSection';
export { QuickStats } from './DeckValidator/components/QuickStats';
export { TournamentReadyIndicator } from './DeckValidator/components/TournamentReadyIndicator';

// Re-export utils
export { getScoreColor, getSeverityDisplay } from './DeckValidator/utils';
