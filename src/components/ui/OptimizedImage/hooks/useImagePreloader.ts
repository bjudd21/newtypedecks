'use client';
/**
 * Hook for preloading images
 */

import { useEffect } from 'react';

export const useImagePreloader = (
  urls: string[],
  _priority: 'high' | 'normal' | 'low' = 'normal'
) => {
  useEffect(() => {
    urls.slice(0, 10).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
};
