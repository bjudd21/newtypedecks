/**
 * Sign up link component
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface SignUpLinkProps {
  isLoading: boolean;
}

export const SignUpLink: React.FC<SignUpLinkProps> = ({ isLoading }) => {
  const router = useRouter();

  return (
    <div className="mt-6 text-center text-sm">
      <span className="text-muted-foreground">
        Don&apos;t have an account?{' '}
      </span>
      <button
        onClick={() => router.push('/auth/signup')}
        className="text-primary hover:text-primary/80 font-medium"
        disabled={isLoading}
      >
        Sign up
      </button>
    </div>
  );
};
