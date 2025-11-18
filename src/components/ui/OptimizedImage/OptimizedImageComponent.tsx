/**
 * OptimizedImage - Main component with CDN, caching, and responsive support
 */

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useImageSetup } from './hooks/useImageSetup';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { PictureElement } from './components/PictureElement';
import { generateSizesAttribute } from './utils';
import type { OptimizedImageProps } from './types';

export const OptimizedImageComponent: React.FC<OptimizedImageProps> = ({
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
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const { imageSet, cachedSrc, error } = useImageSetup({
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
  });

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = (
    _event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const error = new Error('Failed to load image');
    setLoading(false);
    onError?.(error);
  };

  const sizesAttribute = generateSizesAttribute(enableResponsive, width);

  // Error state
  if (error) {
    return <ErrorState width={width} height={height} className={className} />;
  }

  // Loading state
  if (loading && placeholder === 'empty') {
    return <LoadingState width={width} height={height} className={className} />;
  }

  // Render picture element for responsive images
  if (enableResponsive && imageSet) {
    return (
      <PictureElement
        imageSet={imageSet}
        cachedSrc={cachedSrc}
        sizesAttribute={sizesAttribute}
        imgRef={imgRef}
        onLoad={handleLoad}
        onError={handleError}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        loading={enableLazyLoad && !priority ? 'lazy' : 'eager'}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        {...props}
      />
    );
  }

  // Render regular Image for simple cases
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
      sizes={sizesAttribute}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default OptimizedImageComponent;
