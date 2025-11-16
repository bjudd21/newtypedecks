/**
 * Avatar-specific optimized image component
 */

import React from 'react';
import { OptimizedImageComponent } from './OptimizedImageComponent';
import { getAvatarImageDimensions } from './utils';
import type { AvatarImageProps } from './types';

export const AvatarImage: React.FC<AvatarImageProps> = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const dimension = getAvatarImageDimensions(size);

  return (
    <OptimizedImageComponent
      {...props}
      width={dimension}
      height={dimension}
      className={`rounded-full ${className}`}
      enableResponsive={false}
      fit="cover"
      quality={80}
    />
  );
};

export default AvatarImage;
