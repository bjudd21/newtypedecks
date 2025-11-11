'use client';

/**
 * Forgot password page
 */

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <ForgotPasswordForm
        onBackToSignIn={() => (window.location.href = '/auth/signin')}
      />
    </div>
  );
}
