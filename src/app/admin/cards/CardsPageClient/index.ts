/**
 * CardsPageClient Sub-Components
 * Exports all admin cards page components and utilities
 */

// Export types
export type { Card, PaginationData } from './types';

// Export API
export { loadCards } from './api';

// Export hooks
export { useCardsPageState } from './hooks/useCardsPageState';
export { useCardsPageHandlers } from './hooks/useCardsPageHandlers';
export { useCardsPageEffects } from './hooks/useCardsPageEffects';

// Export UI components
export { CardsPageHeader } from './ui/CardsPageHeader';
export { CardsPageSearch } from './ui/CardsPageSearch';
export { CardsPageModals } from './ui/CardsPageModals';

// Export main component
export { CardsPageContent } from './CardsPageContent';
export { default } from './CardsPageContent';
