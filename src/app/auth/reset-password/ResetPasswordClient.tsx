/**
 * Reset password client component
 * Handles URL parameters and renders the reset form
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Invalid Reset Link</h1>
          <p className="text-red-600 mb-4">
            The password reset link is invalid or missing. Please request a new password reset.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}