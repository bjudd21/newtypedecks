# Architecture - How This Website Actually Works

> A junior developer's guide to understanding the Gundam Card Game website's runtime architecture

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [What Happens When You Visit localhost:3000](#what-happens-when-you-visit-localhost3000)
3. [The Next.js Server](#the-nextjs-server)
4. [The Database (PostgreSQL)](#the-database-postgresql)
5. [The Cache (Redis)](#the-cache-redis)
6. [Request Flow Diagrams](#request-flow-diagrams)
7. [Development vs Production](#development-vs-production)
8. [Service Communication](#service-communication)

---

## The Big Picture

This website is made up of **four main pieces** that work together:

```
┌─────────────┐
│   Browser   │  ← You interact with this
│ (localhost: │
│    3000)    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Next.js   │  ← The web server (runs your TypeScript/React code)
│   Server    │
└──────┬──────┘
       │
       ├──────→ ┌─────────────┐
       │        │ PostgreSQL  │  ← The database (stores cards, users, decks)
       │        │  Database   │
       │        └─────────────┘
       │
       └──────→ ┌─────────────┐
                │    Redis    │  ← The cache (stores sessions, temporary data)
                └─────────────┘
```

**Think of it like a restaurant:**

- **Browser**: You (the customer) ordering food
- **Next.js Server**: The waiter taking your order and bringing food
- **PostgreSQL**: The kitchen where ingredients (data) are stored long-term
- **Redis**: The prep station for quick access to commonly used items

---

## What Happens When You Visit localhost:3000

Let's walk through what happens when you type `localhost:3000` in your browser:

### Step 1: Your Browser Connects to the Next.js Server

```
Browser → http://localhost:3000 → Next.js Server (listening on port 3000)
```

When you run `npm run dev`, you start the Next.js development server. This server:

- Listens for connections on port 3000
- Waits for browsers to request pages
- Processes requests and sends back HTML, CSS, and JavaScript

### Step 2: Next.js Decides What to Send

Next.js looks at the URL you requested and decides what to do:

```javascript
// Example URLs and what they map to:
http://localhost:3000/              → src/app/page.tsx (Homepage)
http://localhost:3000/cards         → src/app/cards/page.tsx (Cards page)
http://localhost:3000/api/cards     → src/app/api/cards/route.ts (API endpoint)
http://localhost:3000/decks/abc123  → src/app/decks/[id]/page.tsx (Dynamic deck page)
```

### Step 3: The Page Might Need Data from the Database

If the page needs data (like showing cards or decks), Next.js:

```javascript
// Example from src/app/cards/page.tsx
const cards = await prisma.card.findMany(); // ← Asks PostgreSQL for data
```

1. Uses **Prisma** (a tool that talks to databases)
2. Sends a query to **PostgreSQL** (running in Docker on port 5432)
3. PostgreSQL finds the data and sends it back
4. Next.js receives the data and uses it to build the page

### Step 4: Next.js Sends the Page to Your Browser

```
Next.js → HTML + CSS + JavaScript → Browser
```

Your browser receives:

- **HTML**: The structure of the page
- **CSS**: The styling (colors, layout, fonts)
- **JavaScript**: Interactive features (buttons, forms, animations)

### Step 5: Your Browser Renders the Page

Your browser reads the HTML/CSS/JavaScript and displays the page you see!

---

## The Next.js Server

### What is Next.js?

Next.js is a **web framework** built on top of React. Think of it as a full web server that can:

1. Serve web pages (like Apache or Nginx)
2. Run server-side code (like a Node.js Express server)
3. Handle both frontend (React) and backend (API routes) in one place

### Two Types of Routes

#### 1. **Page Routes** (Frontend)

These render HTML pages for users to see:

```
src/app/
├── page.tsx              → Homepage (localhost:3000/)
├── cards/
│   └── page.tsx          → Cards page (localhost:3000/cards)
├── decks/
│   └── page.tsx          → Decks page (localhost:3000/decks)
```

#### 2. **API Routes** (Backend)

These handle data operations and return JSON:

```
src/app/api/
├── cards/
│   └── route.ts          → GET /api/cards (fetch cards)
├── decks/
│   └── route.ts          → POST /api/decks (create deck)
├── auth/
│   └── login/route.ts    → POST /api/auth/login (user login)
```

### How Next.js Processes a Request

```
1. Browser sends request → localhost:3000/cards

2. Next.js receives request
   ↓
3. Next.js looks up route → src/app/cards/page.tsx
   ↓
4. Executes page component
   ↓
5. If data needed: Query PostgreSQL via Prisma
   ↓
6. Renders React component to HTML
   ↓
7. Sends HTML back to browser
```

### Server-Side vs Client-Side

**Server-Side Code** (runs on your computer's Node.js):

```javascript
// This runs on the server
export default async function CardsPage() {
  const cards = await prisma.card.findMany(); // ← Can access database directly
  return <div>{cards.map(card => ...)}</div>;
}
```

**Client-Side Code** (runs in the browser):

```javascript
'use client'; // ← This tells Next.js "run this in the browser"

export default function InteractiveButton() {
  const [count, setCount] = useState(0); // ← Browser-only features
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## The Database (PostgreSQL)

### What is PostgreSQL?

PostgreSQL is a **database server** that stores all persistent data:

- User accounts and passwords
- Card information (names, images, stats)
- Decks created by users
- Collections and favorites

### How It's Running

When you run `npm run docker:dev`, Docker starts PostgreSQL:

```bash
$ docker-compose up -d

# This starts PostgreSQL in a container:
- Container Name: gcg-postgres
- Port: 5432 (default PostgreSQL port)
- Data Storage: Docker volume (persists when container stops)
```

### How Next.js Connects to PostgreSQL

Next.js uses **Prisma** as a bridge:

```
Next.js Code → Prisma Client → PostgreSQL Server
```

**Prisma** is an ORM (Object-Relational Mapper) that:

1. Translates JavaScript/TypeScript code into SQL queries
2. Provides type-safe database access
3. Handles connection pooling

Example:

```javascript
// Your TypeScript code
const cards = await prisma.card.findMany({
  where: { rarity: { name: 'Rare' } },
  take: 10
});

// ↓ Prisma converts to SQL ↓

SELECT * FROM cards
INNER JOIN rarities ON cards.rarityId = rarities.id
WHERE rarities.name = 'Rare'
LIMIT 10;
```

### Connection String

The connection is configured via environment variable:

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/gundam_cards"
```

Breakdown:

- `postgresql://` - Protocol (PostgreSQL)
- `user:password` - Credentials
- `localhost:5432` - Server location and port
- `gundam_cards` - Database name

### Database Schema

The database structure is defined in `prisma/schema.prisma`:

```prisma
model Card {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  // ... more fields

  // Relations
  type        CardType @relation(fields: [typeId], references: [id])
  decks       DeckCard[]
  collections CollectionCard[]
}
```

When you run `npm run db:push`, Prisma:

1. Reads the schema file
2. Creates/updates tables in PostgreSQL
3. Generates the Prisma Client code

---

## The Cache (Redis)

### What is Redis?

Redis is an **in-memory data store** that's extremely fast. Think of it as:

- PostgreSQL = Long-term storage (hard drive)
- Redis = Short-term storage (RAM)

### Why Do We Need Redis?

**User Sessions**: When you log in, your session data is stored in Redis:

```javascript
// User logs in
Session created → Redis stores: {
  userId: "abc123",
  email: "user@example.com",
  expiresAt: "2024-01-15T10:00:00Z"
}

// Future requests
Browser sends cookie → Next.js checks Redis → Finds session → User is logged in ✓
```

**Caching**: Frequently accessed data is cached for speed:

```javascript
// Without Redis (slow)
Browser → Next.js → Query PostgreSQL → Wait 50ms → Return data

// With Redis (fast)
Browser → Next.js → Check Redis cache → Found! → Return data (< 1ms)
```

### How It's Running

Docker starts Redis alongside PostgreSQL:

```bash
$ docker-compose up -d

# This starts Redis in a container:
- Container Name: gcg-redis
- Port: 6379 (default Redis port)
- Data Storage: In-memory (cleared when container stops, unless configured otherwise)
```

### How Next.js Connects to Redis

Via connection string:

```bash
# .env
REDIS_URL="redis://localhost:6379"
```

NextAuth (authentication library) uses Redis for sessions:

```javascript
// lib/auth.ts
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database', // Sessions stored in database (via Redis)
  },
  // ...
};
```

---

## Request Flow Diagrams

### Viewing a Page (e.g., Homepage)

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. HTTP GET localhost:3000/
     ↓
┌──────────────┐
│   Next.js    │
│   Server     │
└──────┬───────┘
       │ 2. Load src/app/page.tsx
       │ 3. Need data? Query database
       ↓
┌─────────────┐
│ PostgreSQL  │ 4. Return recent cards, decks, etc.
└──────┬──────┘
       ↓
┌──────────────┐
│   Next.js    │ 5. Render page with data
└──────┬───────┘
       │ 6. Send HTML + CSS + JS
       ↓
┌─────────┐
│ Browser │ 7. Display page
└─────────┘
```

### Logging In (Authentication Flow)

```
┌─────────┐
│ Browser │ 1. User enters email/password
└────┬────┘
     │ 2. POST /api/auth/login
     ↓
┌──────────────┐
│   Next.js    │ 3. Verify credentials
│  API Route   │
└──────┬───────┘
       │ 4. Check user in database
       ↓
┌─────────────┐
│ PostgreSQL  │ 5. Find user record
└──────┬──────┘
       ↓
┌──────────────┐
│   Next.js    │ 6. Password correct? Create session
└──────┬───────┘
       │ 7. Store session
       ↓
┌─────────────┐
│    Redis    │ 8. Save session data
└──────┬──────┘
       ↓
┌──────────────┐
│   Next.js    │ 9. Send session cookie to browser
└──────┬───────┘
       │ 10. Cookie + success response
       ↓
┌─────────┐
│ Browser │ 11. Store cookie, redirect to dashboard
└─────────┘
```

### Creating a Deck (Complex Flow)

```
┌─────────┐
│ Browser │ 1. User builds deck, clicks "Save"
└────┬────┘
     │ 2. POST /api/decks (with card IDs)
     ↓
┌──────────────┐
│   Next.js    │ 3. Check authentication
│  API Route   │
└──────┬───────┘
       │ 4. Verify session
       ↓
┌─────────────┐
│    Redis    │ 5. Session valid? Get user ID
└──────┬──────┘
       ↓
┌──────────────┐
│   Next.js    │ 6. Validate deck data
└──────┬───────┘
       │ 7. Check cards exist
       ↓
┌─────────────┐
│ PostgreSQL  │ 8. Query cards table
└──────┬──────┘
       │ 9. Cards found ✓
       ↓
┌──────────────┐
│   Next.js    │ 10. Create deck transaction
└──────┬───────┘
       │ 11. INSERT deck + deck_cards
       ↓
┌─────────────┐
│ PostgreSQL  │ 12. Save to database
└──────┬──────┘
       │ 13. Return new deck ID
       ↓
┌──────────────┐
│   Next.js    │ 14. Send success response
└──────┬───────┘
       │ 15. JSON { deckId: "xyz789" }
       ↓
┌─────────┐
│ Browser │ 16. Show success message, redirect to deck page
└─────────┘
```

---

## Development vs Production

### Development (localhost:3000)

**What runs where:**

```
Your Computer:
├── Next.js Dev Server (npm run dev)
├── Docker Container: PostgreSQL
├── Docker Container: Redis
└── Browser (you)
```

**Characteristics:**

- Hot reload (changes apply instantly)
- Detailed error messages
- Source maps (easier debugging)
- No optimization (slower but easier to debug)
- Database on localhost:5432
- Redis on localhost:6379

**Starting Development:**

```bash
# 1. Start databases
npm run docker:dev

# 2. Start Next.js
npm run dev

# 3. Open browser
# → http://localhost:3000
```

### Production (e.g., Vercel)

**What runs where:**

```
Vercel's Servers:
├── Next.js Server (optimized build)
└── CDN (images, static files)

External Services:
├── Cloud Database: PostgreSQL (e.g., Neon, Supabase)
└── Cloud Redis: Redis (e.g., Upstash)
```

**Characteristics:**

- Optimized build (faster, smaller)
- Minified code (harder to read but faster)
- Environment variables from hosting platform
- Database on cloud provider (not localhost)
- Redis on cloud provider (not localhost)
- HTTPS (secure connections)

**Building for Production:**

```bash
npm run build
npm run start
```

### Key Differences

| Feature      | Development             | Production          |
| ------------ | ----------------------- | ------------------- |
| **Server**   | localhost:3000          | yourdomain.com      |
| **Database** | Local Docker            | Cloud provider      |
| **Redis**    | Local Docker            | Cloud provider      |
| **Code**     | Unoptimized, hot reload | Optimized, minified |
| **Errors**   | Detailed stack traces   | Generic messages    |
| **Speed**    | Slower (dev mode)       | Faster (optimized)  |
| **HTTPS**    | No (http)               | Yes (https)         |

---

## Service Communication

### How Services Find Each Other

**Development:**

```javascript
// Next.js knows where to find PostgreSQL
DATABASE_URL = 'postgresql://localhost:5432/gundam_cards';
//                        ↑ localhost = your computer
//                              ↑ port 5432

// Next.js knows where to find Redis
REDIS_URL = 'redis://localhost:6379';
//                  ↑ localhost = your computer
//                        ↑ port 6379
```

**Production:**

```javascript
// Cloud database (example: Neon)
DATABASE_URL = 'postgresql://user@ep-cool-name.us-east-1.aws.neon.tech/neondb';
//                        ↑ cloud server address

// Cloud Redis (example: Upstash)
REDIS_URL = 'redis://user:pass@usw1-charming-camel-12345.upstash.io:6379';
//                              ↑ cloud server address
```

### Connection Pooling

**Problem**: Opening a database connection is slow (like opening a new phone call every time you want to talk).

**Solution**: Connection pooling keeps connections open and reuses them (like having an ongoing group chat).

```javascript
// Prisma handles connection pooling automatically
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Each request reuses existing connections
// → Much faster!
```

### Environment Variables

All connection info comes from `.env`:

```bash
# .env (development)
DATABASE_URL="postgresql://postgres:password@localhost:5432/gundam_cards"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-123"
```

These are loaded at startup:

```javascript
// lib/config/database.ts
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL not set!');
}
```

**Security Note**: Never commit `.env` to git! It contains secrets.

---

## Common Questions

### Q: Why do I need to run `npm run docker:dev`?

**A**: This starts PostgreSQL and Redis in Docker containers. Without them:

- Database queries fail (no PostgreSQL)
- User sessions don't work (no Redis)
- Website won't function properly

### Q: What if I don't want to use Docker?

**A**: You can install PostgreSQL and Redis directly on your computer:

```bash
# macOS
brew install postgresql redis

# Start services
brew services start postgresql
brew services start redis
```

Then update `.env` to point to local services (same as Docker setup).

### Q: Why is the first request slow?

**A**:

1. **Cold start**: Next.js server needs to compile pages on first visit
2. **Database connection**: Prisma establishes connection pool
3. **Redis connection**: NextAuth connects to Redis

Subsequent requests are much faster (connections are reused).

### Q: How do I see database tables?

**A**: Use Prisma Studio:

```bash
npm run db:studio
# Opens http://localhost:5555 with visual database browser
```

Or connect directly with a database client:

```bash
psql postgresql://postgres:password@localhost:5432/gundam_cards
```

### Q: Where are images stored?

**Development**: Local filesystem in `uploads/` directory

**Production**: Cloud storage (e.g., Vercel Blob, AWS S3, Cloudinary)

### Q: What happens if PostgreSQL crashes?

**A**:

- Website still loads (static pages)
- Data-dependent pages show errors
- API endpoints fail
- Need to restart database:

```bash
npm run docker:dev
```

### Q: What happens if Redis crashes?

**A**:

- Users get logged out
- Sessions are lost
- Caching disabled (slower but still works)
- Need to restart Redis:

```bash
npm run docker:dev
```

---

## Troubleshooting

### Website won't load

```bash
# Check if Next.js is running
npm run dev

# Should see:
# ▲ Next.js 15.x
# - Local: http://localhost:3000
```

### Database errors

```bash
# Check if PostgreSQL is running
docker ps

# Should see:
# gcg-postgres

# Restart if needed
npm run docker:dev
```

### Session/login issues

```bash
# Check if Redis is running
docker ps

# Should see:
# gcg-redis

# Restart if needed
npm run docker:dev
```

### Port conflicts

```bash
# Error: Port 3000 already in use

# Find and kill the process
lsof -ti:3000 | xargs kill

# Then restart
npm run dev
```

---

## Quick Reference

### Start Everything

```bash
npm run docker:dev  # Start PostgreSQL + Redis
npm run dev         # Start Next.js server
# → Open http://localhost:3000
```

### Ports

- **3000**: Next.js web server
- **5432**: PostgreSQL database
- **6379**: Redis cache
- **5555**: Prisma Studio (when running)

### Environment Files

- `.env`: Local development config
- `.env.example`: Template (safe to commit)
- `.env.production`: Production config (never commit)

### Key Directories

- `src/app/`: Pages and API routes
- `src/components/`: React components
- `src/lib/`: Utilities and database client
- `prisma/`: Database schema and migrations
- `public/`: Static files (images, fonts, etc.)

---

## Further Reading

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **Redis Quick Start**: https://redis.io/docs/getting-started/
- **API_REFERENCE.md**: Detailed API and database documentation
- **DEVELOPER_GUIDE.md**: Development workflow and best practices
