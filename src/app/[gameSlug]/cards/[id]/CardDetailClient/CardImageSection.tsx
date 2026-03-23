import React from 'react';
import { CardImage } from '@/components/card';
import { Card, CardContent } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

export function CardImageSection({ card }: { card: CardWithRelations }) {
  return (
    <div>
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-6">
          <CardImage
            name={card.name}
            imageUrl={card.imageUrl || undefined}
            imageUrlSmall={card.imageUrlSmall || undefined}
            imageUrlLarge={card.imageUrlLarge || undefined}
            size="fullsize"
            clickToZoom={true}
            priority={true}
            className="mx-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}
