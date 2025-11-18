'use client';
/**
 * Hook for detecting when element enters viewport using IntersectionObserver
 */

import { useEffect, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  enabled: boolean;
  threshold?: number;
  scrollableTarget?: string;
}

export function useIntersectionObserver(
  ref: RefObject<HTMLElement | null>,
  {
    onIntersect,
    enabled,
    threshold = 200,
    scrollableTarget,
  }: UseIntersectionObserverOptions
) {
  useEffect(() => {
    if (!ref.current || !enabled) {
      return;
    }

    const element = ref.current;
    const scrollContainer = scrollableTarget
      ? document.getElementById(scrollableTarget)
      : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
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
  }, [ref, onIntersect, enabled, threshold, scrollableTarget]);
}
