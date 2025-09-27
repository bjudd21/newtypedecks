/**
 * CardImage component - High-resolution card image display
 *
 * This component handles card images with multiple resolutions, loading states,
 * zoom functionality, and proper fallbacks. Uses Next.js Image for optimization.
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

  const selectedImageUrl = getImageUrl();
  const zoomImageUrl = getZoomImageUrl();

  // Placeholder component
  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
        <svg
          className="w-8 h-8 mb-2"
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
        <span className="text-xs text-center px-2">No Image</span>
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
          (clickToZoom || onClick) && 'cursor-pointer hover:shadow-lg transition-shadow',
          hasError && 'border-gray-200'
        )}
        onClick={handleClick}
      >
        {/* Loading state */}
        {isLoading && showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}

        {/* Error state or no image */}
        {(hasError || !selectedImageUrl) && (
          <div className="absolute inset-0">
            {renderPlaceholder()}
          </div>
        )}

        {/* Image */}
        {selectedImageUrl && !hasError && (
          <Image
            src={selectedImageUrl}
            alt={`${name} card image`}
            width={sizeConfig.width}
            height={sizeConfig.height}
            className="object-cover w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            sizes={`${sizeConfig.width}px`}
          />
        )}

        {/* Zoom indicator */}
        {clickToZoom && !hasError && selectedImageUrl && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black bg-opacity-50 text-white p-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        )}

        {/* Special card indicators */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Foil indicator */}
          <div className="w-2 h-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Zoom modal */}
      {showZoom && zoomImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative">
              <Image
                src={zoomImageUrl}
                alt={`${name} card image (full size)`}
                width={600}
                height={750}
                className="object-contain max-w-full max-h-[80vh] rounded-lg"
                priority
              />

              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">{name}</h3>
                <p className="text-gray-300 text-sm">Click anywhere to close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardImage;