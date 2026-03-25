/**
 * Card set information section
 */

import React from 'react';
import type { CardWithRelations } from '@/lib/types/card';

interface SetInformationProps {
  card: CardWithRelations;
}

export const SetInformation: React.FC<SetInformationProps> = ({ card }) => {
  if (!card.series && !card.set?.name) return null;

  return (
    <div className="border-border bg-card rounded-lg border p-3">
      <h3 className="text-foreground mb-1.5 text-sm font-semibold">
        Set Information
      </h3>
      {card.series && (
        <div className="mb-1 text-sm">
          <span className="text-muted-foreground">Series: </span>
          <span className="text-foreground">{card.series}</span>
        </div>
      )}
      {card.set?.name && (
        <div className="mb-1 text-sm">
          <span className="text-muted-foreground">Set: </span>
          <span className="text-foreground">{card.set.name}</span>
        </div>
      )}
      {card.setNumber && (
        <div className="text-sm">
          <span className="text-muted-foreground">Card Number: </span>
          <span className="text-foreground">{card.setNumber}</span>
        </div>
      )}
    </div>
  );
};
