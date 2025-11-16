/**
 * Performance optimized infinite scroll for large lists
 */

'use client';

import React, { useState, useRef } from 'react';
import { Spinner } from '@/components/ui';
import type { VirtualizedInfiniteScrollProps } from './types';

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
    const {
      scrollTop: newScrollTop,
      scrollHeight,
      clientHeight,
    } = event.currentTarget;
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
          return renderItem(item, actualIndex, {
            position: 'absolute',
            top: actualIndex * itemHeight,
            height: itemHeight,
            width: '100%',
          });
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

export default VirtualizedInfiniteScroll;
