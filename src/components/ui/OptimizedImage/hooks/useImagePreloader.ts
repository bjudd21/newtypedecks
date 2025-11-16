/**
 * Hook for preloading images
 */

import { useEffect } from 'react';
import { ImageCacheService } from '@/lib/services/imageCacheService';

export const useImagePreloader = (
  urls: string[],
  priority: 'high' | 'normal' | 'low' = 'normal'
) => {
  useEffect(() => {
    const cacheService = ImageCacheService.getInstance();
    cacheService.preloadImages(urls, priority);
  }, [urls, priority]);
};
