/**
 * Loading indicator component for infinite scroll
 */

import React from 'react';
import { Spinner } from '@/components/ui';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading more cards...',
}) => {
  return (
    <div className="flex justify-center py-8">
      <div className="text-muted-foreground flex items-center gap-2">
        <Spinner size="sm" />
        <span>{message}</span>
      </div>
    </div>
  );
};
