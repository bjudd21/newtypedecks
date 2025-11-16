/**
 * DeckVersionComparison - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckVersionComparison/ directory.
 */

export { DeckVersionComparison } from './DeckVersionComparison/DeckVersionComparison';
export { useVersionComparison } from './DeckVersionComparison/hooks/useVersionComparison';
export { ComparisonHeader } from './DeckVersionComparison/components/ComparisonHeader';
export { SummaryStatistics } from './DeckVersionComparison/components/SummaryStatistics';
export { CardChangeItem } from './DeckVersionComparison/components/CardChangeItem';
export { ChangeSection } from './DeckVersionComparison/components/ChangeSection';
export { UnchangedCardsSection } from './DeckVersionComparison/components/UnchangedCardsSection';
export type {
  DeckCard,
  DeckVersion,
  CardChange,
  DeckVersionComparisonProps,
} from './DeckVersionComparison/types';
export {
  getChangeBadgeColor,
  calculateChanges,
} from './DeckVersionComparison/utils';
export { DeckVersionComparison as default } from './DeckVersionComparison/DeckVersionComparison';
