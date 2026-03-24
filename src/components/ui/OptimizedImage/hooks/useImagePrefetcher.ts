'use client';
/**
 * Hook for prefetching images during browser idle time
 */

import { useEffect } from 'react';

export const useImagePrefetcher = (urls: string[]) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const schedule =
      'requestIdleCallback' in window ? requestIdleCallback : setTimeout;
    urls.forEach((url) => {
      schedule(() => {
        const img = new Image();
        img.src = url;
      });
    });
  }, [urls]);
};
