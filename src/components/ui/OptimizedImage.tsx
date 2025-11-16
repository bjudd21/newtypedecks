/**
 * OptimizedImage - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./OptimizedImage/ directory.
 */

export { OptimizedImageComponent as OptimizedImage } from './OptimizedImage/OptimizedImageComponent';
export { CardImage } from './OptimizedImage/CardImage';
export { AvatarImage } from './OptimizedImage/AvatarImage';
export { useImagePreloader } from './OptimizedImage/hooks/useImagePreloader';
export { useImagePrefetcher } from './OptimizedImage/hooks/useImagePrefetcher';
export { useImageSetup } from './OptimizedImage/hooks/useImageSetup';
export { ErrorState } from './OptimizedImage/components/ErrorState';
export { LoadingState } from './OptimizedImage/components/LoadingState';
export { PictureElement } from './OptimizedImage/components/PictureElement';
export type {
  OptimizedImageProps,
  CardImageProps,
  AvatarImageProps,
} from './OptimizedImage/types';
export * from './OptimizedImage/utils';
export { OptimizedImageComponent as default } from './OptimizedImage/OptimizedImageComponent';
