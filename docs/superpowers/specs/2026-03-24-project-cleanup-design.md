# Project Cleanup & Documentation Reorganization — Design Spec

**Date:** 2026-03-24
**Scope:** Root directory cleanup, docs reorganization, README rewrite
**Out of scope:** `src/` code changes

---

## Problem

The project root accumulated significant scaffolding during development — session notes, old task tracking, planning scripts, generated artifacts, and Cursor IDE files that have been superseded by Claude Code. The docs folder has a stale architect review (describing resolved issues) and PRDs scattered at the root. The README still presents the project as Gundam-specific when the platform is multi-TCG.

---

## Section 1: Files to Delete

| File/Dir                     | Reason                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `officialartifacts/`         | 5.7MB PDF + card schemas incorporated into codebase; no longer needed                                                                         |
| `cursorrules/`               | Cursor IDE workflow files (coding-prefs.md, create-prd.md, generate-tasks.md, process-task-list.md) — superseded by `.claude/skills/`         |
| `tasks/`                     | 40+ completed task summaries + original task list — history lives in git                                                                      |
| `package 2.json`             | Accidental duplicate of package.json                                                                                                          |
| `.claude-session.md`         | Nov 2025 session notes, self-annotated "delete when done"                                                                                     |
| `project-memory.md`          | Pre-pivot Gundam-era project memory, fully superseded by CLAUDE.md                                                                            |
| `FINAL_CHANGESET.md`         | One-off commit planning notes from Mar 22                                                                                                     |
| `create-multi-tcg-issues.sh` | Script that created the now-closed GitHub issues (all 40 closed)                                                                              |
| `file-size-report.json`      | Generated 234KB artifact — not source                                                                                                         |
| `coverage/`                  | Generated test coverage output — not source                                                                                                   |
| `docs/ARCHITECT_REVIEW.md`   | Snapshot review from 2026-03-23 documenting 4 critical issues (#64–#67) that are now fully resolved. Keeping it would mislead future readers. |

Note: `.claude/worktrees/` is an empty directory — leave as-is (not tracked by git).

---

## Section 2: Docs Reorganization

### Move PRDs from root → `docs/`

- `prd-gundam-card-game-website.md` → `docs/prd-gundam-card-game-website.md`
- `prd-multi-tcg-addendum.md` → `docs/prd-multi-tcg-addendum.md`

**Update CLAUDE.md — 3 path changes:**

- Line 11: `` `prd-multi-tcg-addendum.md` `` → `` `docs/prd-multi-tcg-addendum.md` ``
- Line 410: `[prd-multi-tcg-addendum.md](/prd-multi-tcg-addendum.md)` → `[docs/prd-multi-tcg-addendum.md](/docs/prd-multi-tcg-addendum.md)`
- Line 411: `[prd-gundam-card-game-website.md](/prd-gundam-card-game-website.md)` → `[docs/prd-gundam-card-game-website.md](/docs/prd-gundam-card-game-website.md)`

### Fix dead VERCEL_DEPLOYMENT.md references in CLAUDE.md

`docs/VERCEL_DEPLOYMENT.md` does not exist. CLAUDE.md references it in 2 places (lines 301 and 406). Update both to point to `docs/DEPLOYMENT.md` instead.

### Commit currently untracked files

- `.claude/instructions.md` — session router (which skill to read + critical rules)
- `.claude/skills/api-routes.md`
- `.claude/skills/database-prisma.md`
- `.claude/skills/frontend-uiux.md`
- `.claude/skills/game-config.md`
- `.claude/skills/project-architecture.md`
- `docs/SKILLS_OVERVIEW.md` — documents the skills system

### Keep `docs/migrations/` as-is

`AUTH_MIGRATION_PLAN.md` and `REDIS_V5_MIGRATION.md` are valid future planning docs (Auth.js v5 and Redis v5 are deferred work). The subfolder is well-organized.

### Final `docs/` structure

```
docs/
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── DEPENDENCIES.md
├── DEPLOYMENT.md
├── DEVELOPER_GUIDE.md
├── SKILLS_OVERVIEW.md                    ← newly committed
├── prd-gundam-card-game-website.md       ← moved from root
├── prd-multi-tcg-addendum.md             ← moved from root
├── migrations/
│   ├── README.md
│   ├── AUTH_MIGRATION_PLAN.md
│   └── REDIS_V5_MIGRATION.md
└── superpowers/
    └── specs/
        └── 2026-03-24-project-cleanup-design.md
```

---

## Section 3: README Rewrite

Replace the 21KB Gundam-specific README with a concise, accurate multi-TCG platform README.

### Structure

```
# Newtype Decks
[tagline] [badges: build status, license, TypeScript]

## Overview
Multi-TCG platform for card database browsing, deck building, and
collection management. Game rules, card schemas, and deck validation
are driven by config — adding a new TCG is a config + seed operation,
not a code change.

Currently supports: Gundam Card Game

## Features
- Card database with advanced search and filtering
- Deck builder: drag-and-drop, multiple view modes (image/text/spreadsheet),
  hand simulator, side-by-side comparison, proxy PDF generator
- Collection management with deck ownership tracking
- Deck codes, social metrics (views/likes/trending), visibility tiers
  (Draft / Private / Public)
- Cross-game user dashboard

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS |
| State | Redux Toolkit |
| ORM | Prisma |
| Database | PostgreSQL (Neon for Vercel, Docker for local) |
| Auth | NextAuth.js |
| Deployment | Vercel |

## Getting Started
Prerequisites + npm run setup:full + npm run dev → localhost:3000

## Key Commands
dev, build, db:push, db:seed:games, test, lint, check

## Documentation
Links table → all docs/ files

## Deployment
One sentence + links to docs/DEPLOYMENT.md

## Contributing
Link to CONTRIBUTING.md

## License
MIT
```

### Principles

- No Gundam-specific content (game content belongs in the game config/docs)
- No One Piece mention (not production-ready yet)
- Detail lives in `docs/` — README points there, doesn't duplicate
- Badge row for quick project health signal

---

## Implementation Order

1. Delete files/dirs
2. Move PRDs, update CLAUDE.md paths (5 changes: 3 PRD paths + 2 VERCEL_DEPLOYMENT refs)
3. Commit `.claude/` files, `docs/SKILLS_OVERVIEW.md`, and `docs/superpowers/specs/2026-03-24-project-cleanup-design.md`
4. Rewrite README.md
5. Single clean commit: `chore: project cleanup — remove scaffolding, organize docs, rewrite README`
