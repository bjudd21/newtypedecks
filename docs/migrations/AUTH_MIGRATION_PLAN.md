# NextAuth v4 → Auth.js v5 Migration Plan

**Status**: Planning Phase (v5 still in beta)
**Created**: 2025-11-14
**Target Timeline**: Q4 2025 (when v5 stable)

## Executive Summary

NextAuth v4 is being rebranded and rewritten as Auth.js v5. This is a major breaking change requiring significant code refactoring. This document outlines the migration strategy, breaking changes, affected files, and implementation plan.

## Current Status

### What We Have (NextAuth v4.24.13)

- **Package**: `next-auth@4.24.13`
- **Adapter**: `@next-auth/prisma-adapter@1.0.7`
- **Status**: Stable, receiving security updates
- **Configuration**: `/src/lib/auth.ts`
- **API Routes**: `/src/app/api/auth/[...nextauth]/route.ts`

### What's Coming (Auth.js v5)

- **Package**: `next-auth@5.0.0-beta.30` (beta as of Nov 2025)
- **New Name**: "Auth.js" (rebranding from NextAuth)
- **Adapter**: `@auth/prisma-adapter` (new package structure)
- **Status**: Beta, not production-ready yet
- **Major Changes**: Complete API rewrite, new session model, middleware changes

## Migration Readiness Criteria

We will migrate when **ALL** of the following conditions are met:

✅ **Criteria Checklist**:

- [ ] Auth.js v5 stable release (not beta)
- [ ] Stable for at least 2 weeks post-release
- [ ] @auth/prisma-adapter stable release
- [ ] Community adoption >20% (check npm trends)
- [ ] Major bugs resolved (check GitHub issues)
- [ ] Official migration guide published
- [ ] Breaking changes fully documented

**Estimated Timeline**: Q4 2025 (Oct-Dec 2025)

## Breaking Changes Overview

### 1. Package Structure

```diff
- next-auth@4.24.13
- @next-auth/prisma-adapter@1.0.7
+ next-auth@5.0.0
+ @auth/prisma-adapter@latest
```

### 2. Configuration Changes

#### Before (v4)

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... options
});
```

#### After (v5)

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... options (different structure)
});
```

### 3. Session Model Changes

- New session token handling
- Different session object structure
- Updated cookie configuration
- Changed JWT callbacks

### 4. Middleware Changes

```typescript
// middleware.ts - v5 has different API
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 5. Provider Configuration

- OAuth provider setup changed
- Credentials provider API updated
- Email provider modifications

## Affected Files Inventory

### Core Authentication (High Priority)

```
src/lib/auth.ts                               # Main auth configuration
src/lib/auth-utils.ts                         # Auth utility functions
middleware.ts                                 # Auth middleware
src/app/api/auth/[...nextauth]/route.ts      # Auth API handler
```

### Auth API Routes (High Priority)

```
src/app/api/auth/login/route.ts              # Login endpoint
src/app/api/auth/logout/route.ts             # Logout endpoint
src/app/api/auth/register/route.ts           # Registration endpoint
src/app/api/auth/signup/route.ts             # Signup endpoint
src/app/api/auth/signup/route.test.ts        # Signup tests
src/app/api/auth/forgot-password/route.ts    # Password reset
src/app/api/auth/reset-password/route.ts     # Password reset handler
src/app/api/auth/send-verification/route.ts  # Email verification sender
src/app/api/auth/verify-email/route.ts       # Email verification handler
src/app/api/auth/verify-email/route.test.ts  # Email verification tests
src/app/api/auth/me/route.ts                 # Current user endpoint
```

### Auth UI Components (Medium Priority)

```
src/components/auth/AuthProvider.tsx         # Context provider
src/components/auth/AuthStatus.tsx           # Auth status display
src/components/auth/AuthGuard.tsx            # Protected route wrapper
src/components/auth/SignInForm.tsx           # Sign in form
src/components/auth/SignUpForm.tsx           # Sign up form
src/components/auth/ForgotPasswordForm.tsx   # Password reset form
src/components/auth/ResetPasswordForm.tsx    # Password reset handler
src/components/auth/EmailVerificationBanner.tsx  # Verification banner
```

### Auth Pages (Medium Priority)

```
src/app/auth/signin/page.tsx                 # Sign in page
src/app/auth/signup/page.tsx                 # Sign up page
src/app/auth/error/page.tsx                  # Auth error page
src/app/auth/error/AuthErrorClient.tsx       # Error handler
src/app/auth/forgot-password/page.tsx        # Password reset page
src/app/auth/reset-password/page.tsx         # Password reset form page
src/app/auth/reset-password/ResetPasswordClient.tsx  # Reset handler
src/app/auth/verify-email/page.tsx           # Email verification page
src/app/auth/verify-email/EmailVerificationClient.tsx  # Verification handler
```

### Auth Hooks & State (Low Priority)

```
src/hooks/useAuth.ts                         # Auth hook
src/store/slices/authSlice.ts                # Redux auth slice
```

### Admin Routes (Low Priority - use existing auth)

```
src/middleware/adminAuth.ts                  # Admin middleware
src/app/admin/*/page.tsx                     # Admin pages
```

### Database Schema (Critical)

```
prisma/schema.prisma                         # Check if schema changes needed
```

## Migration Implementation Plan

### Phase 1: Pre-Migration (1-2 weeks)

#### Week 1: Research & Documentation

- [ ] Review Auth.js v5 official migration guide
- [ ] Document all breaking changes
- [ ] Test Auth.js v5 in isolated project
- [ ] Identify custom code that needs updates
- [ ] Create test cases for auth flows

#### Week 2: Environment Setup

- [ ] Create feature branch: `migration/auth-js-v5`
- [ ] Set up parallel testing environment
- [ ] Backup production database
- [ ] Document rollback procedure
- [ ] Inform team of migration plan

### Phase 2: Core Migration (1 week)

#### Day 1-2: Package Updates

- [ ] Update `package.json` dependencies
- [ ] Run `npm install`
- [ ] Fix TypeScript errors
- [ ] Update import statements

#### Day 3-4: Auth Configuration

- [ ] Update `src/lib/auth.ts` configuration
- [ ] Update session configuration
- [ ] Update JWT callbacks
- [ ] Update adapter configuration
- [ ] Update middleware.ts

#### Day 5: API Routes

- [ ] Update auth API handler
- [ ] Update custom auth routes
- [ ] Fix route handlers

### Phase 3: Component Updates (3-5 days)

#### Day 1-2: Auth Components

- [ ] Update AuthProvider
- [ ] Update AuthStatus
- [ ] Update AuthGuard
- [ ] Update sign in/up forms
- [ ] Update password reset flow

#### Day 3-4: Auth Pages

- [ ] Update auth pages
- [ ] Update error handling
- [ ] Update email verification
- [ ] Test user flows

#### Day 5: Hooks & State

- [ ] Update useAuth hook
- [ ] Update authSlice
- [ ] Test state management

### Phase 4: Testing (1 week)

#### Integration Testing

- [ ] Test sign up flow (email/password)
- [ ] Test sign in flow (email/password)
- [ ] Test OAuth flow (if implemented)
- [ ] Test password reset flow
- [ ] Test email verification flow
- [ ] Test session management
- [ ] Test middleware protection
- [ ] Test admin authentication

#### Edge Cases

- [ ] Test concurrent sessions
- [ ] Test session expiration
- [ ] Test token refresh
- [ ] Test error handling
- [ ] Test redirect flows
- [ ] Test remember me functionality
- [ ] Test CSRF protection

#### Security Testing

- [ ] Verify CSRF protection
- [ ] Test XSS vulnerability
- [ ] Test session hijacking protection
- [ ] Test password security
- [ ] Review security headers
- [ ] Penetration testing (optional)

### Phase 5: Deployment (1 week)

#### Staging Deployment

- [ ] Deploy to staging environment
- [ ] Run automated tests
- [ ] Manual QA testing
- [ ] Performance testing
- [ ] Security audit
- [ ] Monitor error logs

#### Production Rollout

- [ ] Deploy to production (off-peak hours)
- [ ] Monitor error rates
- [ ] Monitor authentication success rates
- [ ] Monitor session creation/destruction
- [ ] Be ready to rollback if issues arise
- [ ] Post-deployment verification

### Phase 6: Post-Migration (2 weeks)

- [ ] Monitor for 2 weeks
- [ ] Address any issues
- [ ] Update documentation
- [ ] Update CLAUDE.md
- [ ] Team training (if needed)
- [ ] Close migration tickets

## Testing Checklist

### Auth Flows to Test

**User Registration**

- [ ] Email/password signup
- [ ] Duplicate email handling
- [ ] Email verification sent
- [ ] Email verification link works
- [ ] Weak password rejection
- [ ] XSS input sanitization

**User Login**

- [ ] Email/password login
- [ ] Remember me checkbox
- [ ] Incorrect password handling
- [ ] Non-existent email handling
- [ ] Redirect after login
- [ ] Session created correctly

**Password Reset**

- [ ] Request reset email
- [ ] Reset link sent to email
- [ ] Reset link works
- [ ] Reset link expiration
- [ ] Password successfully updated
- [ ] Login with new password

**Session Management**

- [ ] Session persists across pages
- [ ] Session expires correctly
- [ ] Logout clears session
- [ ] Concurrent session handling
- [ ] Session token refresh

**Protected Routes**

- [ ] Unauthenticated redirect to login
- [ ] Authenticated access granted
- [ ] Admin-only pages protected
- [ ] Middleware protection working

**Error Handling**

- [ ] Network error handling
- [ ] Invalid token handling
- [ ] Expired session handling
- [ ] CSRF error handling
- [ ] User-friendly error messages

## Risk Assessment

### High Risk Areas

1. **Session Token Changes**: Could log out all users
2. **Database Schema Changes**: Could break existing sessions
3. **Middleware Changes**: Could break route protection
4. **OAuth Integration**: If using OAuth, providers need reconfiguration

### Mitigation Strategies

1. **Gradual Rollout**: Deploy to small percentage of users first
2. **Feature Flags**: Use feature flags to toggle v4/v5
3. **Rollback Plan**: Test rollback procedure thoroughly
4. **Communication**: Inform users of potential brief disruption
5. **Monitoring**: Enhanced monitoring during migration

## Rollback Plan

If critical issues arise after deployment:

1. **Immediate Actions** (Within 5 minutes)
   - [ ] Revert deployment to previous version
   - [ ] Clear problematic sessions
   - [ ] Verify v4 functionality restored

2. **Investigation** (Within 1 hour)
   - [ ] Collect error logs
   - [ ] Identify root cause
   - [ ] Document issue for future attempt

3. **Communication** (Within 2 hours)
   - [ ] Notify team of rollback
   - [ ] Update migration timeline
   - [ ] Post-mortem meeting

## Success Metrics

Post-migration, track these metrics for 2 weeks:

- [ ] Authentication success rate >99.5%
- [ ] Session creation success rate >99.9%
- [ ] Error rate <0.1%
- [ ] Average login time <500ms
- [ ] Zero security incidents
- [ ] User complaints <0.1%

## Additional Resources

- [Auth.js Documentation](https://authjs.dev/)
- [Auth.js v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Auth.js GitHub Repo](https://github.com/nextauthjs/next-auth)
- [Next.js Authentication Docs](https://nextjs.org/docs/authentication)
- [Prisma Adapter for Auth.js](https://authjs.dev/reference/adapter/prisma)

## Migration Team

Assign roles for the migration:

- **Migration Lead**: [TBD]
- **Backend Developer**: [TBD]
- **Frontend Developer**: [TBD]
- **QA Engineer**: [TBD]
- **DevOps Engineer**: [TBD]
- **Security Reviewer**: [TBD]

## Communication Plan

- **T-2 weeks**: Announce migration plan to team
- **T-1 week**: Final review meeting
- **T-1 day**: Pre-migration checklist verification
- **T-day**: Migration execution
- **T+1 day**: Initial monitoring report
- **T+1 week**: Interim monitoring report
- **T+2 weeks**: Final migration report

---

**Status**: This migration is blocked pending Auth.js v5 stable release. Continue monitoring progress at https://github.com/nextauthjs/next-auth/releases

**Next Review**: 2026-01-01 (check v5 release status)
