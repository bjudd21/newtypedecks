# Complete Beginner's Guide to the Gundam Card Game Web Application

**Welcome!** This guide is designed for someone who has **never built a web application before**. We'll explain everything from the ground up, using simple language and real-world analogies.

---

## Table of Contents

1. [What is a Web Application?](#what-is-a-web-application)
2. [What You're Working With](#what-youre-working-with)
3. [Getting Started: First-Time Setup](#getting-started-first-time-setup)
4. [Understanding the File Structure](#understanding-the-file-structure)
5. [How This Application Works](#how-this-application-works)
6. [The Building Blocks Explained](#the-building-blocks-explained)
7. [Daily Administration Tasks](#daily-administration-tasks)
8. [Making Updates & Changes](#making-updates--changes)
9. [Understanding Key Features](#understanding-key-features)
10. [Reference Materials](#reference-materials)
11. [Troubleshooting](#troubleshooting)
12. [Glossary](#glossary)

---

## What is a Web Application?

### Think of it Like This:

A **web application** is like a restaurant:

- **Frontend** (what users see) = The dining area, menu, and waitstaff
- **Backend** (behind the scenes) = The kitchen where food is prepared
- **Database** = The pantry where ingredients are stored
- **Server** = The building that houses everything

When a customer (user) orders food (requests data):
1. The waiter (frontend) takes the order
2. Sends it to the kitchen (backend/API)
3. The kitchen gets ingredients from the pantry (database)
4. Prepares the meal (processes data)
5. The waiter brings it to the customer (sends response)

### What Makes This Application Special?

Your Gundam Card Game application is a **full-stack** web application, meaning it handles both the "dining area" (user interface) and the "kitchen" (data processing) in one integrated system.

**What it does:**
- Displays a searchable database of Gundam cards
- Lets users build and save card decks
- Tracks user collections
- Manages user accounts and authentication
- Works like a mobile app (Progressive Web App)

---

## What You're Working With

### The Technology Stack (Explained Simply)

Think of building a web application like building a house. You need different materials and tools:

#### 1. **Next.js 15** - The Foundation
- **What it is:** A framework (blueprint) for building web applications
- **Why it matters:** Handles routing (which page to show), server logic, and optimization automatically
- **Real-world analogy:** Like a pre-built house frame—you don't have to build walls from scratch

#### 2. **React 19** - The Building Blocks
- **What it is:** A library for building user interfaces with reusable components
- **Why it matters:** Instead of writing HTML for every button, you create one Button component and reuse it everywhere
- **Real-world analogy:** Like LEGO blocks—build once, use everywhere

#### 3. **TypeScript** - The Safety Inspector
- **What it is:** JavaScript with type checking (catches errors before they happen)
- **Why it matters:** Prevents bugs by ensuring data has the right shape/type
- **Real-world analogy:** Like spell-check for code

#### 4. **PostgreSQL** - The Filing Cabinet
- **What it is:** A database that stores all your data (users, cards, decks)
- **Why it matters:** Permanent, organized storage that survives server restarts
- **Real-world analogy:** A well-organized filing cabinet with folders and labels

#### 5. **Redis** - The Sticky Notes
- **What it is:** Fast, temporary storage (cache)
- **Why it matters:** Makes the app faster by remembering frequently accessed data
- **Real-world analogy:** Sticky notes on your desk for quick reference

#### 6. **Tailwind CSS** - The Paint and Decorations
- **What it is:** A styling system using utility classes
- **Why it matters:** Makes the app look good without writing custom CSS
- **Real-world analogy:** Pre-mixed paint colors you can apply quickly

#### 7. **Prisma** - The Translator
- **What it is:** ORM (Object-Relational Mapping) tool
- **Why it matters:** Lets you talk to the database using JavaScript instead of SQL
- **Real-world analogy:** A translator who speaks both English and Japanese

#### 8. **Docker** - The Shipping Container
- **What it is:** Containerization tool that packages software
- **Why it matters:** Runs PostgreSQL and Redis in isolated environments
- **Real-world analogy:** Shipping containers that work the same everywhere

---

## Getting Started: First-Time Setup

### Prerequisites (What You Need Installed)

Before you start, you need these tools on your computer:

#### 1. **Node.js** (v18 or higher)
- **What it is:** JavaScript runtime (lets you run JavaScript outside the browser)
- **Download from:** https://nodejs.org/
- **How to check:** Open Terminal and type: `node --version`
- **You should see:** `v18.x.x` or higher

#### 2. **npm** (comes with Node.js)
- **What it is:** Package manager (downloads and manages code libraries)
- **How to check:** Type: `npm --version`
- **You should see:** `8.x.x` or higher

#### 3. **Docker Desktop**
- **What it is:** Runs containers for PostgreSQL and Redis
- **Download from:** https://www.docker.com/products/docker-desktop/
- **How to check:** Type: `docker --version`
- **You should see:** `Docker version 20.x.x` or higher

#### 4. **Code Editor** (Recommended: VS Code)
- **What it is:** Where you'll edit code files
- **Download from:** https://code.visualstudio.com/
- **Why VS Code:** Has excellent TypeScript support and extensions

### Step-by-Step First-Time Setup

#### Step 1: Get the Code

```bash
# Open Terminal and navigate to where you want the project
cd ~/Documents/Projects

# The code is already here at:
cd /Users/mkv/Documents/Projects/GCG
```

#### Step 2: Install Dependencies

```bash
# This downloads all required packages (takes 2-5 minutes)
npm install

# What this does:
# - Reads package.json (the shopping list)
# - Downloads 900+ packages to node_modules folder
# - Creates package-lock.json (the receipt)
```

**💡 Pro Tip:** If you see `npm WARN`, that's okay. Warnings are suggestions. Errors (npm ERR!) are problems.

#### Step 3: Set Up Environment Variables

Environment variables are like secret passwords and configuration settings.

```bash
# Create your .env file from the template
npm run env:create

# This creates .env with default values
```

Now open `.env` in your code editor and you'll see:

```bash
# Database connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/gundam_cards"

# NextAuth (authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-me"

# Redis (caching)
REDIS_URL="redis://localhost:6379"
```

**⚠️ Important:** Change `NEXTAUTH_SECRET` to a random string. You can generate one:

```bash
# Run this to generate a secure secret
npm run env:secrets
```

#### Step 4: Start Docker Services

Docker will run PostgreSQL (database) and Redis (cache) in containers.

```bash
# Start both services
npm run docker:dev

# You should see:
# ✔ Container postgres    Started
# ✔ Container redis       Started
```

**What this does:**
- Creates a PostgreSQL database on port 5432
- Creates a Redis cache on port 6379
- Both services keep running in the background

**How to stop them later:**
```bash
npm run docker:down
```

#### Step 5: Set Up the Database

```bash
# Create all database tables
npm run db:push

# Optional: Add sample data for testing
npm run db:seed
```

**What `db:push` does:**
- Reads `prisma/schema.prisma` (database blueprint)
- Creates tables like `User`, `Card`, `Deck`, `Collection`
- Sets up relationships between tables

**What `db:seed` does:**
- Adds sample cards, users, and decks
- Useful for testing the app with real data

#### Step 6: Start the Development Server

```bash
# Start the application
npm run dev

# You should see:
# ✓ Ready in 2.2s
# ◐ Local: http://localhost:3000
```

Now open your browser and visit: **http://localhost:3000**

🎉 **Congratulations!** Your application is running!

---

## Understanding the File Structure

### The Big Picture

```
gundam-card-game/
├── 📁 src/                    # All your source code
├── 📁 prisma/                 # Database schema
├── 📁 public/                 # Static files (images, icons)
├── 📁 docs/                   # Documentation
├── 📄 package.json            # Project configuration & dependencies
├── 📄 next.config.ts          # Next.js configuration
├── 📄 .env                    # Environment variables (secrets)
└── 📄 docker-compose.yml      # Docker services configuration
```

### The `src/` Folder (Where Most of Your Work Happens)

```
src/
├── 📁 app/                          # Pages and API routes (Next.js 15 App Router)
│   ├── 📄 layout.tsx                # Wraps every page (header, footer, providers)
│   ├── 📄 page.tsx                  # Homepage (/)
│   ├── 📁 cards/                    # Card browsing pages
│   │   ├── 📄 page.tsx              # /cards
│   │   └── 📁 [id]/                 # Dynamic route
│   │       └── 📄 page.tsx          # /cards/123
│   ├── 📁 decks/                    # Deck building pages
│   │   ├── 📄 page.tsx              # /decks
│   │   └── 📁 [id]/                 # /decks/123
│   ├── 📁 collection/               # Collection management
│   ├── 📁 auth/                     # Login/signup pages
│   └── 📁 api/                      # Backend API routes
│       ├── 📁 cards/                # Card operations
│       │   ├── 📄 route.ts          # GET/POST /api/cards
│       │   └── 📁 [id]/             # /api/cards/123
│       ├── 📁 decks/                # Deck operations
│       ├── 📁 collections/          # Collection operations
│       └── 📁 auth/                 # Authentication endpoints
│
├── 📁 components/                   # Reusable UI components
│   ├── 📁 ui/                       # Basic UI components
│   │   ├── 📄 Button.tsx            # Button component
│   │   ├── 📄 Card.tsx              # Card container component
│   │   ├── 📄 Modal.tsx             # Modal dialog
│   │   └── 📄 Input.tsx             # Form input
│   ├── 📁 card/                     # Card-specific components
│   │   ├── 📄 CardGrid.tsx          # Grid of cards
│   │   ├── 📄 CardDetail.tsx        # Card details modal
│   │   └── 📄 CardSearch.tsx        # Search interface
│   ├── 📁 deck/                     # Deck-specific components
│   │   ├── 📄 DeckBuilder.tsx       # Main deck builder
│   │   └── 📄 DeckList.tsx          # List of decks
│   └── 📁 navigation/               # Navigation components
│       ├── 📄 Navbar.tsx            # Top navigation bar
│       └── 📄 MobileMenu.tsx        # Mobile menu
│
├── 📁 lib/                          # Utility code and configurations
│   ├── 📄 auth.ts                   # NextAuth configuration
│   ├── 📄 database.ts               # Prisma client singleton
│   ├── 📁 services/                 # Business logic
│   │   ├── 📄 cardService.ts        # Card operations
│   │   ├── 📄 deckService.ts        # Deck operations
│   │   └── 📄 userService.ts        # User operations
│   ├── 📁 types/                    # TypeScript type definitions
│   └── 📁 utils/                    # Helper functions
│
└── 📁 store/                        # Redux state management
    ├── 📄 index.ts                  # Store configuration
    ├── 📄 Provider.tsx              # Redux provider component
    └── 📁 slices/                   # State slices
        ├── 📄 authSlice.ts          # Authentication state
        ├── 📄 cardSlice.ts          # Card browsing state
        ├── 📄 deckSlice.ts          # Deck building state
        └── 📄 uiSlice.ts            # UI state (modals, theme)
```

### Key Files Explained

#### 📄 `package.json` - The Project's Shopping List
Lists all dependencies (libraries) and scripts (commands) for the project.

```json
{
  "name": "gundam-card-game",
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build for production
    "test": "jest"               // Run tests
  },
  "dependencies": {
    "next": "15.5.3",            // Next.js framework
    "react": "19.2.0",           // React library
    // ... 50+ more packages
  }
}
```

#### 📄 `prisma/schema.prisma` - The Database Blueprint
Defines all tables, columns, and relationships.

```prisma
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String?
  role          UserRole    @default(USER)
  decks         Deck[]      // One user has many decks
  collection    Collection? // One user has one collection
  createdAt     DateTime    @default(now())
}

model Deck {
  id          String      @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  cards       DeckCard[]  // One deck has many cards
}
```

#### 📄 `.env` - Secret Configuration
**⚠️ NEVER commit this file to git!**

Contains sensitive information like database passwords and API keys.

---

## How This Application Works

### The User Journey: From Click to Display

Let's trace what happens when a user visits the card browsing page:

```
┌─────────────┐
│   Browser   │ User types: http://localhost:3000/cards
│   (Safari)  │
└──────┬──────┘
       │ 1. HTTP Request
       ▼
┌─────────────────────┐
│   Next.js Server    │ Receives request for /cards
│                     │
│  2. Checks routing  │ Looks in src/app/cards/page.tsx
└──────┬──────────────┘
       │ 3. Middleware
       ▼
┌─────────────────────┐
│   Middleware        │ Checks if user is logged in
│  (authentication)   │ Checks permissions
└──────┬──────────────┘
       │ 4. Page Component
       ▼
┌─────────────────────┐
│  src/app/cards/     │ Server Component runs
│  page.tsx           │
│                     │ 5. Fetches data
│  - Calls API        │────────┐
│  - Gets cards       │        │
└──────┬──────────────┘        │
       │                       ▼
       │              ┌─────────────────┐
       │              │   API Route     │
       │              │   /api/cards    │
       │              │                 │
       │              │ 6. Service Layer│
       │              └────────┬────────┘
       │                       │
       │                       ▼
       │              ┌─────────────────┐
       │              │    Prisma       │
       │              │   (Database)    │
       │              │                 │
       │              │ 7. SQL Query    │
       │              └────────┬────────┘
       │                       │
       │                       ▼
       │              ┌─────────────────┐
       │              │   PostgreSQL    │
       │              │                 │
       │              │ 8. Returns data │
       │              └────────┬────────┘
       │                       │
       │ 9. Renders HTML       │
       │    with card data     │
       ◄───────────────────────┘
       │
       │ 10. Sends HTML to browser
       ▼
┌─────────────┐
│   Browser   │ Displays beautiful card grid!
│   (Safari)  │
└─────────────┘
```

### Frontend vs Backend (Explained Simply)

#### Frontend (Client-Side)
**What users see and interact with**

```typescript
// Example: A button the user clicks
function SaveButton() {
  return (
    <button onClick={() => alert('Saved!')}>
      Save Deck
    </button>
  );
}
```

**Characteristics:**
- Runs in the user's browser
- Uses React components
- Has access to browser APIs (localStorage, cookies)
- Can be "client" or "server" components in Next.js 15

#### Backend (Server-Side)
**Behind-the-scenes logic**

```typescript
// Example: API route that saves a deck
export async function POST(request: Request) {
  const data = await request.json();

  // Save to database
  const deck = await prisma.deck.create({
    data: { name: data.name, userId: data.userId }
  });

  return Response.json(deck);
}
```

**Characteristics:**
- Runs on the server (your computer or cloud hosting)
- Has access to database
- Handles sensitive operations (authentication, payments)
- Never visible to users

### How Authentication Works (Login/Signup)

Think of authentication like checking into a hotel:

1. **Sign Up** = Check-in (create account)
2. **Session** = Room key (proves you're a guest)
3. **Logout** = Check-out (return key)

#### The Sign-Up Flow

```
User fills out form
    ↓
Submits email + password
    ↓
Backend receives request
    ↓
Validates email format
    ↓
Hashes password (encryption)
    ↓
Saves to database
    ↓
Creates session (JWT token)
    ↓
Sends token as cookie
    ↓
User is logged in!
```

#### The Session System

Every time a logged-in user makes a request:

```typescript
// Server checks the session cookie
const session = await getServerSession(authOptions);

if (!session) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

// User is authenticated!
const userId = session.user.id;
```

### How the Deck Builder Works

The deck builder is like a shopping cart:

1. **Browse cards** (product catalog)
2. **Add to deck** (add to cart)
3. **Adjust quantity** (1-4 copies per card)
4. **Save deck** (checkout)

#### Component Interaction

```
┌─────────────────────────┐
│    DeckBuilder.tsx      │  Main container
│                         │
│  ┌──────────────────┐   │
│  │ DeckCardSearch   │   │  Search for cards
│  └────────┬─────────┘   │
│           │ emits event │
│           ▼             │
│  ┌──────────────────┐   │
│  │ Redux Store      │   │  Stores selected cards
│  │ (deckSlice)      │   │
│  └────────┬─────────┘   │
│           │ provides    │
│           ▼             │
│  ┌──────────────────┐   │
│  │ DeckCardList     │   │  Displays cards in deck
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ DeckStats        │   │  Shows deck stats
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ SaveButton       │   │  Saves to database
│  └──────────────────┘   │
└─────────────────────────┘
```

---

## The Building Blocks Explained

### React Components (The LEGO Blocks)

Components are reusable pieces of UI. Think of them like LEGO blocks—you build complex structures from simple pieces.

#### A Simple Component

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  children: string;        // Button text
  onClick: () => void;     // What happens when clicked
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
    >
      {children}
    </button>
  );
}
```

**Using the component:**

```typescript
<Button onClick={() => alert('Hello!')} variant="primary">
  Click Me
</Button>
```

#### Server vs Client Components (Next.js 15)

**Server Components** (default):
- Render on the server
- Can directly access database
- NO client-side JavaScript
- Cannot use useState, useEffect, or event handlers

```typescript
// Server Component (no 'use client')
export default async function CardsPage() {
  // This runs on the server!
  const cards = await prisma.card.findMany();

  return <div>{cards.length} cards found</div>;
}
```

**Client Components:**
- Render on the client (browser)
- Can use hooks (useState, useEffect)
- Can have event handlers (onClick, onChange)
- Need `'use client'` directive at the top

```typescript
'use client';  // This makes it a Client Component

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

**💡 Pro Tip:** Use Server Components by default. Only use Client Components when you need interactivity.

### The Database (Where Everything Lives)

Think of the database like an Excel spreadsheet with multiple sheets (tables):

#### Tables (Like Spreadsheet Sheets)

**Users Table:**
```
| id   | email              | name    | role  |
|------|--------------------|---------|-------|
| u001 | alice@example.com  | Alice   | USER  |
| u002 | bob@example.com    | Bob     | ADMIN |
```

**Cards Table:**
```
| id   | name           | level | cost | faction |
|------|----------------|-------|------|---------|
| c001 | RX-78-2 Gundam | 5     | 3    | EF      |
| c002 | Zaku II        | 3     | 2    | Zeon    |
```

**Decks Table:**
```
| id   | name         | userId | createdAt  |
|------|--------------|--------|------------|
| d001 | Gundam Rush  | u001   | 2025-01-15 |
| d002 | Zeon Control | u001   | 2025-01-16 |
```

**DeckCards Table** (Join table):
```
| deckId | cardId | quantity |
|--------|--------|----------|
| d001   | c001   | 3        |
| d001   | c002   | 2        |
```

#### How Prisma Talks to the Database

Instead of writing SQL:
```sql
SELECT * FROM cards WHERE level >= 5 AND faction = 'EF';
```

You write JavaScript:
```typescript
const cards = await prisma.card.findMany({
  where: {
    level: { gte: 5 },
    faction: 'EF'
  }
});
```

Much easier to read and write!

### API Routes (The Waiters)

API routes are like waiters who take orders (requests) and bring food (responses).

#### Anatomy of an API Route

```typescript
// src/app/api/cards/route.ts

// GET request handler
export async function GET(request: Request) {
  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  // Query database
  const cards = await prisma.card.findMany({
    where: { name: { contains: search } }
  });

  // Return JSON response
  return Response.json({ cards });
}

// POST request handler (create new card)
export async function POST(request: Request) {
  // Parse request body
  const data = await request.json();

  // Validate data
  if (!data.name) {
    return Response.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  // Create in database
  const card = await prisma.card.create({
    data: { name: data.name, level: data.level }
  });

  // Return created card
  return Response.json(card, { status: 201 });
}
```

#### HTTP Methods Explained

- **GET** = Read data (like asking "What cards do you have?")
- **POST** = Create new data (like saying "Add this card")
- **PUT** = Update existing data (like saying "Change this deck name")
- **DELETE** = Remove data (like saying "Delete this deck")

### State Management (Redux)

Redux is like a shared whiteboard that all components can see and write on.

**Without Redux:**
```typescript
// Components pass data through props (like a game of telephone)
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data}>
      <GreatGrandChild data={data} />
    </GrandChild>
  </Child>
</Parent>
```

**With Redux:**
```typescript
// Components access data directly from the store
function AnyComponent() {
  const data = useAppSelector(state => state.cards.data);
  // No need to pass through all parents!
}
```

#### How Redux Works

1. **Store** = The whiteboard (centralized state)
2. **Actions** = What you want to do ("Add card to deck")
3. **Reducers** = How to update the state (the rules)
4. **Selectors** = Read data from the store

```typescript
// Define a slice (section of the store)
const cardSlice = createSlice({
  name: 'cards',
  initialState: { cards: [], loading: false },
  reducers: {
    setCards: (state, action) => {
      state.cards = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

// Dispatch an action (update the store)
dispatch(setCards([card1, card2, card3]));

// Select data (read from the store)
const cards = useAppSelector(state => state.cards.cards);
```

### Styling with Tailwind CSS

Tailwind uses utility classes instead of custom CSS.

**Traditional CSS:**
```css
.button {
  background-color: blue;
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
}
```

**Tailwind CSS:**
```typescript
<button className="bg-blue-500 px-4 py-2 rounded text-white">
  Click me
</button>
```

**Common Tailwind Classes:**
- `flex` = Display flex
- `items-center` = Align items vertically
- `justify-between` = Space items apart
- `p-4` = Padding of 1rem (16px)
- `m-2` = Margin of 0.5rem (8px)
- `text-xl` = Extra large text
- `font-bold` = Bold text
- `bg-blue-500` = Blue background
- `hover:bg-blue-600` = Darker blue on hover
- `rounded-lg` = Large border radius
- `shadow-md` = Medium shadow

---

## Daily Administration Tasks

### Starting the Application

**Every time you want to work on the application:**

```bash
# 1. Make sure Docker is running (PostgreSQL + Redis)
npm run docker:dev

# 2. Start the development server
npm run dev

# 3. Open browser to http://localhost:3000
```

**💡 Pro Tip:** Create an alias in your terminal for faster startup:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias gcg-start="cd /Users/mkv/Documents/Projects/GCG && npm run docker:dev && npm run dev"
```

Then just type: `gcg-start`

### Stopping the Application

```bash
# Stop the development server
# Press Ctrl+C in the terminal where dev server is running

# Stop Docker services
npm run docker:down
```

### Monitoring Application Health

#### Check if Services are Running

```bash
# Check if dev server is running
curl http://localhost:3000/api/health

# Check if PostgreSQL is running
docker ps | grep postgres

# Check if Redis is running
docker ps | grep redis
```

#### View Server Logs

The terminal where you ran `npm run dev` shows real-time logs:

```
✓ Compiled /cards in 1.2s
GET /cards 200 in 1500ms
POST /api/decks 201 in 245ms
```

**What to look for:**
- `200` = Success
- `201` = Created successfully
- `400` = Bad request (user error)
- `401` = Unauthorized (not logged in)
- `403` = Forbidden (insufficient permissions)
- `404` = Not found
- `500` = Server error (something broke)

### Database Administration

#### Open Prisma Studio (Database GUI)

```bash
npm run db:studio
```

Opens a web interface at http://localhost:5555 where you can:
- View all tables
- Browse data
- Edit records
- Delete records
- Add new records

**⚠️ Warning:** Changes here are PERMANENT. Be careful!

#### Backup the Database

```bash
# Export entire database to SQL file
docker exec -t postgres pg_dump -U postgres gundam_cards > backup.sql

# Restore from backup
docker exec -i postgres psql -U postgres gundam_cards < backup.sql
```

**💡 Pro Tip:** Back up before major changes!

#### Reset the Database

```bash
# WARNING: This deletes ALL data!
npm run db:reset

# Then re-seed if needed
npm run db:seed
```

### Managing User Accounts

#### View All Users

```bash
npm run db:studio
# Navigate to "User" table
```

#### Change a User's Role

In Prisma Studio:
1. Find the user
2. Click on the role field
3. Select: `USER`, `MODERATOR`, or `ADMIN`
4. Click Save

#### Delete a User

**⚠️ Warning:** This will also delete their decks and collections!

```bash
# In Prisma Studio, click the user row and delete
# OR use API/admin interface
```

### Handling Card Submissions

Users can submit new cards. Admins review and approve them.

#### View Pending Submissions

1. Log in as admin
2. Visit `/admin/submissions`
3. See list of pending cards

#### Approve a Submission

```typescript
// In admin interface, click "Approve"
// This:
// 1. Creates a new Card record
// 2. Marks submission as approved
// 3. Notifies the submitter
```

#### Reject a Submission

```typescript
// Click "Reject" and provide a reason
// User will see the rejection reason
```

---

## Making Updates & Changes

### How to Add a New Page

**Goal:** Add a page at `/tournaments`

#### Step 1: Create the Page File

```bash
# Create the directory and file
mkdir -p src/app/tournaments
touch src/app/tournaments/page.tsx
```

#### Step 2: Write the Component

```typescript
// src/app/tournaments/page.tsx
export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Tournaments
      </h1>
      <p>Find upcoming Gundam Card Game tournaments!</p>
    </div>
  );
}
```

#### Step 3: Add Navigation Link

```typescript
// src/components/navigation/Navbar.tsx
const navigation = [
  { name: 'Cards', href: '/cards' },
  { name: 'Decks', href: '/decks' },
  { name: 'Collection', href: '/collection' },
  { name: 'Tournaments', href: '/tournaments' },  // Add this
];
```

#### Step 4: Test It

Visit: http://localhost:3000/tournaments

### How to Create a New Component

**Goal:** Create a `TournamentCard` component

#### Step 1: Choose the Right Location

```bash
# Create in components/tournament/
mkdir -p src/components/tournament
touch src/components/tournament/TournamentCard.tsx
```

#### Step 2: Define Props Interface

```typescript
// src/components/tournament/TournamentCard.tsx
interface TournamentCardProps {
  name: string;
  date: string;
  location: string;
  participants: number;
}

export function TournamentCard({
  name,
  date,
  location,
  participants
}: TournamentCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg">
      <h3 className="font-bold text-xl">{name}</h3>
      <p className="text-gray-600">{date}</p>
      <p className="text-sm">{location}</p>
      <p className="text-sm">
        {participants} participants
      </p>
    </div>
  );
}
```

#### Step 3: Export from Index

```typescript
// src/components/tournament/index.ts
export { TournamentCard } from './TournamentCard';
```

#### Step 4: Use the Component

```typescript
import { TournamentCard } from '@/components/tournament';

<TournamentCard
  name="Spring Championship"
  date="2025-03-15"
  location="Tokyo, Japan"
  participants={64}
/>
```

### How to Add a New API Endpoint

**Goal:** Create `/api/tournaments` endpoint

#### Step 1: Create Route File

```bash
mkdir -p src/app/api/tournaments
touch src/app/api/tournaments/route.ts
```

#### Step 2: Implement Handlers

```typescript
// src/app/api/tournaments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/tournaments - List tournaments
export async function GET(request: NextRequest) {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { date: 'desc' },
      take: 20
    });

    return NextResponse.json({ tournaments });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}

// POST /api/tournaments - Create tournament (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.date || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        maxParticipants: data.maxParticipants || 64,
      }
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}
```

#### Step 3: Test the Endpoint

```bash
# GET request
curl http://localhost:3000/api/tournaments

# POST request (requires authentication)
curl -X POST http://localhost:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Tournament","date":"2025-03-15","location":"Tokyo"}'
```

### How to Modify the Database Schema

**Goal:** Add a `Tournament` table

#### Step 1: Edit Prisma Schema

```prisma
// prisma/schema.prisma

model Tournament {
  id                String      @id @default(cuid())
  name              String
  description       String?
  date              DateTime
  location          String
  maxParticipants   Int         @default(64)
  registrationOpen  Boolean     @default(true)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  // Relations
  participants      TournamentParticipant[]

  @@index([date])
}

model TournamentParticipant {
  id            String      @id @default(cuid())
  tournamentId  String
  userId        String
  deckId        String?
  registeredAt  DateTime    @default(now())

  tournament    Tournament  @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck          Deck?       @relation(fields: [deckId], references: [id])

  @@unique([tournamentId, userId])
  @@index([tournamentId])
  @@index([userId])
}
```

#### Step 2: Add Relations to Existing Models

```prisma
model User {
  // ... existing fields
  tournaments   TournamentParticipant[]  // Add this
}

model Deck {
  // ... existing fields
  tournaments   TournamentParticipant[]  // Add this
}
```

#### Step 3: Push Changes to Database

**For Development:**
```bash
npm run db:push
```

**For Production (creates migration):**
```bash
npm run db:migrate
# Enter migration name: "add_tournaments"
```

#### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

#### Step 5: Verify Changes

```bash
npm run db:studio
# Check that Tournament table exists
```

### How to Update Card Data

#### Method 1: Using Prisma Studio

1. Run `npm run db:studio`
2. Navigate to "Card" table
3. Find the card
4. Click the field to edit
5. Save changes

#### Method 2: Using API (Programmatic)

```bash
# Update a single card
curl -X PUT http://localhost:3000/api/cards/c123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","level":6}'
```

#### Method 3: Bulk Update via Script

```typescript
// scripts/update-cards.ts
import { prisma } from './lib/database';

async function updateCards() {
  // Update all cards from set ST01
  await prisma.card.updateMany({
    where: { setId: 'ST01' },
    data: { isPromo: false }
  });

  console.log('Cards updated!');
}

updateCards();
```

Run with:
```bash
npx ts-node scripts/update-cards.ts
```

### How to Change Styling/Colors

#### Update the Theme Colors

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',  // Change this to your color
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

#### Update Component Styles

```typescript
// Before
<button className="bg-cyan-500 hover:bg-cyan-600">
  Click me
</button>

// After (using new primary color)
<button className="bg-primary-500 hover:bg-primary-600">
  Click me
</button>
```

### Testing Your Changes

#### Run All Tests

```bash
npm test
```

#### Run Tests in Watch Mode

```bash
npm run test:watch
```

#### Run Tests for Specific File

```bash
npm test -- CardGrid.test.tsx
```

#### Check Type Safety

```bash
npm run type-check
```

#### Check Code Quality

```bash
npm run lint
```

---

## Understanding Key Features

### Card Database: How Search Works

#### The Search Flow

```
User types "Gundam" in search box
    ↓
React component updates state
    ↓
Debounced API call (waits 300ms)
    ↓
GET /api/cards/search?search=Gundam
    ↓
Backend receives request
    ↓
Builds Prisma query:
  where: { name: { contains: "Gundam", mode: "insensitive" } }
    ↓
PostgreSQL searches with ILIKE
    ↓
Returns matching cards
    ↓
Frontend updates card grid
    ↓
User sees results!
```

#### Advanced Filtering

The search supports multiple filters simultaneously:

```typescript
// User selects:
// - Text: "Gundam"
// - Type: "Unit"
// - Faction: "Earth Federation"
// - Level: 4-6

// Backend builds query:
const cards = await prisma.card.findMany({
  where: {
    AND: [
      { name: { contains: "Gundam", mode: "insensitive" } },
      { type: { name: "Unit" } },
      { faction: "Earth Federation" },
      { level: { gte: 4, lte: 6 } }
    ]
  },
  include: {
    type: true,
    rarity: true,
    set: true
  }
});
```

### Deck Builder: Drag-and-Drop System

#### How Drag-and-Drop Works

The deck builder uses the HTML5 Drag and Drop API:

```typescript
// 1. Make card draggable
<div
  draggable={true}
  onDragStart={(e) => {
    e.dataTransfer.setData('cardId', card.id);
  }}
>
  {card.name}
</div>

// 2. Define drop zone
<div
  onDragOver={(e) => e.preventDefault()}  // Allow drop
  onDrop={(e) => {
    const cardId = e.dataTransfer.getData('cardId');
    addCardToDeck(cardId);
  }}
>
  Drop cards here
</div>
```

#### Deck Validation Rules

```typescript
function validateDeck(deck: Deck): ValidationResult {
  const errors = [];

  // Check minimum cards (typically 40)
  if (deck.cards.length < 40) {
    errors.push('Deck must have at least 40 cards');
  }

  // Check maximum copies (typically 4 per card)
  deck.cards.forEach(card => {
    if (card.quantity > 4) {
      errors.push(`${card.name}: Maximum 4 copies allowed`);
    }
  });

  // Check faction restrictions (optional)
  const factions = new Set(deck.cards.map(c => c.faction));
  if (factions.size > 2) {
    errors.push('Deck cannot have more than 2 factions');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### Collection Manager: Tracking Owned Cards

#### The Collection Model

```prisma
model Collection {
  id        String            @id @default(cuid())
  userId    String            @unique
  user      User              @relation(fields: [userId], references: [id])
  cards     CollectionCard[]  // Join table
}

model CollectionCard {
  id           String      @id @default(cuid())
  collectionId String
  cardId       String
  quantity     Int         @default(1)

  collection   Collection  @relation(fields: [collectionId], references: [id])
  card         Card        @relation(fields: [cardId], references: [id])

  @@unique([collectionId, cardId])
}
```

#### Adding Cards to Collection

```typescript
// User clicks "Add to Collection"
async function addToCollection(cardId: string, quantity: number) {
  // Check if card already in collection
  const existing = await prisma.collectionCard.findFirst({
    where: {
      collectionId: userCollectionId,
      cardId: cardId
    }
  });

  if (existing) {
    // Update quantity
    await prisma.collectionCard.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
  } else {
    // Create new entry
    await prisma.collectionCard.create({
      data: {
        collectionId: userCollectionId,
        cardId: cardId,
        quantity: quantity
      }
    });
  }
}
```

### PWA: Making It Work Offline

#### Service Worker Registration

```typescript
// Registered in src/app/layout.tsx
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered!');
    });
}
```

#### What Gets Cached

The service worker caches:
1. **App shell** (HTML, CSS, JavaScript)
2. **Static assets** (fonts, icons)
3. **Card images** (for offline viewing)
4. **API responses** (for limited offline functionality)

#### Offline Functionality

```typescript
// Service worker intercepts fetch requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request);
      })
  );
});
```

---

## Reference Materials

### Glossary of Technical Terms

**API (Application Programming Interface)**
A way for programs to talk to each other. Like a waiter taking orders between customers and the kitchen.

**Authentication**
Verifying who a user is (login).

**Authorization**
Checking what a user is allowed to do (permissions).

**Cache**
Temporary storage for frequently accessed data (makes things faster).

**Client**
The user's browser (where the app runs).

**Component**
A reusable piece of UI (like a button or card).

**Database**
Permanent storage for data (like a filing cabinet).

**Deployment**
Publishing the app to a live server (making it available to users).

**Environment Variables**
Secret configuration values (like passwords).

**Frontend**
The user interface (what users see).

**Backend**
Server-side logic (what happens behind the scenes).

**Hook**
A React function that lets you use state and other features (useState, useEffect).

**JSON (JavaScript Object Notation)**
A format for sending data. Example: `{"name": "Gundam", "level": 5}`

**JWT (JSON Web Token)**
A secure way to transmit information about a user's session.

**Middleware**
Code that runs between receiving a request and sending a response.

**ORM (Object-Relational Mapping)**
A tool that lets you work with databases using your programming language (Prisma).

**Props**
Data passed from parent to child component.

**Redux**
A state management library (shared data store).

**Route**
A URL path (like `/cards` or `/decks`).

**Server**
A computer that hosts the application.

**State**
Data that can change over time (like a counter or form input).

**TypeScript**
JavaScript with type checking (catches bugs early).

### npm Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server
npm run dev:full         # Start Docker + dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:seed          # Add sample data
npm run db:studio        # Open database GUI
npm run db:reset         # Reset database (destructive!)

# Code Quality
npm run lint             # Check code style
npm run lint:fix         # Auto-fix style issues
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted

# Testing
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Docker
npm run docker:dev       # Start PostgreSQL + Redis
npm run docker:down      # Stop services

# Quality Checks
npm run check            # Run all checks (type, lint, test)
npm run precommit        # Run before committing
```

### Database Schema Quick Reference

```
┌─────────┐       ┌──────────────┐       ┌─────────┐
│  User   │──────<│  Collection  │>──────│  Card   │
└────┬────┘       └──────────────┘       └────┬────┘
     │                                         │
     │            ┌──────────┐                 │
     └───────────<│   Deck   │>────────────────┘
                  └──────────┘

User (1) → (many) Deck
User (1) → (1) Collection
Collection (many) ← (many) Card [via CollectionCard]
Deck (many) ← (many) Card [via DeckCard]
```

### API Endpoints Quick Reference

```
GET    /api/cards              # List/search cards
POST   /api/cards              # Create card (admin)
GET    /api/cards/:id          # Get single card
PUT    /api/cards/:id          # Update card (admin)
DELETE /api/cards/:id          # Delete card (admin)

GET    /api/decks              # List user's decks
POST   /api/decks              # Create deck
GET    /api/decks/:id          # Get deck
PUT    /api/decks/:id          # Update deck
DELETE /api/decks/:id          # Delete deck

GET    /api/collections        # Get collection
POST   /api/collections        # Update collection
POST   /api/collections/import # Bulk import
GET    /api/collections/export # Export data

GET    /api/auth/session       # Get session
POST   /api/auth/signup        # Create account
POST   /api/auth/signin        # Login
POST   /api/auth/signout       # Logout
```

### Component Library Catalog

**UI Components** (`src/components/ui/`)
- `Button.tsx` - Clickable button with variants
- `Card.tsx` - Container component
- `Modal.tsx` - Dialog/modal
- `Input.tsx` - Text input field
- `Select.tsx` - Dropdown select
- `Badge.tsx` - Status badge
- `Spinner.tsx` - Loading indicator
- `Toast.tsx` - Notification
- `Pagination.tsx` - Page navigation

**Feature Components** (`src/components/[feature]/`)
- `CardGrid.tsx` - Grid of cards
- `CardDetail.tsx` - Card details modal
- `CardSearch.tsx` - Search interface
- `DeckBuilder.tsx` - Deck building UI
- `DeckList.tsx` - List of decks
- `CollectionManager.tsx` - Collection tracking
- `Navbar.tsx` - Top navigation
- `MobileMenu.tsx` - Mobile navigation

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Port 3000 is already in use"

**Cause:** Another process is using port 3000

**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev
```

#### Issue: "Cannot connect to PostgreSQL"

**Cause:** Docker isn't running or PostgreSQL container is stopped

**Solution:**
```bash
# Check Docker Desktop is running
# Then restart services
npm run docker:down
npm run docker:dev

# Wait 10 seconds for startup
npm run dev
```

#### Issue: "Prisma Client not found"

**Cause:** Prisma client needs to be regenerated

**Solution:**
```bash
npm run db:generate
```

#### Issue: "Module not found: Can't resolve '@/...'"

**Cause:** TypeScript path aliases not recognized

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or restart dev server
npm run dev
```

#### Issue: "Session not working / User logged out unexpectedly"

**Cause:** Redis not running or session expired

**Solution:**
```bash
# Restart Redis
npm run docker:down
npm run docker:dev

# Check NEXTAUTH_SECRET is set in .env
```

#### Issue: "Build fails with type errors"

**Cause:** TypeScript compilation errors

**Solution:**
```bash
# Check for errors
npm run type-check

# Look at the error messages and fix the files
# Common issues:
# - Missing types
# - Incorrect prop types
# - Missing imports
```

#### Issue: "CSS not updating"

**Cause:** Browser cache or build cache

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Hard refresh browser (Cmd+Shift+R)
# Restart dev server
npm run dev
```

### Reading Error Messages

#### Example: Type Error

```
Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.

src/components/CardGrid.tsx:42:15
  <Card name={card.name} />
               ^^^^^^^^^
```

**What it means:**
- `card.name` might be `undefined`
- The `Card` component expects `name` to always be a string

**How to fix:**
```typescript
// Option 1: Provide default value
<Card name={card.name || 'Unknown'} />

// Option 2: Check if exists
{card.name && <Card name={card.name} />}

// Option 3: Make prop optional
interface CardProps {
  name?: string;  // Add ? to make optional
}
```

#### Example: API Error

```
POST /api/decks 400 in 50ms
{
  "error": "Validation failed",
  "details": "Name is required"
}
```

**What it means:**
- The API rejected your request (400 = bad request)
- The deck name was missing

**How to fix:**
```typescript
// Make sure to include required fields
const response = await fetch('/api/decks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Deck',  // Include this!
    description: 'Optional description'
  })
});
```

### Getting Help

#### Documentation Resources

1. **This Guide** - For beginners
2. **docs/ARCHITECTURE.md** - How the app works at runtime
3. **docs/DEVELOPER_GUIDE.md** - Development workflows
4. **docs/API_REFERENCE.md** - API documentation

#### External Resources

**Next.js:**
- Official docs: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn

**React:**
- Official docs: https://react.dev
- React tutorial: https://react.dev/learn

**TypeScript:**
- Official docs: https://www.typescriptlang.org/docs
- TypeScript for JS programmers: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

**Tailwind CSS:**
- Official docs: https://tailwindcss.com/docs
- Playground: https://play.tailwindcss.com

**Prisma:**
- Official docs: https://www.prisma.io/docs
- Database guide: https://www.prisma.io/docs/guides

#### Community Support

- **Stack Overflow** - Search for "[next.js] your question"
- **Reddit** - r/nextjs, r/reactjs
- **Discord** - Reactiflux (https://discord.gg/reactiflux)

---

## Conclusion

Congratulations! You now have a comprehensive understanding of the Gundam Card Game web application.

### What You've Learned

✅ What a web application is and how it works
✅ The technology stack and why each piece matters
✅ How to set up and run the application
✅ The file structure and organization
✅ How data flows from database to user interface
✅ How to perform daily administration tasks
✅ How to make updates and changes
✅ How key features work (search, deck builder, collections)
✅ How to troubleshoot common issues

### Next Steps

1. **Experiment!** The best way to learn is by trying things out
2. **Read the code** Start with simple components and work your way up
3. **Make small changes** Try changing colors, text, or layouts
4. **Break things** Don't be afraid to break things—that's how you learn!
5. **Use the other docs** Dive deeper with ARCHITECTURE.md and DEVELOPER_GUIDE.md

### Remember

- **Google is your friend** - Every developer searches for help constantly
- **Errors are normal** - They're not failures, they're learning opportunities
- **Take breaks** - If stuck for more than 30 minutes, step away and come back
- **Ask questions** - No question is too basic
- **Have fun!** Building web applications is creative and rewarding

Happy coding! 🚀