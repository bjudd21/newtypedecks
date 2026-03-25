/**
 * Card image display section
 */

import React from 'react';
import Image from 'next/image';

interface CardImageSectionProps {
  imageUrl?: string | null;
  cardName: string;
}

export const CardImageSection: React.FC<CardImageSectionProps> = ({
  imageUrl,
  cardName,
}) => {
  return (
    <div className="space-y-4">
      <div className="aspect-[5/7] overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={cardName}
            width={500}
            height={700}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 500px"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground/70 flex h-full w-full items-center justify-center">
            <svg
              className="h-16 w-16"
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
    </div>
  );
};
