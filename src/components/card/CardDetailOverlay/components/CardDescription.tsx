/**
 * Card description/effect text section
 */

import React from 'react';

interface CardDescriptionProps {
  description?: string | null;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  description,
}) => {
  if (!description) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
      <h3 className="mb-1.5 text-sm font-semibold text-white">Card Text</h3>
      <p className="text-sm leading-relaxed text-gray-300">{description}</p>
    </div>
  );
};
