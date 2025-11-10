/**
 * NextAuth.js configuration
 *
 * Handles authentication providers, session management, and user callbacks
 */

import { NextAuthOptions, Session } from 'next-auth';
import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import bcrypt from 'bcryptjs';
import { prisma } from './database';
import { UserRole } from '@prisma/client';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      emailVerified?: Date | null;
    };
  }

  interface User {
    role: UserRole;
    emailVerified?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    emailVerified?: Date | null;
  }
}

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter for database sessions
  adapter: PrismaAdapter(prisma),

  // Configure session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Authentication providers
  providers: [
    // Email/password authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password with bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),

    // Google OAuth (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // Discord OAuth (optional)
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  // Custom pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Callbacks
  callbacks: {
    // JWT callback - runs whenever a JWT is created, updated, or accessed
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },

    // Session callback - runs whenever a session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }

      return session;
    },

    // Sign in callback - controls if user is allowed to sign in
    async signIn({ user, account, profile }) {
      // Allow all sign ins for credentials provider
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth providers, check if user exists or create new user
      if (account?.provider === 'google' || account?.provider === 'discord') {
        if (!user.email) {
          return false;
        }

        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If user doesn't exist, create new user
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: UserRole.USER, // Default role for new users
              },
            });
          }

          return true;
        } catch (error) {
          console.error('Error during OAuth sign in:', error);
          return false;
        }
      }

      return true;
    },
  },

  // Events
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },

    async signOut({ session }) {
      console.log('User signed out:', {
        userId: session?.user?.id,
        email: session?.user?.email,
      });
    },

    async createUser({ user }) {
      console.log('New user created:', {
        userId: user.id,
        email: user.email,
      });
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to get server-side session
export const getServerSession = (options = authOptions) => nextAuthGetServerSession(options);

// Helper type for server-side session
export type ServerSession = Session | null;

// Helper function to check if user has required role
export function hasRole(session: ServerSession, requiredRole: UserRole): boolean {
  if (!session?.user) return false;

  const userRole = session.user.role;

  // Role hierarchy: ADMIN > MODERATOR > USER
  switch (requiredRole) {
    case UserRole.USER:
      return userRole === UserRole.USER || userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN;
    case UserRole.MODERATOR:
      return userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN;
    case UserRole.ADMIN:
      return userRole === UserRole.ADMIN;
    default:
      return false;
  }
}

// Helper function to require authentication
export function requireAuth(session: ServerSession): asserts session is NonNullable<ServerSession> {
  if (!session || !session.user) {
    throw new Error('Authentication required');
  }
}

// Helper function to require specific role
export function requireRole(session: ServerSession, role: UserRole): asserts session is NonNullable<ServerSession> {
  requireAuth(session);
  if (!hasRole(session, role)) {
    throw new Error(`Role ${role} required`);
  }
}