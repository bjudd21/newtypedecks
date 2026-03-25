/**
 * Card abilities section
 */

import React from 'react';

interface AbilitiesSectionProps {
  abilities?: string | null;
}

export const AbilitiesSection: React.FC<AbilitiesSectionProps> = ({
  abilities,
}) => {
  if (!abilities || abilities.length === 0) return null;

  return (
    <div className="border-border bg-card rounded-lg border p-3">
      <h3 className="mb-1.5 text-sm font-semibold text-white">Abilities</h3>
      <p className="text-foreground text-sm leading-relaxed">{abilities}</p>
    </div>
  );
};
