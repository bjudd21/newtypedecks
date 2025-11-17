/**
 * Main collection hook
 * Composes all collection operations into a single hook
 */

'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { useCollectionFetch } from './useCollectionFetch';
import { useCollectionMutations } from './useCollectionMutations';
import { useCollectionQueries } from './useCollectionQueries';

export function useCollection() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch operations
  const { getCollection } = useCollectionFetch(
    isAuthenticated,
    setIsLoading,
    setError
  );

  // Mutation operations
  const { addToCollection, updateCollection, removeFromCollection } =
    useCollectionMutations(isAuthenticated, setIsLoading, setError);

  // Query operations
  const { getCardQuantity, getCardQuantities } = useCollectionQueries(
    isAuthenticated,
    getCollection
  );

  return {
    isLoading,
    error,
    clearError,
    getCollection,
    addToCollection,
    updateCollection,
    removeFromCollection,
    getCardQuantity,
    getCardQuantities,
  };
}
