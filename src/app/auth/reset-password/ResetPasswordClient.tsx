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
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="mb-2 text-2xl font-bold text-red-800">
            Invalid Reset Link
          </h1>
          <p className="mb-4 text-red-600">
            The password reset link is invalid or missing. Please request a new
            password reset.
          </p>
          <a
            href="/auth/forgot-password"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded px-4 py-2 transition-colors"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
