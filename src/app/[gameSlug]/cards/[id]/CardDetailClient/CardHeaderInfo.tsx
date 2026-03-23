import React from 'react';
import type { CardWithRelations } from '@/lib/types/card';

export function CardHeaderInfo({ card }: { card: CardWithRelations }) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-4xl font-bold text-white">{card.name}</h1>
      {card.pilot && (
        <p className="mb-1 text-xl text-gray-300">Pilot: {card.pilot}</p>
      )}
      {card.model && (
        <p className="text-lg text-gray-400">Model: {card.model}</p>
      )}
    </div>
  );
}
