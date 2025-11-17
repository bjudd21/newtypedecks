/**
 * Custom React hooks for card operations
 *
 * These hooks provide reusable logic for card-related operations
 * that can be used across different components.
 *
 * Re-exports from modularized structure for backward compatibility
 */

'use client';

// Export all hooks
export { useCardSearch } from './useCard/useCardSearch';
export { useCard } from './useCard/useSingleCard';
export { useCardCollection } from './useCard/useCardCollection';
export { useDeckBuilder } from './useCard/useDeckBuilder';
export { useCardFiltering } from './useCard/useCardFiltering';
export { useCardComparison } from './useCard/useCardComparison';
