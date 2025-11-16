/**
 * Hook for prefetching images
 */

import { useEffect } from 'react';
import { ImageCacheService } from '@/lib/services/imageCacheService';

export const useImagePrefetcher = (urls: string[]) => {
  useEffect(() => {
    const cacheService = ImageCacheService.getInstance();
    cacheService.prefetchImages(urls);
  }, [urls]);
};
