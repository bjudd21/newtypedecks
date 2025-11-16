/**
 * CardImage Module Exports
 *
 * This module provides a comprehensive card image component with:
 * - Multiple size variants (thumbnail, small, medium, large, fullsize)
 * - Click-to-zoom functionality with modal overlay
 * - Loading states and placeholder handling
 * - CDN optimization with OptimizedImage integration
 * - Keyboard accessibility support
 * - Bandai Namco attribution overlay
 * - Fallback image handling
 */

// Main component
export { CardImageComponent } from './CardImageComponent';

// Types
export type { CardImageProps, SizeConfig, ImageSize } from './types';

// Constants
export { SIZE_CONFIGS } from './constants';

// Utilities
export { getImageUrl, getZoomImageUrl } from './utils';

// Hooks
export { useImageState } from './hooks/useImageState';
export { useImageHandlers } from './hooks/useImageHandlers';

// Components
export { ImagePlaceholder } from './components/ImagePlaceholder';
export { LoadingState } from './components/LoadingState';
export { ZoomIndicator } from './components/ZoomIndicator';
export { SpecialCardIndicators } from './components/SpecialCardIndicators';
export { ZoomModal } from './components/ZoomModal';
