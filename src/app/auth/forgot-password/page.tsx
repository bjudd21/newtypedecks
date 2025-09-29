/**
 * Forgot password page
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | Gundam Card Game',
  description: 'Reset your password for Gundam Card Game',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPasswordForm
        onBackToSignIn={() => window.location.href = '/auth/signin'}
      />
    </div>
  );
}