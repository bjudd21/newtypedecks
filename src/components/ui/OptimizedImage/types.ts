/**
 * Type definitions for OptimizedImage components
 */

import type { ImageProps } from 'next/image';

export interface OptimizedImageProps
  extends Omit<ImageProps, 'src' | 'srcSet' | 'onLoad' | 'onError'> {
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

export interface CardImageProps
  extends Omit<OptimizedImageProps, 'width' | 'height'> {
  variant?: 'thumbnail' | 'card' | 'large' | 'hero';
  aspectRatio?: 'card' | 'square' | 'wide';
}

export interface AvatarImageProps
  extends Omit<OptimizedImageProps, 'width' | 'height'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
