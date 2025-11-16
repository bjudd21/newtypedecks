/**
 * Loading state component for analytics
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface LoadingStateProps {
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Analyzing deck...</p>
        </div>
      </CardContent>
    </Card>
  );
};
