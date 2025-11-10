'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  // Role checking functions
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;

    const userRole = user.role;

    // Role hierarchy: ADMIN > MODERATOR > USER
    switch (requiredRole) {
      case UserRole.USER:
        return (
          userRole === UserRole.USER ||
          userRole === UserRole.MODERATOR ||
          userRole === UserRole.ADMIN
        );
      case UserRole.MODERATOR:
        return userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN;
      case UserRole.ADMIN:
        return userRole === UserRole.ADMIN;
      default:
        return false;
    }
  };

  const isAdmin = () => hasRole(UserRole.ADMIN);
  const isModerator = () => hasRole(UserRole.MODERATOR);
  const isUser = () => hasRole(UserRole.USER);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
    isUser,
  };
}
