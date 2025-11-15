# Dependency Management Guide

**Last Updated**: 2025-11-15
**Next Review**: 2025-12-15

This document tracks all project dependencies, available updates, security considerations, and our update strategy.

## Quick Status

✅ **Security**: 0 vulnerabilities
✅ **Tests**: 193 passing, 2 skipped
✅ **Build**: Passing
📊 **Outdated Packages**: 3 with available updates (properly deferred)
🎉 **Recent Updates**: 7 updates applied (2025-11-15)

## Current Stable Versions

### Core Framework

- **Next.js**: 16.0.3 (latest)
- **React**: 19.2.0 (latest)
- **TypeScript**: 5.9.3 (latest)
- **Node.js**: 18.0.0+ required

### Backend & Data

- **Prisma**: 6.19.0 (@prisma/client + prisma, latest)
- **PostgreSQL**: Via Docker (production ready)
- **Redis**: 5.9.0 (latest, not yet implemented - see REDIS_V5_MIGRATION.md)

### Authentication

- **NextAuth**: 4.24.13 (v5.0.0-beta available as Auth.js)
- **@next-auth/prisma-adapter**: 1.0.7

### State & UI

- **Redux Toolkit**: 2.10.1 (latest)
- **React-Redux**: 9.2.0
- **Tailwind CSS**: 4.1.17 (latest)
- **Framer Motion**: 12.23.24

### Testing

- **Jest**: 30.2.0 (latest)
- **React Testing Library**: 16.3.0
- **jest-environment-jsdom**: 30.2.0 (latest)

### Developer Tools

- **ESLint**: 9.39.1
- **Prettier**: 3.6.2
- **Husky**: 9.1.7 (latest)
- **glob**: 11.0.3 (latest)
- **Sharp**: 0.34.5 (latest)
- **@types/node**: 24.10.1 (latest, forward-compatible with Node.js 20.x)
- **@types/react-dom**: 19.2.3 (latest)

## Available Updates Analysis

### Major Version Updates (Breaking Changes)

#### NextAuth 4.24.13 → Auth.js 5.0.0

- **Status**: Monitoring (beta, major rewrite)
- **Risk**: CRITICAL
- **Reason to Defer**:
  - v5 still in beta (5.0.0-beta.30)
  - Complete API rewrite
  - New package structure (@auth/\*)
  - Adapter incompatibility
  - Requires significant code refactoring
- **Prerequisites**:
  - Wait for stable v5 release + 2 weeks
  - Review Auth.js migration guide
  - See AUTH_MIGRATION_PLAN.md
  - Dedicated security testing required
- **Timeline**: Q4 2025 (when stable)

## Update Strategy & Policy

### Security Patches (Immediate)

- Apply patch updates (<0.0.X) immediately if safe
- Apply security fixes within 48 hours
- Run full test suite before deployment

### Minor Updates (Next Sprint)

- Review changelog and breaking changes
- Test in development environment
- Apply if no compatibility issues
- Examples: Sharp, Sentry patches

### Major Updates (Quarterly Planning)

- Dedicated planning sprint
- Create feature branch
- Full QA cycle required
- Staged rollout (dev → staging → production)
- Rollback plan prepared

### Breaking Changes (Long-term)

- 3-6 month planning window
- Wait for ecosystem stabilization (2-3 months post-release)
- Comprehensive testing required
- Security review for auth-related changes

## Dependency Review Schedule

- **Weekly**: Security audits (`npm audit`)
- **Monthly**: Check for updates (`npm outdated`)
- **Quarterly**: Major version planning
- **Annually**: Comprehensive dependency audit

## Security Monitoring

### Current Security Status

✅ 0 vulnerabilities (as of 2025-11-14)

### Security Fixes Applied

- **2025-11-14**: js-yaml vulnerability patched via npm overrides
- **2025-11-14**: @types/react updated to 19.2.5
- **2025-11-14**: @sentry/nextjs updated to 10.25.0

### Monitoring Tools

- GitHub Dependabot (enabled)
- npm audit (weekly CI checks)
- Snyk integration (optional)

### Security Response Policy

- **Critical**: Immediate patch within 24 hours
- **High**: Patch within 48 hours
- **Moderate**: Review and patch within 1 week
- **Low**: Include in next scheduled update

## Compatibility Matrix

### Current Stack Compatibility

✅ React 19.2.0 + Next.js 15.5.3
✅ TypeScript 5.9.3 + Next.js 15.5.3
✅ Node.js 18/20 + All dependencies
✅ Prisma 5.22.0 + PostgreSQL
✅ Jest 29 + React Testing Library 16

### Known Issues

⚠️ Next.js 16 + React 19: Newly released, may have edge cases
⚠️ Prisma 6: Breaking schema changes, migration planning required
⚠️ Auth.js v5: Still in beta, not production-ready

## Update Checklist

Before updating any dependency:

1. **Research**
   - [ ] Read changelog and release notes
   - [ ] Identify breaking changes
   - [ ] Check community feedback
   - [ ] Review GitHub issues

2. **Testing**
   - [ ] Create feature branch
   - [ ] Update dependency
   - [ ] Run `npm install`
   - [ ] Run `npm test`
   - [ ] Run `npm run type-check`
   - [ ] Run `npm run lint`
   - [ ] Manual QA of affected features

3. **Deployment**
   - [ ] Test in development environment
   - [ ] Deploy to staging
   - [ ] Monitor for errors
   - [ ] Deploy to production
   - [ ] Post-deployment verification

4. **Rollback Plan**
   - [ ] Previous version documented
   - [ ] Rollback procedure tested
   - [ ] Database backup (if applicable)

## Troubleshooting

### npm audit shows vulnerabilities

1. Run `npm audit --audit-level=moderate` to see severity
2. Try `npm audit fix --dry-run` to preview fixes
3. If safe, apply with `npm audit fix`
4. For breaking changes, use `npm overrides` in package.json

### Tests fail after update

1. Check test compatibility with new version
2. Review changelog for test-related breaking changes
3. Update mocks if API changed
4. Regenerate snapshots if format changed
5. Consider reverting if critical

### Build fails after update

1. Clear `.next` and `node_modules`
2. Run `npm ci` for clean install
3. Check for peer dependency conflicts
4. Review build logs for specific errors
5. Check TypeScript compatibility

## Future Considerations

### Node.js Runtime

- Current: 18.0.0+
- Latest LTS: 20.x
- Consider upgrading to Node.js 22 LTS in Q3 2025

### Package Manager

- Current: npm
- Consider: pnpm for faster installs (optional)

### Monitoring

- Consider adding dependency-track for vulnerability tracking
- Set up automated update PRs via Renovate/Dependabot

## References

- [Next.js Upgrade Guide](https://nextjs.org/docs/upgrading)
- [Prisma Upgrade Guide](https://www.prisma.io/docs/guides/upgrade-guides)
- [Auth.js Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [Jest Upgrade Guide](https://jestjs.io/docs/upgrading-to-jest30)
- [npm Overrides Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)

---

## Changelog

### 2025-11-14: Package Sync and Safe Updates

**Package.json Sync** (Documentation only):

- ✅ @prisma/client: Synced package.json ^5.7.1 → ^5.22.0 (already installed)
- ✅ prisma: Synced package.json ^5.7.1 → ^5.22.0 (already installed)
- ✅ redis: Synced package.json ^4.6.12 → ^4.7.1 (already installed)
- ✅ react-redux: Synced package.json ^9.0.4 → ^9.2.0 (already installed)
- ✅ @testing-library/react: Synced package.json ^16.0.0 → ^16.3.0 (already installed)

**Safe Updates Applied**:

- ✅ @types/react-dom: 19.2.2 → 19.2.3 (patch)
- ✅ prettier: 3.1.1 → 3.6.2 (minor - formatting improvements)

**Verification**: All checks passed (type-check, lint, format, tests, build)
**Security Status**: 0 vulnerabilities

### 2025-11-14: Sharp Update

- ✅ Sharp: 0.33.1 → 0.34.5
- Aligned with Next.js 15.5.3's Sharp dependency
- Clean environment (npm cache + fresh install)
- All image processing verified working

### 2025-11-14: Security Audit and Performance Check

- ✅ Resolved 18 moderate vulnerabilities in js-yaml
- ✅ Added webpack-bundle-analyzer for performance monitoring
- Security: 0 vulnerabilities after fix
- Bundle analysis: Working correctly

### 2025-11-15: Q2 2025 Major Updates

**Major Version Updates Applied** (Q2 dependency refresh):

- ✅ **glob**: 10.4.5 → 11.0.3 (major)
  - Migrated from deprecated `glob.sync()` to new `globSync()` API
  - Updated scripts/check-file-sizes.js for v11 compatibility
  - Performance improvements and modernized ESM support

- ✅ **Redis**: 4.7.1 → 5.9.0 (major)
  - No code changes needed (Redis not yet implemented)
  - Created comprehensive REDIS_V5_MIGRATION.md guide
  - Breaking changes: async-aware createClient(), pub/sub signature changes
  - Ready for future implementation

- ✅ **Husky**: 8.0.3 → 9.1.7 (major)
  - Migrated prepare script: "husky install" → "husky"
  - Updated .husky/pre-commit format (removed deprecated shebang)
  - Simplified hook format for v10 compatibility
  - Better Windows support, smaller package size

- ✅ **Jest**: 29.7.0 → 30.2.0 (major)
  - Updated jest-environment-jsdom: 29.7.0 → 30.2.0
  - No test failures or configuration changes needed
  - Performance improvement: 4.5s → 4.3s test execution
  - Better TypeScript integration and type inference

**Dependencies Changed**:

- Total packages: 999 (up from 993)
- Added: 47 packages
- Removed: 38 packages
- Changed: 80 packages

**Verification**: All checks passed

- ✅ TypeScript: 0 errors
- ✅ Tests: 193 passed, 2 skipped
- ✅ ESLint: 0 errors
- ✅ Security: 0 vulnerabilities
- ✅ All tests pass with Jest v30

**Impact**:

- **Risk Level**: Medium (4 major updates)
- **Breaking Changes**: API migrations handled
- **Performance**: Improved (faster tests, smaller packages)
- **Future-Proofing**: v10/v30 compatibility ensured

### 2025-11-15: Prisma 6 Upgrade

**Major Version Update Applied** (Database ORM upgrade):

- ✅ **Prisma**: 5.22.0 → 6.19.0 (major)
  - **@prisma/client**: 5.22.0 → 6.19.0
  - **prisma**: 5.22.0 → 6.19.0
  - Zero code changes required for upgrade
  - Schema remains fully compatible (no migration needed)
  - NextAuth Prisma adapter (1.0.7) works perfectly with Prisma 6
  - All database operations verified working

**Verification Results**:

- ✅ TypeScript: 0 errors
- ✅ Tests: 193 passed, 2 skipped (4.5s execution)
- ✅ ESLint: 0 errors, 228 warnings (acceptable)
- ✅ Security: 0 vulnerabilities
- ✅ Migration Status: Schema up to date (no migration needed)
- ✅ Health Check: Database connected (26ms response time)
- ✅ Card Search API: Working with complex relations
- ✅ Authentication: NextAuth + Prisma adapter verified
- ✅ All Pages: 200 OK (homepage, cards, decks, collection)

**Dependencies Changed**:

- Total packages: 1023 (up from 999)
- Added: 24 packages
- Changed: 7 packages

**Breaking Changes**:

- None encountered (Prisma 6 maintains backward compatibility for this codebase)
- No schema changes required
- No migration scripts needed
- All existing queries work without modification

**Why This Update**:
Prisma 6 brings significant internal improvements:

- Better performance and memory efficiency
- Improved TypeScript type inference
- Enhanced query optimization
- Modernized codebase for future features
- Latest stable version with active support

**Impact**:

- **Risk Level**: Low (seamless upgrade)
- **Code Changes**: 0 (package.json only)
- **Database Changes**: 0 (no migrations)
- **Breaking Changes**: None
- **Downtime**: None (zero-downtime upgrade)

### 2025-11-15: Next.js 16 Upgrade

**Major Version Update Applied** (Framework upgrade):

- ✅ **Next.js**: 15.5.3 → 16.0.3 (major)
  - **eslint-config-next**: 15.5.3 → 16.0.3 (matching version)
  - Zero breaking changes for this codebase
  - React 19.2.0 fully compatible
  - All features working without modification
  - Fixed images.domains deprecation warning

**Code Changes**:

- **next.config.ts**: Migrated from deprecated `images.domains` to `images.remotePatterns`
  - Converted localhost, 127.0.0.1, gundam-gcg.com, cdn.gundam-gcg.com to remotePatterns format
  - Added protocol specifications (http for local, https for production)
  - No functionality lost, improved security configuration

**Verification Results**:

- ✅ TypeScript: 0 errors
- ✅ Tests: 193 passed, 2 skipped (4.7s execution)
- ✅ ESLint: 0 errors, 228 warnings (acceptable)
- ✅ Security: 0 vulnerabilities
- ✅ Dev Server: Clean startup, zero warnings
- ✅ Production Build: Successful
- ✅ Health Check: All systems healthy
- ✅ API Endpoints: All working (cards, search, collections, decks)
- ✅ All Pages: 200 OK responses

**Dependencies Changed**:

- Total packages: 1028 (up from 1023)
- Added: 6 packages
- Removed: 1 package
- Changed: 6 packages

**Breaking Changes**:

- None encountered for this codebase
- React 19 peer dependency satisfied (19.2.0 installed)
- All App Router features working
- Turbopack continues to work in dev mode

**Configuration Updates**:

- **TypeScript**: Next.js auto-updated tsconfig.json:
  - Added '.next/dev/types/\*_/_.ts' to includes
  - Set jsx to 'react-jsx' (React automatic runtime)
- **Images**: Migrated to remotePatterns (more secure, more flexible)
- **No other config changes required**

**Why This Update**:
Next.js 16 brings important improvements:

- Better React 19 integration and compatibility
- Performance improvements in Turbopack
- Enhanced TypeScript support with auto-configuration
- Improved image optimization with remotePatterns
- Latest stable version with active support
- Security improvements and bug fixes

**Impact**:

- **Risk Level**: Low (smooth upgrade)
- **Code Changes**: 1 file (next.config.ts - deprecation fix)
- **Breaking Changes**: None for this codebase
- **Downtime**: None (zero-downtime upgrade)
- **Performance**: Maintained (build time similar, faster dev startup)

**Migration Notes**:

- `images.domains` → `images.remotePatterns` migration required
- TypeScript config automatically updated by Next.js
- No other code changes needed
- All React 19 features continue to work
- Turbopack dev mode fully functional

### 2025-11-15: @types/node Forward-Compatible Update

**Type Definitions Update Applied**:

- ✅ **@types/node**: 20.19.25 → 24.10.1
  - Forward-compatible update for future Node.js compatibility
  - Running on Node.js v20.19.4 runtime (stable)
  - Zero breaking changes for current codebase
  - No TypeScript errors introduced

**Code Changes**:

- None required (type definitions only)

**Verification Results**:

- ✅ TypeScript: 0 errors
- ✅ Tests: 193 passed, 2 skipped (4.38s execution)
- ✅ ESLint: 0 errors, 228 warnings (acceptable)
- ✅ Security: 0 vulnerabilities
- ✅ Dev Server: All systems healthy
- ✅ API Endpoints: All working

**Dependencies Changed**:

- Total packages: 1028 (unchanged)
- Changed: 2 packages (@types/node + internal dependency)

**Why This Update**:
Forward-compatible type definitions for Node.js:

- Provides types for newer Node.js APIs
- Enables better IDE autocomplete and type checking
- Prepares codebase for future Node.js upgrades
- No runtime impact (type definitions only)
- Commonly used pattern in TypeScript projects

**Compatibility Notes**:

- Node.js runtime: v20.19.4 (no upgrade required)
- @types/node v24 includes types for Node.js 24 APIs
- Using newer type definitions with older runtime is safe and common
- Only affects compile-time type checking, not runtime behavior
- All Node.js 20 APIs continue to work as expected

**Impact**:

- **Risk Level**: Minimal (type definitions only)
- **Code Changes**: None
- **Runtime Changes**: None
- **Breaking Changes**: None
- **Performance**: No impact (compile-time only)

---

**Maintenance Policy**: This document is reviewed and updated during quarterly dependency planning sessions. For urgent security updates, this document is updated immediately after applying patches.
