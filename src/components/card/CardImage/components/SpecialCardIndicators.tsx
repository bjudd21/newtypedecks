/**
 * Special card indicators component (foil, promo, etc.)
 */

import React from 'react';

export const SpecialCardIndicators: React.FC = () => {
  return (
    <div
      className="absolute top-2 left-2 flex flex-col gap-1"
      aria-hidden="true"
    >
      {/* Foil indicator */}
      <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
    </div>
  );
};
