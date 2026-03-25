/**
 * Unauthenticated view component
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui';

interface UnauthenticatedViewProps {
  className?: string;
}

export const UnauthenticatedView: React.FC<UnauthenticatedViewProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Sign in to manage your card collection
          </p>
          <button
            onClick={() => (window.location.href = '/auth/signin')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Sign In
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
