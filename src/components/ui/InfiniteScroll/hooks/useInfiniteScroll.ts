/**
 * Hook for managing infinite scroll state
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
} from '../types';

export function useInfiniteScroll<T>({
  initialItems = [],
  pageSize = 20,
  loadFunction,
  dependencies = [],
  enableAutoLoad = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await loadFunction(page, pageSize);

      setItems((prev) =>
        page === 1 ? result.items : [...prev, ...result.items]
      );
      setHasMore(result.hasMore);
      setTotal(result.total || 0);
      setPage((prev) => prev + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load items';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, loadFunction, isLoading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
    setPage(1);
    setTotal(0);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    loadMore();
  }, [loadMore]);

  // Auto-load first page when dependencies change
  useEffect(() => {
    if (enableAutoLoad) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  // Load first page
  useEffect(() => {
    if (enableAutoLoad && page === 1 && items.length === 0 && !isLoading) {
      loadMore();
    }
  }, [page, items.length, isLoading, loadMore, enableAutoLoad]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    page: page - 1, // Return 0-based page for external use
    total,
    loadMore,
    reset,
    retry,
  };
}
