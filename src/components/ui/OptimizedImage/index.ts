/**
 * OptimizedImage module exports
 */

export { OptimizedImageComponent } from './OptimizedImageComponent';
export { CardImage } from './CardImage';
export { AvatarImage } from './AvatarImage';

// Hooks
export { useImageSetup } from './hooks/useImageSetup';
export { useImagePreloader } from './hooks/useImagePreloader';
export { useImagePrefetcher } from './hooks/useImagePrefetcher';

// Components
export { ErrorState } from './components/ErrorState';
export { LoadingState } from './components/LoadingState';
export { PictureElement } from './components/PictureElement';

// Utils
export * from './utils';

// Types
export * from './types';

// Default export
export { OptimizedImageComponent as default } from './OptimizedImageComponent';
