/**
 * Loading state component for FavoriteDeckManager
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

export const LoadingState: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Loading favorite decks...</div>
        </CardContent>
      </Card>
    </div>
  );
};
