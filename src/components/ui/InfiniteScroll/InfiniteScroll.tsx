/**
 * Main InfiniteScroll component - orchestrator
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useScrollHandler } from './hooks/useScrollHandler';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EndMessage } from './components/EndMessage';
import { SkeletonGrid } from './components/SkeletonGrid';
import { ManualLoadButton } from './components/ManualLoadButton';
import type { InfiniteScrollProps } from './types';

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

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setError(null);
      await loadMore();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load more items';
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

  // Handle intersection observer for automatic loading
  useIntersectionObserver(loadingRef, {
    onIntersect: handleLoadMore,
    enabled: !enableManualLoad && hasMore && !isLoading,
    threshold,
    scrollableTarget,
  });

  // Handle scroll-based loading for custom scroll containers
  useScrollHandler({
    onLoadMore: handleLoadMore,
    enabled: !enableManualLoad && hasMore && !isLoading,
    threshold,
    scrollableTarget,
  });

  return (
    <div ref={containerRef} className={containerClassName}>
      {/* Items grid/list */}
      <div className={className}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Loading state for initial load */}
      {isLoading && items.length === 0 && (
        <SkeletonGrid
          className={className}
          renderSkeleton={renderSkeleton}
          count={6}
        />
      )}

      {/* Loading more state */}
      {isLoading && items.length > 0 && <LoadingIndicator />}

      {/* Error state */}
      {error && (
        <ErrorDisplay
          error={error}
          errorMessage={errorMessage}
          onRetry={handleRetry}
        />
      )}

      {/* Manual load more button */}
      {enableManualLoad && hasMore && !isLoading && !error && (
        <ManualLoadButton
          onClick={handleLoadMore}
          text={loadMoreText}
          isLoading={isLoading}
        />
      )}

      {/* End of results message */}
      {!hasMore && items.length > 0 && !isLoading && (
        <EndMessage customMessage={endMessage} />
      )}

      {/* Intersection observer target */}
      {!enableManualLoad && <div ref={loadingRef} className="h-1" />}
    </div>
  );
}

export default InfiniteScroll;
