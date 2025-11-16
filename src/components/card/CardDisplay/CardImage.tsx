/**
 * CardImage - Card image thumbnail with placeholder
 */

import React from 'react';
import Image from 'next/image';

interface CardImageProps {
  imageUrl?: string | null;
  imageUrlSmall?: string | null;
  name: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  imageUrl,
  imageUrlSmall,
  name,
}) => {
  const imageSrc = imageUrlSmall || imageUrl;

  return (
    <div className="h-20 w-16 overflow-hidden rounded border bg-gray-200">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          width={64}
          height={80}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
