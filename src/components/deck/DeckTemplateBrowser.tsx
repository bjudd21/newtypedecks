/**
 * DeckTemplateBrowser - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./DeckTemplateBrowser/ directory.
 */

export { DeckTemplateBrowser } from './DeckTemplateBrowser/DeckTemplateBrowser';
export { useTemplates } from './DeckTemplateBrowser/hooks/useTemplates';
export { LoadingState } from './DeckTemplateBrowser/components/LoadingState';
export { ErrorDisplay } from './DeckTemplateBrowser/components/ErrorDisplay';
export { EmptyState } from './DeckTemplateBrowser/components/EmptyState';
export { FilterPanel } from './DeckTemplateBrowser/components/FilterPanel';
export { TemplateCard } from './DeckTemplateBrowser/components/TemplateCard';
export { TemplateStats } from './DeckTemplateBrowser/components/TemplateStats';
export { ColorBadges } from './DeckTemplateBrowser/components/ColorBadges';
export { Pagination } from './DeckTemplateBrowser/components/Pagination';
export { SignInPrompt } from './DeckTemplateBrowser/components/SignInPrompt';
export type {
  DeckTemplate,
  TemplateCustomizations,
  DeckTemplateBrowserProps,
  TemplateFilters,
} from './DeckTemplateBrowser/types';
export { getSourceBadgeColor } from './DeckTemplateBrowser/utils';
export { DeckTemplateBrowser as default } from './DeckTemplateBrowser/DeckTemplateBrowser';
