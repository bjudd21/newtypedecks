# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Newtype Decks** is a multi-TCG platform for card database browsing, deck building, and collection management. Every game is a `Game` database record + `config` JSONB — adding a new TCG is a config + seed operation, not a code change.

**Currently supported games:** Gundam Card Game, One Piece TCG (in progress).
**Source of truth for the platform pivot:** `docs/prd-multi-tcg-addendum.md`

### Key files — memorize these

| File                              | Purpose                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `src/lib/types/game.ts`           | TypeScript types: Game, GameConfig, DeckRules, CardSchema |
| `src/lib/config/games/*.ts`       | Per-game config files (gundam.ts, onepiece.ts)            |
| `src/contexts/GameContext.tsx`    | React context: `useGame()` hook                           |
| `src/app/[gameSlug]/layout.tsx`   | Server layout — loads game, wraps in GameProvider         |
| `src/app/api/_lib/resolveGame.ts` | API helper: `resolveGameFromRequest()`                    |
| `src/lib/database/games.ts`       | DB utilities: `getGameBySlug()`, `resolveGameId()`        |

> For full architecture rules, patterns, and code examples see `.claude/skills/project-architecture.md`.
> Read `.claude/instructions.md` for which skill to load per task type.

---

## ✅ Known Issues (last updated 2026-03-25)

**No blocking issues.** All Architect Review #2 items resolved.

**Resolved since Architect Review #2 (2026-03-24):**
✅ middleware.ts — `/api/admin` now guarded, `[gameSlug]` route patterns fixed, deploy blocker resolved
✅ DeckShare / useDecks types — migrated to `visibility: DeckVisibility` enum
✅ ImageCacheService — already absent from codebase
✅ Design system — full amber rebrand, zero hardcoded purple/gray values, 500+ files updated
✅ CSV/JSON exporters — dynamic `customFields` columns replace hardcoded Gundam fields; One Piece export works
✅ gameAttributes JSONB queries, ✅ most API routes game-scoped, ✅ hardcoded strings, ✅ Sentry, ✅ Vercel Analytics, ✅ vercel.json, ✅ health check, ✅ directUrl, ✅ .env.vercel.example

---

## Development Commands

### Setup and Environment

```bash
npm run setup          # Basic setup: install deps, env, db, docker
npm run setup:full     # Full setup with database seeding
npm run env:create     # Create .env from template
npm run env:validate   # Validate environment configuration
npm run env:secrets    # Generate secure secrets
```

### Development

```bash
npm run dev           # Start development server with Turbopack
npm run dev:full      # Start Docker services and dev server
npm run build         # Build for production
npm run start         # Start production server
```

### Database Operations

```bash
npm run db:generate       # Generate Prisma client
npm run db:push           # Push schema changes to database
npm run db:migrate        # Run database migrations (dev)
npm run db:migrate:deploy # Deploy migrations (production/Vercel)
npm run db:reset          # Reset database (destructive)
npm run db:seed           # Seed database with card data
npm run db:seed:games     # Seed game records (Gundam, One Piece)
npm run db:studio         # Open Prisma Studio
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues automatically
npm run type-check    # Run TypeScript type checking
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

### Testing

```bash
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci       # Run tests for CI/CD
```

### Docker Services

```bash
npm run docker:dev    # Start PostgreSQL & Redis containers
npm run docker:down   # Stop Docker services
```

### Quality Assurance

```bash
npm run check         # Run type-check, lint, and tests
npm run precommit     # Run format and all checks
```

---

## Environment Variables

### Required

- `DATABASE_URL` — PostgreSQL connection string (pooled for Vercel/Neon)
- `DIRECT_DATABASE_URL` — Direct PostgreSQL connection (for migrations, bypasses pooler)
- `NEXTAUTH_URL` — Authentication base URL
- `NEXTAUTH_SECRET` — JWT secret key

### Optional

- `REDIS_URL` — Redis connection string (not yet implemented)
- `VERCEL_BLOB_READ_WRITE_TOKEN` — For Vercel Blob file storage
- See `.env.vercel.example` for complete reference

---

## Deployment

- **Vercel**: See `docs/DEPLOYMENT.md` for full guide
- **Docker**: Uncomment `output: 'standalone'` in `next.config.ts`
- **Config**: `vercel.json` for region, function timeouts, headers

---

## Code Quality Status (as of 2026-03-25)

- ✅ **0 ESLint errors**
- ⚠️ **135 ESLint warnings** — legitimate complexity in service/API layers
- ✅ **TypeScript: passing**
- ✅ **Tests: 215 passed, 0 skipped**
- ✅ **Security: 0 vulnerabilities**

Remaining warnings are in service files (`socialService.ts`, `cardSubmissionService.ts`) and API routes with complex business logic. These are tracked but not blocking.

---

## Documentation

| Doc                              | Purpose                                              |
| -------------------------------- | ---------------------------------------------------- |
| `docs/ARCHITECTURE.md`           | How the site works — request flow, services, runtime |
| `docs/DEVELOPER_GUIDE.md`        | Complete dev workflow, setup, component reference    |
| `docs/API_REFERENCE.md`          | REST endpoints, DB schema, queries                   |
| `docs/DEPLOYMENT.md`             | Vercel, Docker, K8s deployment guide                 |
| `docs/prd-multi-tcg-addendum.md` | Multi-TCG platform PRD                               |

---

## Context & Session Management

- Commit checkpoints before long tasks for safe rollback.
- Manual `/compact` at ~50% context — don't let auto-compaction decide what to keep.
- Use `/clear` when switching to unrelated tasks.
- For multi-phase work: write findings to handoff markdown files before ending a session.

### Sync Monitor (Context Window Telemetry)

The `sync-monitor` MCP server is globally available in every project. Use it to report context window usage to the live Electron tray app.

**Call `sync_report` after every 10+ messages of work, before/after `/compact`, and when asked:**

```typescript
sync_report({
  estimated_tokens_used: <your estimate>,
  estimated_total_window: 200000,
  message_count: <count>
})
```

Include system prompt (~20K), conversation history, and loaded files in your token estimate.

**Thresholds** (`sync_pct` = remaining context, 100% = empty):

- 75–100%: Full Sync — plenty of room
- 50–74%: Stable — normal operation
- 25–49%: Strained — consider compacting
- 10–24%: Fading — compact recommended
- <10%: Signal Loss — compact immediately

**Don't mention sync state unless** the threshold changes, user asks, or you're at Fading/Signal Loss. The tray app shows it.

**Before `/compact`:** Call `sync_snapshot({ task_summary, key_decisions, active_files, work_state, next_steps })` to preserve context.
**After `/compact`:** Call `sync_report` with `just_compacted: true`, then `sync_resume({ count: 1 })` to recover context.
