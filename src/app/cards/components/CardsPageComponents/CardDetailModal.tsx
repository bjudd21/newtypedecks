import React from 'react';
import { CardDisplay } from '@/components/card/CardDisplay';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface CardDetailModalProps {
  card: CardWithRelations;
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{card.name}</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <CardDisplay card={card} showFullDetails={true} />
        </CardContent>
      </Card>
    </div>
  );
}
