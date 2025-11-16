/**
 * InfiniteScroll - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./InfiniteScroll/ directory.
 */

export { InfiniteScroll } from './InfiniteScroll/InfiniteScroll';
export { VirtualizedInfiniteScroll } from './InfiniteScroll/VirtualizedInfiniteScroll';
export { useInfiniteScroll } from './InfiniteScroll/hooks/useInfiniteScroll';
export { useIntersectionObserver } from './InfiniteScroll/hooks/useIntersectionObserver';
export { useScrollHandler } from './InfiniteScroll/hooks/useScrollHandler';
export { LoadingIndicator } from './InfiniteScroll/components/LoadingIndicator';
export { ErrorDisplay } from './InfiniteScroll/components/ErrorDisplay';
export { EndMessage } from './InfiniteScroll/components/EndMessage';
export { SkeletonGrid } from './InfiniteScroll/components/SkeletonGrid';
export { ManualLoadButton } from './InfiniteScroll/components/ManualLoadButton';
export type {
  InfiniteScrollProps,
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
  VirtualizedInfiniteScrollProps,
} from './InfiniteScroll/types';
export { InfiniteScroll as default } from './InfiniteScroll/InfiniteScroll';
