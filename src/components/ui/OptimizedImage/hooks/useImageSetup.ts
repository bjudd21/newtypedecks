/**
 * Custom hook for setting up optimized images with CDN and caching
 */

import { useState, useEffect } from 'react';
import { CDNService, type ResponsiveImageSet } from '@/lib/services/cdnService';
import { ImageCacheService } from '@/lib/services/imageCacheService';

interface UseImageSetupOptions {
  src: string;
  width: number;
  height: number;
  quality: number;
  format: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  enableResponsive: boolean;
  enableCache: boolean;
  priority: boolean;
  deviceOptimized: boolean;
  preload: boolean;
  onError?: (error: Error) => void;
}

export function useImageSetup({
  src,
  width,
  height,
  quality,
  format,
  fit,
  enableResponsive,
  enableCache,
  priority,
  deviceOptimized,
  preload,
  onError,
}: UseImageSetupOptions) {
  const [imageSet, setImageSet] = useState<ResponsiveImageSet | null>(null);
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const [error, setError] = useState<Error | null>(null);

  const cdnService = CDNService.getInstance();
  const cacheService = ImageCacheService.getInstance();

  useEffect(() => {
    const setupImage = async () => {
      try {
        // Generate optimized URLs
        let optimizedSrc: string;
        let responsiveSet: ResponsiveImageSet | null = null;

        if (enableResponsive) {
          if (deviceOptimized) {
            // Generate device-specific URLs
            const deviceSets = cdnService.generateDeviceOptimizedUrls(src);
            // Use desktop set as default, can be enhanced with device detection
            responsiveSet = deviceSets.desktop;
          } else {
            // Generate standard responsive set
            responsiveSet = cdnService.generateResponsiveImageSet(src);
          }
          optimizedSrc = responsiveSet.src;
          setImageSet(responsiveSet);
        } else {
          // Generate single optimized URL
          optimizedSrc = cdnService.generateImageUrl(src, {
            width,
            height,
            quality,
            format,
            fit,
          });
        }

        // Handle caching
        if (enableCache) {
          const cachePriority = priority ? 'high' : 'normal';
          const cachedUrl = await cacheService.getImage(
            optimizedSrc,
            cachePriority
          );
          setCachedSrc(cachedUrl);
        } else {
          setCachedSrc(optimizedSrc);
        }

        // Preload if requested
        if (preload && !priority) {
          cacheService.preloadImages([optimizedSrc]);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to setup image');
        setError(error);
        onError?.(error);
      }
    };

    setupImage();
  }, [
    src,
    width,
    height,
    quality,
    format,
    fit,
    enableResponsive,
    enableCache,
    priority,
    deviceOptimized,
    preload,
    onError,
    cacheService,
    cdnService,
  ]);

  return {
    imageSet,
    cachedSrc,
    error,
  };
}
