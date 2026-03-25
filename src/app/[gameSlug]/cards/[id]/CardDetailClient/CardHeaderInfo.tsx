import React from 'react';
import type { CardWithRelations } from '@/lib/types/card';

export function CardHeaderInfo({ card }: { card: CardWithRelations }) {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-2 text-4xl font-bold">{card.name}</h1>
      {card.pilot && (
        <p className="text-foreground mb-1 text-xl">Pilot: {card.pilot}</p>
      )}
      {card.model && (
        <p className="text-muted-foreground text-lg">Model: {card.model}</p>
      )}
    </div>
  );
}
