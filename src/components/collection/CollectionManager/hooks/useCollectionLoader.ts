/**
 * Hook for loading collection data
 */

import { useEffect, useCallback } from 'react';
import type { CollectionData, CollectionFilters } from '../types';

interface UseCollectionLoaderOptions {
  isAuthenticated: boolean;
  getCollection: (filters: CollectionFilters) => Promise<CollectionData | null>;
  clearError: () => void;
  filters: CollectionFilters;
  setCollection: (collection: CollectionData | null) => void;
}

export function useCollectionLoader({
  isAuthenticated,
  getCollection,
  clearError,
  filters,
  setCollection,
}: UseCollectionLoaderOptions) {
  const loadCollection = useCallback(async () => {
    if (!isAuthenticated) return;

    clearError();
    const collectionData = await getCollection(filters);
    if (collectionData) {
      setCollection(collectionData);
    }
  }, [isAuthenticated, getCollection, filters, clearError, setCollection]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  return { loadCollection };
}
