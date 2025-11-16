/**
 * CardSpecialIndicators - Foil, promo, alternate art badges
 */

import React from 'react';
import { Badge } from '@/components/ui';

interface CardSpecialIndicatorsProps {
  isFoil?: boolean;
  isPromo?: boolean;
  isAlternate?: boolean;
}

export const CardSpecialIndicators: React.FC<CardSpecialIndicatorsProps> = ({
  isFoil,
  isPromo,
  isAlternate,
}) => {
  const hasIndicators = isFoil || isPromo || isAlternate;

  if (!hasIndicators) {
    return null;
  }

  return (
    <div className="mt-3 flex gap-1">
      {isFoil && (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-xs text-yellow-800"
        >
          Foil
        </Badge>
      )}
      {isPromo && (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-xs text-purple-800"
        >
          Promo
        </Badge>
      )}
      {isAlternate && (
        <Badge
          variant="secondary"
          className="bg-green-100 text-xs text-green-800"
        >
          Alt Art
        </Badge>
      )}
    </div>
  );
};
