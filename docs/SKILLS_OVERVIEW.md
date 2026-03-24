# Claude Code Skills — Newtype Decks

## What's here

6 skill files totaling ~990 lines, placed in `.claude/` so Claude Code auto-loads them on every session.

```
.claude/
├── instructions.md                    ← Master router: which skill to read + critical rules
└── skills/
    ├── project-architecture.md        ← ALWAYS READ: tech stack, multi-TCG system, patterns
    ├── api-routes.md                  ← API route development patterns
    ├── frontend-uiux.md              ← Frontend UI/UX agent persona (the design system)
    ├── database-prisma.md            ← Prisma schema, migrations, JSONB query patterns
    └── game-config.md                ← Adding new TCG games, config structure, deck rules
```

## How Claude Code uses these

1. `.claude/instructions.md` is read automatically on every session. It tells Claude Code to read the relevant skill file(s) before starting work.

2. The `project-architecture.md` skill is flagged as "always read first" — it has the immutable rules (game scoping, JSONB queries, visibility enum, no hardcoding).

3. The `frontend-uiux.md` skill activates the **Frontend UI/UX Agent persona** when doing any component, page, or design work. It includes:
   - Dark purple design system with all CSS variables
   - TCG-specific UX principles (density, speed, information hierarchy)
   - Card image display patterns, deck builder layout, search bar patterns
   - Component file structure and interaction patterns
   - Competitive research baked in (Moxfield, Archidekt, Scryfall, Piltover Archive)
   - Explicit don'ts (no modals for card detail, no layout animations, no generic gradients)

4. Each skill file is self-contained — Claude Code can read just the one it needs for a focused task.

## Installation

Already in the repo at `.claude/`. Just commit and push:

```bash
cd newtypedecks
git add .claude/
git commit -m "feat: add Claude Code skills for project architecture, API, frontend, database, game config"
git push origin main
```

Claude Code will pick them up on the next session automatically.

## How to invoke the frontend agent

When you want the design-focused agent, tell Claude Code:

> "Use the frontend UI/UX agent persona. Build a [component/page] following the design system in the frontend skill."

Or more naturally:

> "I need a new card detail page for /[gameSlug]/cards/[id]. Make it look good — use the dark purple theme, show the card image prominently, render game-specific attributes from gameAttributes JSONB, and make sure it works on mobile."

The `instructions.md` already tells Claude Code to adopt the frontend persona for any UI task, so even without explicitly asking, it should pick up the design system.
