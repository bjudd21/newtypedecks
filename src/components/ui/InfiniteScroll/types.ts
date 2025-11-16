/**
 * Type definitions for InfiniteScroll components and hooks
 */

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

export interface UseInfiniteScrollOptions<T> {
  initialItems?: T[];
  pageSize?: number;
  loadFunction: (
    page: number,
    pageSize: number
  ) => Promise<{
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

export interface VirtualizedInfiniteScrollProps<T>
  extends Omit<InfiniteScrollProps<T>, 'renderItem'> {
  itemHeight: number;
  containerHeight: number;
  renderItem: (
    item: T,
    index: number,
    style: React.CSSProperties
  ) => React.ReactNode;
  overscan?: number;
}
