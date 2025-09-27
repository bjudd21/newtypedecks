'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

interface AuthStatusProps {
  className?: string;
}

export function AuthStatus({ className = '' }: AuthStatusProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/auth/signin')}
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="hidden sm:block text-sm text-gray-700">
        Welcome, <span className="font-medium">{user?.name || user?.email}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDashboard}
        >
          Dashboard
        </Button>

        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <span>{user?.name?.split(' ')[0] || 'Menu'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile Settings
              </button>
              <button
                onClick={() => router.push('/collection')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                My Collection
              </button>
              <button
                onClick={() => router.push('/decks')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                My Decks
              </button>
              {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                <>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => router.push('/admin')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Admin Panel
                  </button>
                </>
              )}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthStatus;