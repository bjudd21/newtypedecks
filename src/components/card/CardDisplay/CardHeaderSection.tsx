/**
 * CardHeaderSection - Card header with name, pilot, model, and image
 */

import React from 'react';
import { CardImage } from './CardImage';

interface CardHeaderSectionProps {
  name: string;
  pilot?: string | null;
  model?: string | null;
  imageUrl?: string | null;
  imageUrlSmall?: string | null;
}

export const CardHeaderSection: React.FC<CardHeaderSectionProps> = ({
  name,
  pilot,
  model,
  imageUrl,
  imageUrlSmall,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold text-gray-900">{name}</h3>
        {pilot && (
          <p className="truncate text-sm text-gray-600">Pilot: {pilot}</p>
        )}
        {model && (
          <p className="truncate text-sm text-gray-500">Model: {model}</p>
        )}
      </div>

      {/* Card image thumbnail */}
      <div className="ml-3 flex-shrink-0">
        <CardImage
          imageUrl={imageUrl}
          imageUrlSmall={imageUrlSmall}
          name={name}
        />
      </div>
    </div>
  );
};
