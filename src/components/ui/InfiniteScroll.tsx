'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Spinner } from '@/components/ui';

export interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  className?: string;
  containerClassName?: string;
  threshold?: number;
  enableManualLoad?: boolean;
  loadMoreText?: string;
  endMessage?: React.ReactNode;
  errorMessage?: string;
  onRetry?: () => void;
  scrollableTarget?: string;
}

export function InfiniteScroll<T>({
  items,
  hasMore,
  isLoading,
  loadMore,
  renderItem,
  renderSkeleton,
  className = '',
  containerClassName = '',
  threshold = 200,
  enableManualLoad = false,
  loadMoreText = 'Load More',
  endMessage,
  errorMessage,
  onRetry,
  scrollableTarget,
}: InfiniteScrollProps<T>) {
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle intersection observer for automatic loading
  useEffect(() => {
    if (!loadingRef.current || enableManualLoad || !hasMore || isLoading) {
      return;
    }

    const element = loadingRef.current;
    const scrollContainer = scrollableTarget
      ? document.getElementById(scrollableTarget)
      : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasMore, isLoading, enableManualLoad, threshold, scrollableTarget]);

  // Handle scroll-based loading for custom scroll containers
  useEffect(() => {
    if (!scrollableTarget || enableManualLoad || !hasMore || isLoading) {
      return;
    }

    const scrollContainer = document.getElementById(scrollableTarget);
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom <= threshold) {
        handleLoadMore();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading, enableManualLoad, threshold, scrollableTarget]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setError(null);
      await loadMore();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load more items';
      setError(errorMsg);
    }
  }, [isLoading, hasMore, loadMore]);

  const handleRetry = () => {
    setError(null);
    if (onRetry) {
      onRetry();
    } else {
      handleLoadMore();
    }
  };

  // Render skeleton items while loading
  const renderSkeletonItems = () => {
    if (!renderSkeleton) {
      return Array.from({ length: 6 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
        </div>
      ));
    }

    return Array.from({ length: 6 }).map((_, index) => (
      <div key={`skeleton-${index}`}>
        {renderSkeleton()}
      </div>
    ));
  };

  return (
    <div ref={containerRef} className={containerClassName}>
      {/* Items grid/list */}
      <div className={className}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Loading state for initial load */}
      {isLoading && items.length === 0 && (
        <div className={className}>
          {renderSkeletonItems()}
        </div>
      )}

      {/* Loading more state */}
      {isLoading && items.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Spinner size="sm" />
            <span>Loading more cards...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{errorMessage || error}</p>
          </div>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      )}

      {/* Manual load more button */}
      {enableManualLoad && hasMore && !isLoading && !error && (
        <div className="flex justify-center py-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            disabled={isLoading}
          >
            {loadMoreText}
          </Button>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && items.length > 0 && !isLoading && (
        <div className="flex justify-center py-8">
          {endMessage || (
            <div className="text-center text-gray-500">
              <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-sm">You&apos;ve reached the end of the results</p>
            </div>
          )}
        </div>
      )}

      {/* Intersection observer target */}
      {!enableManualLoad && (
        <div ref={loadingRef} className="h-1" />
      )}
    </div>
  );
}

// Hook for managing infinite scroll state
export interface UseInfiniteScrollOptions<T> {
  initialItems?: T[];
  pageSize?: number;
  loadFunction: (page: number, pageSize: number) => Promise<{
    items: T[];
    hasMore: boolean;
    total?: number;
  }>;
  dependencies?: React.DependencyList;
  enableAutoLoad?: boolean;
}

export interface UseInfiniteScrollReturn<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  page: number;
  total: number;
  loadMore: () => Promise<void>;
  reset: () => void;
  retry: () => void;
}

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

      setItems(prev => page === 1 ? result.items : [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setTotal(result.total || 0);
      setPage(prev => prev + 1);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load items';
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

// Performance optimized infinite scroll for large lists
export interface VirtualizedInfiniteScrollProps<T> extends Omit<InfiniteScrollProps<T>, 'renderItem'> {
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  overscan?: number;
}

export function VirtualizedInfiniteScroll<T>({
  items,
  hasMore,
  isLoading,
  loadMore,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className = '',
  ..._props
}: VirtualizedInfiniteScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: newScrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setScrollTop(newScrollTop);

    // Check if we need to load more
    if (
      hasMore &&
      !isLoading &&
      scrollHeight - newScrollTop - clientHeight < itemHeight * 3
    ) {
      loadMore();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return renderItem(
            item,
            actualIndex,
            {
              position: 'absolute',
              top: actualIndex * itemHeight,
              height: itemHeight,
              width: '100%',
            }
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
}

export default InfiniteScroll;