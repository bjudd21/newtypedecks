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
    <div className="h-12 w-12 overflow-hidden rounded-md bg-[#1a1625]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
          No Image
        </div>
      )}
    </div>
  );
};
