/**
 * Collection fetch operations
 * Handles fetching collection data with filtering and pagination
 */

'use client';

import { useCallback } from 'react';
import type { Collection, CollectionOptions } from './types';

export function useCollectionFetch(
  isAuthenticated: boolean,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  const getCollection = useCallback(
    async (options?: CollectionOptions): Promise<Collection | null> => {
      if (!isAuthenticated) {
        setError('Authentication required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options?.page) params.set('page', options.page.toString());
        if (options?.limit) params.set('limit', options.limit.toString());
        if (options?.search) params.set('search', options.search);
        if (options?.rarity) params.set('rarity', options.rarity);
        if (options?.type) params.set('type', options.type);
        if (options?.faction) params.set('faction', options.faction);

        const response = await fetch(`/api/collections?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load collection');
          return null;
        }

        return data.collection;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load collection';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, setIsLoading, setError]
  );

  return { getCollection };
}
