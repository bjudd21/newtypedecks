'use client';

/**
 * Authentication Provider Component
 *
 * Wraps the application with NextAuth session provider
 */

import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;