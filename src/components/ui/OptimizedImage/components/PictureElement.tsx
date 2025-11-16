/**
 * Picture element with responsive image sources
 */

import React from 'react';
import Image, { ImageProps } from 'next/image';
import type { ResponsiveImageSet } from '@/lib/services/cdnService';

interface PictureElementProps extends Omit<ImageProps, 'src'> {
  imageSet: ResponsiveImageSet;
  cachedSrc: string;
  sizesAttribute: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onLoad: () => void;
  onError: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const PictureElement: React.FC<PictureElementProps> = ({
  imageSet,
  cachedSrc,
  sizesAttribute,
  imgRef,
  onLoad,
  onError,
  ...props
}) => {
  return (
    <picture>
      {/* AVIF format */}
      {imageSet.formats.avif && (
        <source
          srcSet={imageSet.formats.avif}
          sizes={sizesAttribute}
          type="image/avif"
        />
      )}

      {/* WebP format */}
      {imageSet.formats.webp && (
        <source
          srcSet={imageSet.formats.webp}
          sizes={sizesAttribute}
          type="image/webp"
        />
      )}

      {/* Fallback JPEG/PNG */}
      <Image
        ref={imgRef}
        src={cachedSrc}
        sizes={sizesAttribute}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    </picture>
  );
};
