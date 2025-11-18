/**
 * Collection management hook
 *
 * Provides functionality for managing user card collections
 * including adding, updating, removing cards, and querying quantities.
 *
 * Re-exports from modularized structure for backward compatibility
 */

'use client';

// Export types
export type {
  CollectionCard,
  Collection,
  CollectionOptions,
} from './useCollection/types';

// Export main hook
export { useCollection } from './useCollection/useCollectionHook';
