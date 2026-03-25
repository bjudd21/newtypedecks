/**
 * Card action buttons (Add to Deck, Add to Collection)
 */

import React from 'react';
import { Button } from '@/components/ui';

export const ActionButtons: React.FC = () => {
  return (
    <div className="flex gap-3 pt-2">
      <Button variant="cyber" className="flex-1">
        Add to Deck
      </Button>
      <Button
        variant="outline"
        className="text-foreground flex-1 border-gray-600"
      >
        Add to Collection
      </Button>
    </div>
  );
};
