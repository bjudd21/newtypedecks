/**
 * Color badges display component
 */

import React from 'react';
import { Badge } from '@/components/ui';

interface ColorBadgesProps {
  colors: string[];
}

export const ColorBadges: React.FC<ColorBadgesProps> = ({ colors }) => {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-wrap gap-1">
      {colors.slice(0, 3).map((color) => (
        <Badge key={color} variant="secondary" className="text-xs">
          {color}
        </Badge>
      ))}
      {colors.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{colors.length - 3}
        </Badge>
      )}
    </div>
  );
};
