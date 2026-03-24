# Project Cleanup & Documentation Reorganization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove accumulated scaffolding from the project root, reorganize docs, and rewrite the README to accurately reflect the multi-TCG platform.

**Architecture:** Pure file operations — delete dead files, move PRDs into docs/, fix 5 stale CLAUDE.md paths, commit currently untracked .claude/ skill files, and rewrite README.md from scratch. No code changes, no dependency changes, no database changes.

**Tech Stack:** git, bash, markdown

**Spec:** `docs/superpowers/specs/2026-03-24-project-cleanup-design.md`

---

## File Map

| Operation      | Path                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Delete         | `officialartifacts/`                                                                                                                       |
| Delete         | `cursorrules/`                                                                                                                             |
| Delete         | `tasks/`                                                                                                                                   |
| Delete         | `package 2.json`                                                                                                                           |
| Delete         | `.claude-session.md`                                                                                                                       |
| Delete         | `project-memory.md`                                                                                                                        |
| Delete         | `FINAL_CHANGESET.md`                                                                                                                       |
| Delete         | `create-multi-tcg-issues.sh`                                                                                                               |
| Delete         | `file-size-report.json`                                                                                                                    |
| Delete         | `coverage/`                                                                                                                                |
| Delete         | `docs/ARCHITECT_REVIEW.md`                                                                                                                 |
| Move           | `prd-gundam-card-game-website.md` → `docs/prd-gundam-card-game-website.md`                                                                 |
| Move           | `prd-multi-tcg-addendum.md` → `docs/prd-multi-tcg-addendum.md`                                                                             |
| Modify         | `CLAUDE.md` — 5 path fixes                                                                                                                 |
| Stage & commit | `.claude/instructions.md`, `.claude/skills/*.md`, `docs/SKILLS_OVERVIEW.md`, `docs/superpowers/specs/2026-03-24-project-cleanup-design.md` |
| Overwrite      | `README.md`                                                                                                                                |

---

### Task 1: Delete scaffolding files and directories

**Files:**

- Delete: `officialartifacts/`, `cursorrules/`, `tasks/`, `package 2.json`, `.claude-session.md`, `project-memory.md`, `FINAL_CHANGESET.md`, `create-multi-tcg-issues.sh`, `file-size-report.json`, `coverage/`, `docs/ARCHITECT_REVIEW.md`

- [ ] **Step 1: Delete root-level files and directories**

```bash
cd /home/bjudd/projects/newtypedecks
rm -rf officialartifacts/ cursorrules/ tasks/ coverage/
rm -f "package 2.json" .claude-session.md project-memory.md FINAL_CHANGESET.md create-multi-tcg-issues.sh file-size-report.json
```

- [ ] **Step 2: Delete stale docs file**

```bash
rm -f docs/ARCHITECT_REVIEW.md
```

- [ ] **Step 3: Verify deletions**

```bash
ls officialartifacts cursorrules tasks "package 2.json" .claude-session.md project-memory.md FINAL_CHANGESET.md create-multi-tcg-issues.sh file-size-report.json coverage docs/ARCHITECT_REVIEW.md 2>&1
```

Expected: `ls: cannot access '...'` for every entry — none should exist.

---

### Task 2: Move PRDs into docs/

**Files:**

- Move: `prd-gundam-card-game-website.md` → `docs/prd-gundam-card-game-website.md`
- Move: `prd-multi-tcg-addendum.md` → `docs/prd-multi-tcg-addendum.md`

- [ ] **Step 1: Move both PRD files**

```bash
mv prd-gundam-card-game-website.md docs/prd-gundam-card-game-website.md
mv prd-multi-tcg-addendum.md docs/prd-multi-tcg-addendum.md
```

- [ ] **Step 2: Verify move**

```bash
ls docs/prd-gundam-card-game-website.md docs/prd-multi-tcg-addendum.md
ls prd-gundam-card-game-website.md prd-multi-tcg-addendum.md 2>&1
```

Expected: first command succeeds (files exist in docs/), second command shows "No such file or directory".

---

### Task 3: Fix 5 stale paths in CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`

Five changes to make:

1. Line 11: `` `prd-multi-tcg-addendum.md` `` → `` `docs/prd-multi-tcg-addendum.md` ``
2. Line ~301: `docs/VERCEL_DEPLOYMENT.md` → `docs/DEPLOYMENT.md` (in a prose reference)
3. Line ~406: `docs/VERCEL_DEPLOYMENT.md` → `docs/DEPLOYMENT.md` (in the Documentation links table)
4. Line ~410: `[prd-multi-tcg-addendum.md](/prd-multi-tcg-addendum.md)` → `[docs/prd-multi-tcg-addendum.md](/docs/prd-multi-tcg-addendum.md)`
5. Line ~411: `[prd-gundam-card-game-website.md](/prd-gundam-card-game-website.md)` → `[docs/prd-gundam-card-game-website.md](/docs/prd-gundam-card-game-website.md)`

- [ ] **Step 1: Make the 5 edits in CLAUDE.md**

Use the Edit tool to make each change:

**Change 1** — line 11 inline reference:

```
Old: **Source of truth for the pivot:** `prd-multi-tcg-addendum.md`
New: **Source of truth for the pivot:** `docs/prd-multi-tcg-addendum.md`
```

**Change 2** — VERCEL_DEPLOYMENT prose reference:

```
Old: - **Vercel**: See `docs/VERCEL_DEPLOYMENT.md` for full guide
New: - **Vercel**: See `docs/DEPLOYMENT.md` for full guide
```

**Change 3** — VERCEL_DEPLOYMENT docs table link:

```
Old: - **[docs/VERCEL_DEPLOYMENT.md](/docs/VERCEL_DEPLOYMENT.md)** - Vercel + Neon Postgres deployment
New: - **[docs/DEPLOYMENT.md](/docs/DEPLOYMENT.md)** - Production deployment guide (Docker, K8s, Vercel)
```

**Change 4** — prd-multi-tcg link in docs table:

```
Old: - **[prd-multi-tcg-addendum.md](/prd-multi-tcg-addendum.md)** - Multi-TCG platform PRD with competitive analysis
New: - **[docs/prd-multi-tcg-addendum.md](/docs/prd-multi-tcg-addendum.md)** - Multi-TCG platform PRD with competitive analysis
```

**Change 5** — prd-gundam link in docs table:

```
Old: - **[prd-gundam-card-game-website.md](/prd-gundam-card-game-website.md)** - Original PRD (still valid for non-game-specific features)
New: - **[docs/prd-gundam-card-game-website.md](/docs/prd-gundam-card-game-website.md)** - Original PRD (still valid for non-game-specific features)
```

- [ ] **Step 2: Verify no stale paths remain**

```bash
grep -n "VERCEL_DEPLOYMENT\|/prd-gundam\|/prd-multi-tcg\|\`prd-multi-tcg" CLAUDE.md
```

Expected: zero results.

- [ ] **Step 3: Verify new paths are present**

```bash
grep -n "docs/prd-\|docs/DEPLOYMENT" CLAUDE.md
```

Expected: 4 lines — 1 inline reference, 2 doc table links, 1 prose reference.

---

### Task 4: Rewrite README.md

**Files:**

- Overwrite: `README.md`

- [ ] **Step 1: Write the new README**

Replace the entire contents of `README.md` with:

````markdown
# Newtype Decks

> Multi-game card database, deck builder, and collection manager for trading card games.

[![Quality Checks](https://github.com/bjudd21/newtypedecks/actions/workflows/quality-checks.yml/badge.svg)](https://github.com/bjudd21/newtypedecks/actions/workflows/quality-checks.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Overview

Newtype Decks is a multi-TCG platform for card database browsing, deck building, and collection management. Game rules, card schemas, and deck validation are driven by configuration — adding a new TCG is a config + seed operation, not a code change.

**Currently supports:** Gundam Card Game

## Features

- **Card database** — Advanced search and filtering by card type, rarity, cost, and game-specific attributes
- **Deck builder** — Drag-and-drop with multiple view modes (image grid, text list, spreadsheet), hand simulator, side-by-side deck comparison, and proxy PDF generator
- **Collection management** — Track owned cards with quantity; see ownership status while building decks
- **Deck sharing** — Deck codes for sharing in Discord/chat, visibility tiers (Draft / Private / Public), social metrics (views, likes, trending)
- **Cross-game dashboard** — All your decks and collections across every supported game in one place

## Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router), TypeScript                |
| Styling    | Tailwind CSS                                       |
| State      | Redux Toolkit                                      |
| ORM        | Prisma                                             |
| Database   | PostgreSQL (Neon for Vercel, Docker for local dev) |
| Auth       | NextAuth.js                                        |
| Deployment | Vercel (primary)                                   |

## Getting Started

**Prerequisites:** Node.js LTS, Docker Desktop running

```bash
git clone https://github.com/bjudd21/newtypedecks.git
cd newtypedecks
npm run setup:full    # installs deps, creates .env, starts Docker, runs migrations + seeds
npm run dev           # starts dev server at localhost:3000
```
````

## Key Commands

```bash
npm run dev              # dev server (Turbopack)
npm run build            # production build
npm run test             # run tests
npm run check            # type-check + lint + tests
npm run db:push          # push schema changes
npm run db:seed:games    # seed game records (Gundam, One Piece)
npm run lint:fix         # auto-fix lint issues
```

## Documentation

| Doc                                        | Description                                            |
| ------------------------------------------ | ------------------------------------------------------ |
| [Architecture](docs/ARCHITECTURE.md)       | How the system works — request flow, services, caching |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Setup, conventions, component library, OAuth           |
| [API Reference](docs/API_REFERENCE.md)     | REST endpoints and database schema                     |
| [Deployment](docs/DEPLOYMENT.md)           | Docker, Kubernetes, and Vercel deployment              |
| [Dependencies](docs/DEPENDENCIES.md)       | Dependency management and update strategy              |

## Deployment

Vercel is the primary deployment target with Neon Postgres. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions including Docker and Kubernetes options.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow, code standards, and how to add a new TCG to the platform.

## License

MIT — see [LICENSE](./LICENSE)

````

- [ ] **Step 2: Verify README looks correct**

```bash
wc -l README.md
head -5 README.md
````

Expected: ~70 lines, starts with `# Newtype Decks`.

---

### Task 5: Stage and commit everything

- [ ] **Step 1: Check git status to see full picture**

```bash
git status
```

Expected: modified files (CLAUDE.md, README.md), deleted files (all the removed items), renamed files (PRDs), and untracked files (.claude/instructions.md, .claude/skills/, docs/SKILLS_OVERVIEW.md, docs/superpowers/).

- [ ] **Step 2: Stage all changes**

```bash
git add -A
```

Note: `git add -A` is safe here — we have no .env files or secrets to worry about accidentally staging. Verify with `git status` if uncertain.

- [ ] **Step 3: Verify staging looks correct**

```bash
git status
```

Confirm:

- Deleted: officialartifacts, cursorrules, tasks, package 2.json, .claude-session.md, project-memory.md, FINAL_CHANGESET.md, create-multi-tcg-issues.sh, file-size-report.json, coverage, docs/ARCHITECT_REVIEW.md
- Renamed: prd-_.md → docs/prd-_.md
- Modified: CLAUDE.md, README.md
- New: .claude/instructions.md, .claude/skills/\*.md, docs/SKILLS_OVERVIEW.md, docs/superpowers/

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore: project cleanup — remove scaffolding, organize docs, rewrite README

- Delete dev scaffolding: officialartifacts/, cursorrules/, tasks/,
  .claude-session.md, project-memory.md, FINAL_CHANGESET.md,
  create-multi-tcg-issues.sh, file-size-report.json, coverage/
- Delete stale docs/ARCHITECT_REVIEW.md (all 4 issues it raised are resolved)
- Move PRDs from root to docs/
- Fix 5 stale paths in CLAUDE.md (PRD paths, dead VERCEL_DEPLOYMENT refs)
- Commit .claude/instructions.md and .claude/skills/ (Claude Code session skills)
- Rewrite README.md to reflect multi-TCG platform (was Gundam-specific, 21KB)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Verify commit succeeded**

```bash
git log --oneline -3
git status
```

Expected: clean working tree, new commit at top of log.
