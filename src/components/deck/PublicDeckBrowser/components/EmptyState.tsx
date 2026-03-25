/**
 * Empty state component when no decks found
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

export const EmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground mb-4">No public decks found.</p>
        <p className="text-muted-foreground/70 text-sm">
          Try adjusting your search filters or check back later.
        </p>
      </CardContent>
    </Card>
  );
};
