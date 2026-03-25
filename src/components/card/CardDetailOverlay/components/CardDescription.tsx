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
    <div className="border-border bg-card rounded-lg border p-3">
      <h3 className="text-foreground mb-1.5 text-sm font-semibold">
        Card Text
      </h3>
      <p className="text-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};
