/**
 * NextAuth.js API route handler
 *
 * This handles all authentication requests including sign in, sign out, and session management
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };