'use client';
/**
 * Hook for handling scroll-based loading in custom scroll containers
 */

import { useEffect } from 'react';

interface UseScrollHandlerOptions {
  onLoadMore: () => void;
  enabled: boolean;
  threshold?: number;
  scrollableTarget?: string;
}

export function useScrollHandler({
  onLoadMore,
  enabled,
  threshold = 200,
  scrollableTarget,
}: UseScrollHandlerOptions) {
  useEffect(() => {
    if (!scrollableTarget || !enabled) {
      return;
    }

    const scrollContainer = document.getElementById(scrollableTarget);
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom <= threshold) {
        onLoadMore();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore, enabled, threshold, scrollableTarget]);
}
