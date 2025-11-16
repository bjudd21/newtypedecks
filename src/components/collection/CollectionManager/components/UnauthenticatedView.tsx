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
      <Card className="border-[#443a5c] bg-[#2d2640]">
        <CardContent className="py-12 text-center">
          <p className="mb-4 text-gray-400">
            Sign in to manage your card collection
          </p>
          <button
            onClick={() => (window.location.href = '/auth/signin')}
            className="rounded bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] px-4 py-2 text-white hover:from-[#a89ec7] hover:to-[#8b7aaa]"
          >
            Sign In
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
