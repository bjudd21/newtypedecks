'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { CDNService, type ResponsiveImageSet } from '@/lib/services/cdnService';
import { ImageCacheService } from '@/lib/services/imageCacheService';

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'srcSet' | 'onLoad' | 'onError'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  enableCache?: boolean;
  enableResponsive?: boolean;
  enableLazyLoad?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  deviceOptimized?: boolean;
  preload?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 85,
  format = 'auto',
  fit = 'cover',
  enableCache = true,
  enableResponsive = true,
  enableLazyLoad = true,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  deviceOptimized = false,
  preload = false,
  ...props
}) => {
  const [imageSet, setImageSet] = useState<ResponsiveImageSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cachedSrc, setCachedSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);

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
          const cachedUrl = await cacheService.getImage(optimizedSrc, cachePriority);
          setCachedSrc(cachedUrl);
        } else {
          setCachedSrc(optimizedSrc);
        }

        // Preload if requested
        if (preload && !priority) {
          cacheService.preloadImages([optimizedSrc]);
        }

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to setup image');
        setError(error);
        onError?.(error);
      }
    };

    setupImage();
  }, [src, width, height, quality, format, fit, enableResponsive, enableCache, priority, deviceOptimized, preload, onError]);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new Error('Failed to load image');
    setError(error);
    setLoading(false);
    onError?.(error);
  };

  // Generate sizes attribute for responsive images
  const generateSizesAttribute = (): string => {
    if (!enableResponsive) {
      return `${width}px`;
    }

    // Default responsive sizes - can be customized
    return `
      (max-width: 320px) 320px,
      (max-width: 640px) 640px,
      (max-width: 1024px) 1024px,
      ${width}px
    `.trim().replace(/\s+/g, ' ');
  };

  // Handle modern format support with fallbacks
  const renderPictureElement = () => {
    if (!enableResponsive || !imageSet) {
      return null;
    }

    return (
      <picture>
        {/* AVIF format */}
        {imageSet.formats.avif && (
          <source
            srcSet={imageSet.formats.avif}
            sizes={generateSizesAttribute()}
            type="image/avif"
          />
        )}

        {/* WebP format */}
        {imageSet.formats.webp && (
          <source
            srcSet={imageSet.formats.webp}
            sizes={generateSizesAttribute()}
            type="image/webp"
          />
        )}

        {/* Fallback JPEG/PNG */}
        <Image
          ref={imgRef}
          src={cachedSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          loading={enableLazyLoad && !priority ? 'lazy' : 'eager'}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={generateSizesAttribute()}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
    );
  };

  // Error state
  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  // Loading state
  if (loading && placeholder === 'empty') {
    return (
      <div
        className={`animate-pulse bg-gray-200 ${className}`}
        style={{ width, height }}
      />
    );
  }

  // Render picture element for responsive images or regular Image for simple cases
  if (enableResponsive && imageSet) {
    return renderPictureElement();
  }

  return (
    <Image
      ref={imgRef}
      src={cachedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={enableLazyLoad && !priority ? 'lazy' : 'eager'}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={generateSizesAttribute()}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

// Hook for preloading images
export const useImagePreloader = (urls: string[], priority: 'high' | 'normal' | 'low' = 'normal') => {
  useEffect(() => {
    const cacheService = ImageCacheService.getInstance();
    cacheService.preloadImages(urls, priority);
  }, [urls, priority]);
};

// Hook for prefetching images
export const useImagePrefetcher = (urls: string[]) => {
  useEffect(() => {
    const cacheService = ImageCacheService.getInstance();
    cacheService.prefetchImages(urls);
  }, [urls]);
};

// Card-specific optimized image component
export interface CardImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  variant?: 'thumbnail' | 'card' | 'large' | 'hero';
  aspectRatio?: 'card' | 'square' | 'wide';
}

export const CardImage: React.FC<CardImageProps> = ({
  variant = 'card',
  aspectRatio = 'card',
  className = '',
  ...props
}) => {
  // Define dimensions based on variant and aspect ratio
  const getDimensions = () => {
    const aspectRatios = {
      card: { width: 300, height: 420 }, // Standard card ratio
      square: { width: 300, height: 300 },
      wide: { width: 400, height: 225 }, // 16:9
    };

    const variants = {
      thumbnail: 0.4,
      card: 1,
      large: 1.5,
      hero: 2,
    };

    const base = aspectRatios[aspectRatio];
    const scale = variants[variant];

    return {
      width: Math.round(base.width * scale),
      height: Math.round(base.height * scale),
    };
  };

  const dimensions = getDimensions();

  return (
    <OptimizedImage
      {...props}
      {...dimensions}
      className={`rounded-lg shadow-md ${className}`}
      enableResponsive={variant !== 'thumbnail'}
      quality={variant === 'hero' ? 95 : 85}
      priority={variant === 'hero'}
    />
  );
};

// Avatar-specific optimized image component
export interface AvatarImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const dimension = sizes[size];

  return (
    <OptimizedImage
      {...props}
      width={dimension}
      height={dimension}
      className={`rounded-full ${className}`}
      enableResponsive={false}
      fit="cover"
      quality={80}
    />
  );
};

export default OptimizedImage;