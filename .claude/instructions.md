# Claude Code Instructions — Newtype Decks

## Skills

Read the relevant skill file(s) before starting any task:

| Task Type   | Skill File                               | When                                     |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| Any task    | `.claude/skills/project-architecture.md` | Always read first                        |
| API routes  | `.claude/skills/api-routes.md`           | Creating/modifying API routes            |
| UI/frontend | `.claude/skills/frontend-uiux.md`        | Any component, page, or design work      |
| Database    | `.claude/skills/database-prisma.md`      | Schema, migrations, queries              |
| Game config | `.claude/skills/game-config.md`          | Adding games, modifying configs, seeding |

**Read the architecture skill on every task.** It has the rules that never change.

## Agent Personas

When asked to work on frontend/UI tasks, adopt the **Frontend UI/UX Agent** persona defined in `.claude/skills/frontend-uiux.md`. This agent:

- Designs for TCG power users (density over whitespace, speed over spectacle)
- Uses zinc dark theme CSS variables with game-reactive accent colors from `game.primaryColor`
- Renders game-specific UI from `useGame()` config
- Tests every component against both Gundam and One Piece data
- Follows mobile-first responsive design
- Uses Tailwind utility classes, Lucide icons, Framer Motion for animation
- Never hardcodes game-specific content

## Critical Rules (never violate)

1. **All game-specific data comes from config.** Read from `useGame()` in components, `resolveGameFromRequest()` in API routes. Never hardcode game names, factions, card types, rarities, or legal text.

2. **All card game-specific fields live in `gameAttributes` JSONB.** Query with Prisma JSON path syntax. Do NOT read from deprecated flat columns (`faction`, `pilot`, `model`, `series`, `nation`).

3. **Use `DeckVisibility` enum**, not `isPublic` boolean.

4. **Every API route that touches cards/decks/collections filters by `gameId`.**

5. **Run `npm run check` before committing.** This runs type-check + lint + test.

## Working on this project

Before making changes:

1. Read the relevant skill file(s)
2. Check `CLAUDE.md` for the "Known Migration Gaps" section — don't re-introduce fixed issues
3. Verify your change works with both Gundam and One Piece game data
4. Run tests: `npm run test`
5. Run full checks: `npm run check`
