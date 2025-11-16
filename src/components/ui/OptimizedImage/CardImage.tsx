/**
 * Card-specific optimized image component
 */

import React from 'react';
import { OptimizedImageComponent } from './OptimizedImageComponent';
import { getCardImageDimensions } from './utils';
import type { CardImageProps } from './types';

export const CardImage: React.FC<CardImageProps> = ({
  variant = 'card',
  aspectRatio = 'card',
  className = '',
  ...props
}) => {
  const dimensions = getCardImageDimensions(variant, aspectRatio);

  return (
    <OptimizedImageComponent
      {...props}
      {...dimensions}
      className={`rounded-lg shadow-md ${className}`}
      enableResponsive={variant !== 'thumbnail'}
      quality={variant === 'hero' ? 95 : 85}
      priority={variant === 'hero'}
    />
  );
};

export default CardImage;
