# Migration Plans Archive

This directory contains **archived migration plans** for future dependency updates that are not yet ready for implementation.

## Purpose

These documents are planning artifacts created in preparation for major version migrations. They are archived here (rather than in the main `/docs` directory) because:

1. **Not Yet Actionable** - The migrations documented here cannot be executed yet
2. **Preserve Research** - The detailed research and planning should be preserved for future use
3. **Reduce Clutter** - Keeping planning docs separate from active documentation improves clarity

## Current Archived Plans

### AUTH_MIGRATION_PLAN.md

**Status**: Waiting for Auth.js v5 stable release
**Current Version**: NextAuth 4.24.13
**Target Version**: Auth.js v5.x (still in beta as of 2025-11-15)
**Timeline**: Planned for Q4 2025 or later
**Why Archived**: Auth.js v5 is still in beta and not recommended for production use

### REDIS_V5_MIGRATION.md

**Status**: Waiting for Redis implementation in codebase
**Current Version**: redis@5.9.0 (package installed)
**Target Version**: Already on v5, but Redis is not yet implemented in the application
**Timeline**: TBD - implement Redis first, then reference migration patterns
**Why Archived**: Redis caching is not yet used in the codebase, so migration guide is premature

## When to Reference These Plans

### Auth Migration

- When Auth.js v5 reaches stable release
- When reviewing authentication modernization
- Before implementing v5-specific features

### Redis Migration

- When implementing Redis caching for the first time
- As reference for v5-compatible patterns
- For understanding breaking changes from v4

## Quick Reference

For brief summaries of these migration plans, see the **Future Migration Plans** section in `/docs/DEPENDENCIES.md`.

## Updating These Plans

When ready to execute a migration:

1. Review and update the plan in this directory
2. Move the plan back to `/docs` during active migration
3. After completion, document the migration in `/docs/DEPENDENCIES.md` changelog
4. Delete or mark the plan as "COMPLETED" here

---

**Last Updated**: 2025-11-21
**Maintained By**: Development team
