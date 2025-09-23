# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive Gundam Card Game website that combines card database functionality with deck building and collection management features. It's built with Next.js 15 and follows a mobile-first approach to serve both new players and competitive veterans.

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
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Run database migrations
npm run db:reset      # Reset database (destructive)
npm run db:seed       # Seed database with sample data
npm run db:studio     # Open Prisma Studio
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
npm run quality       # Run all checks including file size checks
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with typed hooks
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL with comprehensive card game schema
- **Caching**: Redis for sessions and performance
- **Testing**: Jest with React Testing Library
- **Development**: Docker Compose for local services

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (cards, decks, collections, auth)
│   ├── cards/             # Card-related pages
│   ├── decks/             # Deck building pages
│   └── collection/        # Collection management pages
├── components/            # React components
│   ├── ui/               # Reusable UI components (Button, Card, Modal, etc.)
│   ├── navigation/       # Navigation components (Navbar, Breadcrumb)
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── api/             # API utilities and validation
│   ├── config/          # Environment configuration
│   ├── database/        # Database utilities
│   ├── storage/         # File storage and image processing
│   ├── types/           # TypeScript type definitions
│   └── utils/           # General utilities
└── store/               # Redux store configuration
    └── slices/          # Redux slices (auth, cards, decks, collections, ui)
```

### Database Schema
The Prisma schema includes comprehensive models for:
- **Users**: Authentication and user management
- **Cards**: Complete Gundam Card Game data model with official attributes
- **Decks**: User-created deck builds with card relationships
- **Collections**: Personal card collection tracking
- **Card Types/Rarities/Sets**: Card categorization and metadata
- **Card Rulings**: Official rulings and clarifications

### Key Features
- Advanced card search and filtering system
- Drag-and-drop deck building interface
- Collection management with quantity tracking
- Mobile-responsive design optimized for all devices
- Image optimization with Sharp
- Comprehensive type safety with TypeScript

## Development Guidelines

### Code Quality Standards
- **Simple solutions preferred** - avoid overengineering
- **DRY principle** - check for existing functionality before duplicating
- **Environment awareness** - proper handling of dev/test/prod environments
- **File size limits** - refactor files over 200-300 lines
- **No mock data** in dev or prod environments (only in tests)
- **Clean, organized codebase** with consistent patterns

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Path aliases: `@/*` maps to `./src/*`
- Excludes test files from compilation
- Next.js plugin integration for optimal development experience

### Testing Strategy
- Jest with React Testing Library for component testing
- API route testing for backend endpoints
- Coverage thresholds: 20% lines, 10% functions/branches (early development)
- Test files: `*.test.{js,jsx,ts,tsx}` or `**/__tests__/**/*`

### State Management
Redux Toolkit store with five main slices:
- **auth**: User authentication and session management
- **cards**: Card data, search, and filtering
- **decks**: Deck building and management
- **collections**: Personal card collection tracking
- **ui**: Global UI state and preferences

### API Architecture
RESTful API using Next.js API routes:
- `/api/cards` - Card database operations
- `/api/decks` - Deck management
- `/api/collections` - Collection tracking
- `/api/auth` - User authentication
- `/api/upload` - File upload handling

### Image Processing
Sharp-based image processing with multiple size variants:
- Original, small, large, and thumbnail versions
- WebP format optimization for performance
- Local file storage for development
- Production-ready for cloud storage integration

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXTAUTH_URL` - Authentication base URL
- `NEXTAUTH_SECRET` - JWT secret key

### Development Setup
1. Run `npm run setup:full` for complete environment setup
2. Docker services (PostgreSQL, Redis) start automatically
3. Database migrations and seeding included
4. Local file storage configured in `uploads/` directory

## Component Library

### UI Components
All UI components follow consistent patterns:
- TypeScript interfaces for props
- Tailwind CSS for styling
- Accessibility considerations
- Test coverage with React Testing Library

Key components include:
- **Button, Card, Modal** - Core UI elements
- **Search, Select, Pagination** - Interactive components
- **FileUpload, Badge, Toast** - Specialized functionality
- **Spinner** - Loading states

### Navigation Components
- **Navbar** - Main navigation with mobile responsiveness
- **MobileMenu** - Mobile-optimized navigation
- **Breadcrumb** - Page navigation context

## Performance Considerations

### Build Optimization
- Turbopack integration for faster development builds
- Static generation for card database pages
- Image optimization with next/image
- Bundle analysis available with `npm run build:analyze`

### Database Performance
- Comprehensive indexing on searchable fields
- Efficient query patterns with Prisma
- Redis caching for frequent operations
- Optimized card search with proper filtering

## Legal and Compliance

This project includes proper attribution and disclaimers for Bandai Namco Entertainment copyrighted material. All card images and game content are used under fair use for educational and community purposes.

## Development Workflow

### Before Committing
1. Run `npm run precommit` to ensure code quality
2. Verify all tests pass with `npm run test:ci`
3. Check TypeScript compilation with `npm run type-check`
4. Ensure proper formatting with `npm run format:check`

### Environment Protection
- Never overwrite `.env` files without explicit confirmation
- Use environment-specific configurations properly
- Validate environment variables before deployment

### Task Management
When implementing features from the PRD (Product Requirements Document), follow the task management guidelines in `cursorrules/process-task-list.md` for proper progress tracking and completion protocols.