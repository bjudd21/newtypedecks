/**
 * Forgot password link component
 */

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
        className="text-sm text-[#8b7aaa] hover:text-[#a89ec7] hover:underline"
        disabled={isLoading}
      >
        Forgot password?
      </button>
    </div>
  );
};
