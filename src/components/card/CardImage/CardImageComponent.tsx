/**
 * CardImage component - High-resolution card image display
 *
 * This component handles card images with multiple resolutions, loading states,
 * zoom functionality, and proper fallbacks. Uses OptimizedImage for CDN and advanced optimization.
 */

'use client';

import React from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CardImageAttribution } from '@/components/layout/BandaiNamcoAttribution';
import { cn } from '@/lib/utils';
import { getCardImageProps } from '@/lib/utils/accessibility';
import { SIZE_CONFIGS } from './constants';
import { getImageUrl, getZoomImageUrl } from './utils';
import { useImageState } from './hooks/useImageState';
import { useImageHandlers } from './hooks/useImageHandlers';
import { ImagePlaceholder } from './components/ImagePlaceholder';
import { LoadingState } from './components/LoadingState';
import { ZoomIndicator } from './components/ZoomIndicator';
import { SpecialCardIndicators } from './components/SpecialCardIndicators';
import { ZoomModal } from './components/ZoomModal';
import type { CardImageProps } from './types';

export const CardImageComponent: React.FC<CardImageProps> = ({
  name,
  imageUrl,
  imageUrlSmall,
  imageUrlLarge,
  size = 'medium',
  className,
  clickToZoom = false,
  onClick,
  showPlaceholder = true,
  placeholder,
  priority = false,
  showAttribution = true,
}) => {
  // State management
  const {
    isLoading,
    hasError,
    showZoom,
    handleImageLoad,
    handleImageError,
    openZoom,
    closeZoom,
  } = useImageState();

  // Event handlers
  const { handleClick, handleKeyDown } = useImageHandlers({
    onClick,
    clickToZoom,
    hasError,
    openZoom,
  });

  // Image URLs
  const sizeConfig = SIZE_CONFIGS[size];
  const selectedImageUrl = getImageUrl(
    size,
    imageUrl,
    imageUrlSmall,
    imageUrlLarge
  );
  const zoomImageUrl = getZoomImageUrl(imageUrl, imageUrlSmall, imageUrlLarge);

  // Generate accessibility props for card image
  const _cardImageA11yProps = getCardImageProps(
    name,
    size,
    clickToZoom || !!onClick
  );

  return (
    <>
      {/* Main image container */}
      <div
        className={cn(
          'bg-accent relative overflow-hidden rounded-lg border',
          sizeConfig.className,
          className,
          (clickToZoom || onClick) &&
            'focus:ring-primary cursor-pointer transition-shadow hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none',
          hasError && 'border-border'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...(clickToZoom || onClick
          ? {
              tabIndex: 0,
              role: 'button',
              'aria-label': `${name} card image${clickToZoom ? ' - Click to zoom' : ''}`,
            }
          : {
              role: 'img',
              'aria-label': `${name} card image`,
            })}
      >
        {/* Loading state */}
        {isLoading && showPlaceholder && <LoadingState cardName={name} />}

        {/* Error state or no image */}
        {(hasError || !selectedImageUrl) && (
          <div
            className="absolute inset-0"
            role="img"
            aria-label={`${name} card image unavailable`}
          >
            <ImagePlaceholder customPlaceholder={placeholder} />
          </div>
        )}

        {/* Image */}
        {selectedImageUrl && !hasError && (
          <OptimizedImage
            src={selectedImageUrl}
            alt={`${name} card image`}
            width={sizeConfig.width}
            height={sizeConfig.height}
            className="h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            format="auto"
            fit="cover"
            quality={size === 'fullsize' ? 95 : 85}
            enableResponsive={size !== 'thumbnail'}
            enableCache={true}
          />
        )}

        {/* Attribution overlay */}
        {showAttribution && selectedImageUrl && !hasError && (
          <CardImageAttribution className="pointer-events-none" />
        )}

        {/* Zoom indicator */}
        {clickToZoom && !hasError && selectedImageUrl && <ZoomIndicator />}

        {/* Special card indicators */}
        <SpecialCardIndicators />
      </div>

      {/* Zoom modal */}
      {showZoom && zoomImageUrl && (
        <ZoomModal
          cardName={name}
          zoomImageUrl={zoomImageUrl}
          showAttribution={showAttribution}
          onClose={closeZoom}
        />
      )}
    </>
  );
};

export default CardImageComponent;
