/**
 * ErrorState Component
 * Displays error message when profile fails to load
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface ErrorStateProps {
  error: string | null;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, className }) => {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <div className="mb-4 text-red-600">⚠️</div>
        <p className="text-gray-600">{error || 'Profile not found'}</p>
      </CardContent>
    </Card>
  );
};
