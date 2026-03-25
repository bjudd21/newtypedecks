/**
 * Reset password form component
 * Allows users to set a new password using a reset token
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?message=Password reset successful');
        }, 3000);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-6">
          <h1 className="mb-2 text-2xl font-bold text-green-300">
            Password Reset Successful!
          </h1>
          <p className="text-green-400">
            Your password has been updated successfully. You will be redirected
            to the sign-in page in a few seconds.
          </p>
        </div>
        <Button onClick={() => router.push('/auth/signin')} className="w-full">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="text-muted-foreground mb-1 block text-sm font-medium"
          >
            New Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={isLoading}
            minLength={8}
          />
          <p className="text-muted-foreground/70 mt-1 text-xs">
            Password must be at least 8 characters long
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-muted-foreground mb-1 block text-sm font-medium"
          >
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={isLoading}
            minLength={8}
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-900/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push('/auth/signin')}
          className="text-primary hover:text-primary/80 text-sm hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
