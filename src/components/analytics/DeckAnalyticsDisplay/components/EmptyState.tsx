/**
 * Empty state component when no cards in deck
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface EmptyStateProps {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          Add cards to your deck to see analytics
        </p>
      </CardContent>
    </Card>
  );
};
