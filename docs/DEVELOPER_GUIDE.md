# Developer Guide

> Complete development workflow, environment setup, component library, and code quality standards for the Gundam Card Game website.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Environment Configuration](#environment-configuration)
4. [Component Library](#component-library)
5. [Code Quality Standards](#code-quality-standards)
6. [OAuth Integration](#oauth-integration)
7. [Development Workflow](#development-workflow)
8. [Testing & Debugging](#testing--debugging)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (for PostgreSQL and Redis)
- Git

### Initial Setup

```bash
# Clone and setup
git clone <repository-url>
cd gundam-card-game

# Complete setup (installs dependencies, creates .env, starts databases)
npm run setup:full

# Start development server
npm run dev

# Open browser
# → http://localhost:3000
```

### Available Commands

```bash
# Development
npm run dev              # Start Next.js dev server with Turbopack
npm run dev:full         # Start Docker + Next.js
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:reset         # Reset database (destructive)
npm run db:seed          # Seed with sample data
npm run db:studio        # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npm run check            # Run type-check, lint, and tests
npm run precommit        # Run all pre-commit checks

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI/CD

# Docker
npm run docker:dev       # Start PostgreSQL & Redis
npm run docker:down      # Stop Docker services

# Environment
npm run env:create       # Create .env from template
npm run env:validate     # Validate environment config
npm run env:secrets      # Generate secure secrets
```

---

## Architecture Overview

### Technology Stack

**Frontend:**

- Next.js 16 with App Router
- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling

**Backend:**

- Next.js API routes
- Prisma ORM
- PostgreSQL database
- Redis for caching/sessions

**Development:**

- Jest & React Testing Library
- Docker Compose
- ESLint & Prettier
- Husky for Git hooks

### File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   │   ├── cards/         # Card CRUD operations
│   │   ├── decks/         # Deck management
│   │   ├── collections/   # Collection tracking
│   │   └── auth/          # Authentication
│   ├── cards/             # Card pages
│   ├── decks/             # Deck builder pages
│   ├── collection/        # Collection management
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── navigation/       # Navigation components
│   ├── card/             # Card-specific components
│   ├── deck/             # Deck-specific components
│   └── auth/             # Authentication components
├── lib/                  # Utility libraries
│   ├── api/             # API utilities
│   ├── config/          # Configuration
│   ├── database/        # Database client
│   ├── storage/         # File storage
│   ├── types/           # Type definitions
│   └── utils/           # General utilities
├── store/               # Redux store
│   └── slices/          # Redux slices
└── hooks/               # Custom React hooks

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seed script
```

### Request Flow

**Page Request:**

```
Browser → Next.js → Page Component → Prisma → PostgreSQL → Back to User
```

**API Request:**

```
Browser → Next.js API Route → Validation → Prisma → PostgreSQL → JSON Response
```

**Authentication:**

```
User Login → NextAuth → Check Database → Create Session → Store in Redis → Return Cookie
```

---

## Environment Configuration

### Quick Start

```bash
# Copy template
cp .env.example .env

# Generate secrets
npm run env:secrets

# Validate configuration
npm run env:validate
```

### Required Variables

| Variable          | Description                        | Example                                    |
| ----------------- | ---------------------------------- | ------------------------------------------ |
| `DATABASE_URL`    | PostgreSQL connection              | `postgresql://user:pass@localhost:5432/db` |
| `REDIS_URL`       | Redis connection                   | `redis://localhost:6379`                   |
| `NEXTAUTH_URL`    | Application base URL               | `http://localhost:3000`                    |
| `NEXTAUTH_SECRET` | JWT secret (generate with openssl) | `your-secret-key`                          |

### Optional Variables

#### Application Settings

- `NODE_ENV` - Environment mode (`development`, `production`, `test`)
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `NEXT_PUBLIC_APP_NAME` - Application name

#### Database

- `DATABASE_POOL_MIN` - Minimum connection pool size (default: 2)
- `DATABASE_POOL_MAX` - Maximum connection pool size (default: 10)

#### File Storage

**Local Development:**

- `UPLOAD_DIR` - Upload directory (default: `./uploads`)

**Production Options:**

- `VERCEL_BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `CLOUDINARY_URL` - Cloudinary connection string
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` - AWS S3

#### Email (Production)

- `EMAIL_SERVER_HOST` - SMTP server
- `EMAIL_SERVER_PORT` - SMTP port
- `EMAIL_SERVER_USER` - SMTP username
- `EMAIL_SERVER_PASSWORD` - SMTP password
- `EMAIL_FROM` - From address

#### OAuth Providers

**Google:**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (for UI visibility)

**Discord:**

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `NEXT_PUBLIC_DISCORD_CLIENT_ID` (for UI visibility)

**GitHub:**

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

#### Monitoring

- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics
- `SENTRY_DSN` - Sentry error tracking
- `SENTRY_ORG`, `SENTRY_PROJECT` - Sentry configuration

#### Security

- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)
- `SESSION_MAX_AGE` - Session duration (default: 30 days)
- `RATE_LIMIT_MAX` - Max requests per window (default: 100)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 15 min)

### Environment-Specific Setup

**Development:**

```bash
DATABASE_URL="postgresql://gundam_user:gundam_password@localhost:5432/gundam_card_game"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key"
```

**Production:**

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL="postgresql://user:pass@prod-db:5432/gundam_card_game"
REDIS_URL="redis://prod-redis:6379"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="production-secret-key"
```

**Testing:**

```bash
NODE_ENV=test
TEST_DATABASE_URL="postgresql://gundam_user:gundam_password@localhost:5432/gundam_card_game_test"
TEST_REDIS_URL="redis://localhost:6379/1"
```

### Security Best Practices

1. **Never commit `.env`** to version control
2. **Use strong secrets** - Generate with `openssl rand -base64 32`
3. **Rotate secrets regularly** in production
4. **Environment-specific values** for different deployments
5. **Limit CORS origins** to actual domains
6. **Secure database credentials** with limited permissions

---

## Component Library

### Design System

**Colors:**

- Purple theme: `#6b5a8a` (primary), `#1a1625` to `#2a1f3d` (gradients)
- Status colors: Success (#10b981), Warning (#f59e0b), Error (#ef4444)

**Typography:**

- Font: Inter (sans-serif)
- Sizes: xs (0.75rem) to 3xl (1.875rem)

**Spacing:**

- Scale: 1 (0.25rem) to 16 (4rem)

**Breakpoints:**

- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

### UI Components

#### Button

```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button isLoading>Loading</Button>
```

**Props:**

- `variant`: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'default' | 'lg'
- `disabled`, `isLoading`: boolean
- `onClick`: () => void

#### Input

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  placeholder="Enter email"
  type="email"
  error="Required field"
  helperText="We'll never share your email"
/>;
```

#### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

#### Modal

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>;
```

#### Badge

```tsx
import { Badge } from '@/components/ui';

<Badge variant="default">New</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

#### Spinner & Loading

```tsx
import { Spinner, LoadingOverlay, Skeleton } from '@/components/ui';

<Spinner size="md" />

<LoadingOverlay isLoading={isLoading}>
  <Content />
</LoadingOverlay>

<Skeleton lines={3} />
```

#### Toast

```tsx
import { Toast, ToastContainer } from '@/components/ui';

<ToastContainer position="top-right">
  <Toast type="success" message="Success!" onClose={() => {}} />
</ToastContainer>;
```

#### Select

```tsx
import { Select } from '@/components/ui';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

<Select
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Select..."
/>;
```

#### Pagination

```tsx
import { Pagination } from '@/components/ui';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  siblings={2}
/>;
```

#### Search

```tsx
import { Search } from '@/components/ui';

<Search
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}
  placeholder="Search..."
  debounceTime={300}
/>;
```

#### FileUpload

```tsx
import { FileUpload } from '@/components/ui';

<FileUpload
  onUpload={handleUpload}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  multiple={false}
/>;
```

### Navigation Components

```tsx
import { Navbar, MobileMenu, Breadcrumb } from '@/components/navigation';

<Navbar />
<MobileMenu />
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Cards', href: '/cards' },
]} />
```

### Creating New Components

1. **Create component file:**

```tsx
// src/components/ui/NewComponent.tsx
export interface NewComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  className,
  children,
}) => {
  return <div className={cn('base-styles', className)}>{children}</div>;
};
```

2. **Add to index:**

```tsx
// src/components/ui/index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
```

3. **Write tests:**

```tsx
// src/components/ui/NewComponent.test.tsx
import { render, screen } from '@/lib/test-utils';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  it('renders children', () => {
    render(<NewComponent>Test</NewComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Accessibility

All components follow WCAG AA standards:

- **Keyboard navigation** - All interactive elements accessible via keyboard
- **Screen reader support** - Proper ARIA labels and semantic HTML
- **Color contrast** - WCAG AA compliant combinations
- **Focus management** - Visible focus indicators

---

## Code Quality Standards

### File Size Limits

| File Type             | Maximum Lines | Purpose                |
| --------------------- | ------------- | ---------------------- |
| TypeScript/JavaScript | 300 lines     | General source files   |
| React Components      | 300 lines     | UI components          |
| Test Files            | 500 lines     | Unit/integration tests |
| Configuration         | No limit      | Config files           |

**Refactoring trigger**: Files approaching limits should be split into smaller modules.

### Code Complexity

| Metric                     | Limit | Description                    |
| -------------------------- | ----- | ------------------------------ |
| Cyclomatic Complexity      | 10    | Independent paths through code |
| Maximum Depth              | 4     | Nesting level                  |
| Maximum Parameters         | 4     | Function parameters            |
| Maximum Statements         | 20    | Statements per function        |
| Maximum Lines per Function | 50    | Lines per function             |

### Code Style

**TypeScript/JavaScript:**

- Indentation: 2 spaces
- Quotes: Single quotes
- Semicolons: Always
- Line length: 100 characters max
- Trailing commas: ES5 style

**Import Organization:**

```typescript
// 1. Node modules
import React from 'react';
import { NextRequest } from 'next/server';

// 2. Internal (absolute imports with @/)
import { Button } from '@/components/ui';
import { prisma } from '@/lib/database';

// 3. Relative imports
import { Component } from './Component';
import { types } from './types';
```

**Naming Conventions:**

- Files: `kebab-case.tsx` (components: `PascalCase.tsx`)
- Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
- Components: `PascalCase`

### Quality Tools

**ESLint Rules:**

- `no-console` - Warn on console.log
- `no-debugger` - Error on debugger
- `@typescript-eslint/no-unused-vars` - Error on unused vars
- `@typescript-eslint/no-explicit-any` - Warn on any type
- `react/jsx-key` - Require keys in lists

**Prettier Configuration:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**File Size Monitoring:**

```bash
# Check file sizes
npm run check:sizes

# Detailed report
node scripts/check-file-sizes.js --check
```

### Pre-commit Hooks

Automatically run before each commit:

1. Type checking (`npm run type-check`)
2. Linting (`npm run lint`)
3. Formatting (`npm run format:check`)
4. File size validation
5. Tests (optional)

### Best Practices

#### Performance

```typescript
// ✅ Good - Memoized component
const ExpensiveComponent = React.memo(({ data }) => {
  const processed = useMemo(() => process(data), [data]);
  return <div>{processed}</div>;
});

// ❌ Bad - Unnecessary re-renders
const ExpensiveComponent = ({ data }) => {
  const processed = process(data);
  return <div>{processed}</div>;
};
```

#### Database Queries

```typescript
// ✅ Good - Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});

// ❌ Bad - Select all fields
const users = await prisma.user.findMany();
```

#### Security

```typescript
// ✅ Good - Validate input
const createUser = async (data: CreateUserData) => {
  const validated = userSchema.parse(data);
  return prisma.user.create({ data: validated });
};

// ❌ Bad - No validation
const createUser = async (data: any) => {
  return prisma.user.create({ data });
};
```

#### Error Handling

```typescript
// ✅ Good - Proper error handling
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Failed to fetch', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Quality Checks

**Manual Checklist:**

- [ ] Functionality works as expected
- [ ] Code follows project conventions
- [ ] No obvious performance issues
- [ ] No security vulnerabilities
- [ ] Adequate test coverage
- [ ] Code is well-documented
- [ ] Files within size limits
- [ ] No overly complex code

**Self-Review:**

- [ ] Run `npm run check` locally
- [ ] All tests pass
- [ ] File sizes within limits
- [ ] TypeScript types correct
- [ ] Remove console.log statements
- [ ] Add/update documentation
- [ ] Consider performance

---

## OAuth Integration

### Google OAuth Setup

1. **Create project in [Google Cloud Console](https://console.cloud.google.com/)**
2. **Configure OAuth consent screen:**
   - App name: "Gundam Card Game"
   - Scopes: `email`, `profile`
   - Authorized domains: Your domain
3. **Create credentials:**
   - Type: OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://your-domain.com/api/auth/callback/google` (prod)

### Discord OAuth Setup

1. **Create application in [Discord Developer Portal](https://discord.com/developers/applications)**
2. **Configure OAuth2:**
   - Copy Client ID and Secret
   - Add redirect URIs:
     - `http://localhost:3000/api/auth/callback/discord` (dev)
     - `https://your-domain.com/api/auth/callback/discord` (prod)
   - Scopes: `identify`, `email`

### Environment Configuration

```bash
# Server-side (required for functionality)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Client-side (for UI button visibility)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_DISCORD_CLIENT_ID="your-discord-client-id"
```

**Important:** Client secrets are never exposed to browser. Client IDs are public identifiers.

### Testing

**Development:**

1. Start server: `npm run dev`
2. Navigate to `/auth/signin`
3. Verify OAuth buttons appear
4. Test authentication flow

### Troubleshooting

**Buttons not appearing:**

- Check environment variables are set
- Verify `NEXT_PUBLIC_*` variables configured
- Restart server after env changes

**OAuth errors:**

- Verify redirect URIs match exactly
- Check client ID/secret are correct
- Ensure OAuth consent screen configured

### Security

1. **Never commit secrets** - Use `.env` and `.gitignore`
2. **Rotate secrets regularly** - Update OAuth credentials periodically
3. **Limit redirect URIs** - Only add necessary URLs
4. **Use HTTPS** - Always use HTTPS in production

---

## Development Workflow

### Making Changes

1. **Create feature branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Make changes:**

- Follow existing patterns
- Write tests for new functionality
- Update documentation

3. **Test changes:**

```bash
npm run check  # Type-check, lint, and tests
```

4. **Commit changes:**

```bash
git add .
git commit -m "feat: add your feature description"
```

### Commit Message Format

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tool changes

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation
- `refactor/refactoring-description` - Refactoring

### Pull Request Process

1. Create feature branch
2. Make changes and test
3. Create PR with clear description
4. Request code review
5. Address feedback
6. Merge after approval

### Database Changes

1. **Modify schema:**

```prisma
// prisma/schema.prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Create migration:**

```bash
npm run db:migrate
```

3. **Generate Prisma client:**

```bash
npm run db:generate
```

### API Development

1. **Create route file:**

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = { message: 'Hello' };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

2. **Write tests:**

```typescript
// src/app/api/example/route.test.ts
import { GET } from './route';

describe('/api/example', () => {
  it('returns success', async () => {
    const response = await GET(new Request('http://localhost/api/example'));
    expect(response.status).toBe(200);
  });
});
```

---

## Testing & Debugging

### Testing Strategy

**Unit Tests:**

- Test individual functions/utilities
- Mock external dependencies
- Focus on business logic

**Component Tests:**

- Test React components in isolation
- Use React Testing Library
- Test user interactions

**Integration Tests:**

- Test API endpoints
- Test database interactions
- Test component integration

### Writing Tests

```typescript
import { render, screen, userEvent } from '@/lib/test-utils';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click');
  });

  it('handles clicks', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('is accessible', async () => {
    const { container } = render(<Button>Click</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Specific test
npm test -- Button.test.tsx

# Verbose output
npm test -- --verbose
```

### Debugging Tools

**React Developer Tools:**

- Component hierarchy inspection
- Props and state examination
- Performance profiling

**Redux DevTools:**

- Action tracking
- State inspection
- Time-travel debugging

**Prisma Studio:**

- Visual database browser
- Data editing
- Query testing

```bash
# Open Prisma Studio
npm run db:studio
# → http://localhost:5555
```

**Next.js DevTools:**

- Performance monitoring
- Route inspection
- API route debugging

### Common Issues

**Database Connection:**

```bash
# Check Docker services
docker ps

# Restart services
npm run docker:dev

# Verify connection
npm run db:studio
```

**Build Issues:**

```bash
# Clear cache
rm -rf .next
npm run build

# Check TypeScript
npm run type-check

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Test Failures:**

```bash
# Run specific test
npm test -- Button.test.tsx

# Debug test
npm test -- --verbose Button.test.tsx

# Clear Jest cache
npm test -- --clearCache
```

**Port Conflicts:**

```bash
# Port 3000 in use
lsof -ti:3000 | xargs kill

# Restart
npm run dev
```

### Performance Optimization

**Frontend:**

- Use `React.memo` for expensive components
- Implement code splitting
- Optimize images with `next/image`
- Use proper caching strategies

**Backend:**

- Optimize database queries
- Use Redis for caching
- Minimize API response sizes
- Implement pagination

**Build:**

- Analyze bundle size
- Enable compression
- Use production builds
- Optimize assets

### IDE Configuration

**VS Code Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

**Recommended Extensions:**

- ESLint
- Prettier
- TypeScript Importer
- Tailwind CSS IntelliSense
- GitLens
- Auto Rename Tag

---

## Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Testing Library](https://testing-library.com/react)

### Tools

- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Prisma Studio](https://www.prisma.io/studio)

### Community

- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)
- [React Community](https://react.dev/community)

---

## Need Help?

1. **Check documentation** - This guide and related docs
2. **Run quality checks** - Use provided scripts
3. **Review examples** - Look at existing code
4. **Ask the team** - Reach out for help
5. **See ARCHITECTURE.md** - Understanding runtime flow
6. **See API_REFERENCE.md** - API and database reference
7. **See DEPLOYMENT.md** - Production deployment
