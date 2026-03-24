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

## Key Commands

```bash
npm run dev              # dev server (Turbopack)
npm run build            # production build
npm run test             # run tests
npm run check            # type-check + lint + tests
npm run db:push          # push schema changes
npm run db:seed:games    # seed game records
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
