/**
 * Card thumbnail component
 */

import React from 'react';
import Image from 'next/image';

interface CardThumbnailProps {
  imageUrl?: string | null;
  name: string;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  imageUrl,
  name,
}) => {
  return (
    <div className="bg-background h-12 w-12 overflow-hidden rounded-md">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={48}
          height={48}
          loading="lazy"
          sizes="48px"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="text-muted-foreground/70 flex h-full w-full items-center justify-center text-xs">
          No Image
        </div>
      )}
    </div>
  );
};
