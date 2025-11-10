/**
 * Forgot password page
 */

import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | Gundam Card Game',
  description: 'Reset your password for Gundam Card Game',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <ForgotPasswordForm
        onBackToSignIn={() => (window.location.href = '/auth/signin')}
      />
    </div>
  );
}
