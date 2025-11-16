/**
 * CardImage - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into CardImage/
 */

// Main component exports
export { CardImageComponent as CardImage } from './CardImage/CardImageComponent';
export { CardImageComponent as default } from './CardImage/CardImageComponent';

// Type exports
export type { CardImageProps, SizeConfig, ImageSize } from './CardImage/types';

// Constants exports
export { SIZE_CONFIGS } from './CardImage/constants';

// Utility exports
export { getImageUrl, getZoomImageUrl } from './CardImage/utils';

// Hook exports
export { useImageState } from './CardImage/hooks/useImageState';
export { useImageHandlers } from './CardImage/hooks/useImageHandlers';

// Component exports
export { ImagePlaceholder } from './CardImage/components/ImagePlaceholder';
export { LoadingState } from './CardImage/components/LoadingState';
export { ZoomIndicator } from './CardImage/components/ZoomIndicator';
export { SpecialCardIndicators } from './CardImage/components/SpecialCardIndicators';
export { ZoomModal } from './CardImage/components/ZoomModal';
