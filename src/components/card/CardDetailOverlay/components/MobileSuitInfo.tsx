/**
 * Mobile suit pilot and model information section
 */

import React from 'react';

interface MobileSuitInfoProps {
  pilot?: string | null;
  model?: string | null;
}

export const MobileSuitInfo: React.FC<MobileSuitInfoProps> = ({
  pilot,
  model,
}) => {
  if (!pilot && !model) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
      <h3 className="mb-1.5 text-sm font-semibold text-white">
        Mobile Suit Information
      </h3>
      {pilot && (
        <div className="mb-1 text-sm">
          <span className="text-muted-foreground">Pilot: </span>
          <span className="text-white">{pilot}</span>
        </div>
      )}
      {model && (
        <div className="text-sm">
          <span className="text-muted-foreground">Model: </span>
          <span className="text-white">{model}</span>
        </div>
      )}
    </div>
  );
};
