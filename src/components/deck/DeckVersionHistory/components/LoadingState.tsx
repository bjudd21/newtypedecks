/**
 * Loading state component for version history
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className }) => {
  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            Loading version history...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
