/**
 * Forgot password link component
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ForgotPasswordLinkProps {
  isLoading: boolean;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  isLoading,
}) => {
  const router = useRouter();

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={() => router.push('/auth/forgot-password')}
        className="text-primary hover:text-primary/80 text-sm hover:underline"
        disabled={isLoading}
      >
        Forgot password?
      </button>
    </div>
  );
};
