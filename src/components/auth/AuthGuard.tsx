'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@prisma/client';
import { Spinner } from '@/components/ui';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback,
  redirectTo = '/auth/signin'
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const router = useRouter();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated, redirect or show fallback
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // If specific role is required, check user role
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this content.
          </p>
          <p className="text-sm text-gray-500">
            Required role: {requiredRole} | Your role: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminGuard({ children, fallback, redirectTo }: Omit<AuthGuardProps, 'requiredRole'>) {
  return (
    <AuthGuard requiredRole={UserRole.ADMIN} fallback={fallback} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
}

export function ModeratorGuard({ children, fallback, redirectTo }: Omit<AuthGuardProps, 'requiredRole'>) {
  return (
    <AuthGuard requiredRole={UserRole.MODERATOR} fallback={fallback} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
}

export function UserGuard({ children, fallback, redirectTo }: Omit<AuthGuardProps, 'requiredRole'>) {
  return (
    <AuthGuard requiredRole={UserRole.USER} fallback={fallback} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
}