# 🚀 Running the Gundam Card Game Website Locally

Quick reference guide for getting the website running on your local machine.

> **📚 For comprehensive commands and architecture details, see [CLAUDE.md](/CLAUDE.md) in the project root.**

## Prerequisites

- **Docker & Docker Compose** installed
- **Node.js 18+** and **npm** installed
- **Git** (if cloning the repository)

## Quick Start (3 Steps)

### 1. Install and Setup

```bash
# Navigate to project
cd /Users/mkv/Documents/Projects/GCG

# Install dependencies and setup everything
npm install
npm run setup:full
```

This single command will:

- Create environment file with secure secrets
- Start Docker containers (PostgreSQL, Redis)
- Generate Prisma client
- Setup database schema
- Seed with sample data

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to: **`http://localhost:3000`**

**That's it!** The website is now running locally with full functionality.

---

## Common Commands

> **For the complete list of commands, see [CLAUDE.md - Development Commands](/CLAUDE.md#development-commands)**

**Development:**

```bash
npm run dev              # Start dev server
npm run build            # Build for production
```

**Database:**

```bash
npm run db:studio        # Visual database browser (localhost:5555)
npm run db:seed          # Add sample card data
npm run db:reset         # Reset database (destructive!)
```

**Code Quality:**

```bash
npm run lint:fix         # Fix linting issues
npm run type-check       # Check TypeScript
npm run test             # Run tests
```

**Docker:**

```bash
npm run docker:dev       # Start PostgreSQL & Redis
npm run docker:down      # Stop all containers
```

---

## Features Available Locally

Once running, you'll have access to:

- 🃏 **Card Database** with advanced search and filters
- 🏗️ **Deck Builder** with drag-and-drop and validation
- 📚 **Collection Manager** for tracking your cards
- 📱 **PWA Features** with offline support
- 👥 **User Authentication** and profiles

See the [PRD](/prd-gundam-card-game-website.md) for complete feature list.

---

## Troubleshooting

### Port Already in Use

Ports 3000, 5432, or 6379 are already taken:

```bash
# Check what's using the ports
lsof -i :3000 -i :5432 -i :6379

# Kill the process or modify docker-compose.yml
```

### Database Connection Failed

```bash
# Reset everything and start fresh
npm run docker:down
docker volume prune -f
npm run docker:dev
npm run db:push
npm run db:seed
```

### Permission Errors

```bash
# Fix file permissions (macOS/Linux)
sudo chown -R $USER:$USER .
```

### "Module not found" Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Optional Configuration

### Enable Social Login

Edit `.env` to add OAuth providers:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Enable Email Features

Edit `.env` for password reset/verification:

```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
```

> **For complete environment configuration, see [CLAUDE.md - Environment Configuration](/CLAUDE.md#environment-configuration)**

---

## Additional Resources

- **[CLAUDE.md](/CLAUDE.md)** - Complete development guide and commands
- **[docs/ARCHITECTURE.md](/docs/ARCHITECTURE.md)** - How the system works
- **[docs/DEVELOPER_GUIDE.md](/docs/DEVELOPER_GUIDE.md)** - Development workflow
- **[PRD](/prd-gundam-card-game-website.md)** - Complete feature specifications

---

**Last Updated: November 2024**
