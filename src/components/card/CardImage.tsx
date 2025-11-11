/**
 * CardImage component - High-resolution card image display
 *
 * This component handles card images with multiple resolutions, loading states,
 * zoom functionality, and proper fallbacks. Uses OptimizedImage for CDN and advanced optimization.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CardImageAttribution } from '@/components/layout/BandaiNamcoAttribution';
import { cn } from '@/lib/utils';
import {
  getCardImageProps,
  handleKeyboardActivation,
  KEYBOARD_CODES,
} from '@/lib/utils/accessibility';

export interface CardImageProps {
  /** Card name for alt text */
  name: string;
  /** High-resolution image URL */
  imageUrl?: string;
  /** Small/thumbnail image URL */
  imageUrlSmall?: string;
  /** Large image URL */
  imageUrlLarge?: string;
  /** Image size variant */
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'fullsize';
  /** Additional CSS classes */
  className?: string;
  /** Enable click to zoom functionality */
  clickToZoom?: boolean;
  /** Callback when image is clicked */
  onClick?: () => void;
  /** Show loading placeholder */
  showPlaceholder?: boolean;
  /** Custom placeholder content */
  placeholder?: React.ReactNode;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Show Bandai Namco attribution overlay */
  showAttribution?: boolean;
}

const SIZE_CONFIGS = {
  thumbnail: { width: 64, height: 80, className: 'w-16 h-20' },
  small: { width: 120, height: 150, className: 'w-30 h-[150px]' },
  medium: { width: 200, height: 250, className: 'w-50 h-[250px]' },
  large: { width: 300, height: 375, className: 'w-75 h-[375px]' },
  fullsize: { width: 400, height: 500, className: 'w-100 h-[500px]' },
};

export const CardImage: React.FC<CardImageProps> = ({
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const sizeConfig = SIZE_CONFIGS[size];

  // Select the best image URL based on size
  const getImageUrl = useCallback(() => {
    switch (size) {
      case 'thumbnail':
      case 'small':
        return imageUrlSmall || imageUrl;
      case 'large':
      case 'fullsize':
        return imageUrlLarge || imageUrl;
      default:
        return imageUrl || imageUrlSmall;
    }
  }, [size, imageUrl, imageUrlSmall, imageUrlLarge]);

  // Get zoom image URL (always use the highest resolution available)
  const getZoomImageUrl = useCallback(() => {
    return imageUrlLarge || imageUrl || imageUrlSmall;
  }, [imageUrl, imageUrlSmall, imageUrlLarge]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickToZoom && !hasError) {
      setShowZoom(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    handleKeyboardActivation(event, handleClick);
  };

  const selectedImageUrl = getImageUrl();
  const zoomImageUrl = getZoomImageUrl();

  // Generate accessibility props for card image
  const _cardImageA11yProps = getCardImageProps(
    name,
    size,
    clickToZoom || !!onClick
  );

  // Placeholder component
  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
        <svg
          className="mb-2 h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="px-2 text-center text-xs">No Image</span>
      </div>
    );
  };

  return (
    <>
      {/* Main image container */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border bg-gray-50',
          sizeConfig.className,
          className,
          (clickToZoom || onClick) &&
            'cursor-pointer transition-shadow hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
          hasError && 'border-gray-200'
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
        {isLoading && showPlaceholder && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-100"
            role="status"
            aria-label={`Loading ${name} card image`}
            aria-live="polite"
          >
            <div className="animate-pulse">
              <div className="h-8 w-8 rounded bg-gray-200"></div>
            </div>
          </div>
        )}

        {/* Error state or no image */}
        {(hasError || !selectedImageUrl) && (
          <div
            className="absolute inset-0"
            role="img"
            aria-label={`${name} card image unavailable`}
          >
            {renderPlaceholder()}
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
        {clickToZoom && !hasError && selectedImageUrl && (
          <div className="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <div
              className="bg-opacity-50 rounded bg-black p-1 text-white"
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Special card indicators */}
        <div
          className="absolute top-2 left-2 flex flex-col gap-1"
          aria-hidden="true"
        >
          {/* Foil indicator */}
          <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
        </div>
      </div>

      {/* Zoom modal */}
      {showZoom && zoomImageUrl && (
        <div
          className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={() => setShowZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="zoom-modal-title"
          aria-describedby="zoom-modal-description"
        >
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setShowZoom(false)}
              onKeyDown={(e) => {
                if (e.key === KEYBOARD_CODES.ESCAPE) {
                  setShowZoom(false);
                }
              }}
              className="absolute -top-12 right-0 rounded-md p-1 text-white transition-colors hover:text-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
              aria-label="Close zoom view"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative">
              <OptimizedImage
                src={zoomImageUrl}
                alt={`${name} card image (full size)`}
                width={600}
                height={750}
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
                priority
                format="auto"
                fit="contain"
                quality={95}
                enableResponsive={true}
                enableCache={true}
              />

              {/* Attribution overlay for zoom */}
              {showAttribution && (
                <CardImageAttribution className="pointer-events-none" />
              )}

              {/* Image info overlay */}
              <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-gradient-to-t from-black to-transparent p-4">
                <h3
                  id="zoom-modal-title"
                  className="text-lg font-semibold text-white"
                >
                  {name}
                </h3>
                <p
                  id="zoom-modal-description"
                  className="text-sm text-gray-300"
                >
                  Card image zoom view. Press Escape or click anywhere to close
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardImage;
