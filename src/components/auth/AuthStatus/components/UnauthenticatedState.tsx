/**
 * Unauthenticated state component with login/register buttons
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface UnauthenticatedStateProps {
  className?: string;
}

export const UnauthenticatedState: React.FC<UnauthenticatedStateProps> = ({
  className = '',
}) => {
  const router = useRouter();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/auth/signup')}
      >
        Register
      </Button>
      <Button
        variant="critical"
        size="sm"
        onClick={() => router.push('/auth/signin')}
      >
        Login
      </Button>
    </div>
  );
};
