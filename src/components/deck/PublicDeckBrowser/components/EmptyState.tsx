/**
 * Empty state component when no decks found
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

export const EmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="mb-4 text-gray-600">No public decks found.</p>
        <p className="text-sm text-gray-500">
          Try adjusting your search filters or check back later.
        </p>
      </CardContent>
    </Card>
  );
};
