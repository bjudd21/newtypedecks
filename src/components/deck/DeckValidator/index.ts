/**
 * DeckValidator module exports
 */

// Main component
export { DeckValidatorComponent } from './DeckValidatorComponent';
export { DeckValidatorComponent as default } from './DeckValidatorComponent';

// Types
export * from './types';

// Hooks
export { useValidation } from './hooks/useValidation';

// UI Components
export { EmptyState } from './components/EmptyState';
export { ValidationHeader } from './components/ValidationHeader';
export { SummaryBadges } from './components/SummaryBadges';
export { ValidationResultsList } from './components/ValidationResultsList';
export { SuggestionsSection } from './components/SuggestionsSection';
export { QuickStats } from './components/QuickStats';
export { TournamentReadyIndicator } from './components/TournamentReadyIndicator';

// Utils
export * from './utils';
