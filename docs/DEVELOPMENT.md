# Development Guide

This guide provides detailed information for developers working on the Gundam Card Game website.

## 🏗️ Architecture Overview

The application follows a clean architecture pattern with clear separation of concerns:

### Frontend Architecture
- **Next.js App Router** - File-based routing with server and client components
- **React Components** - Reusable UI components with TypeScript
- **Redux Toolkit** - Centralized state management
- **Tailwind CSS** - Utility-first styling approach

### Backend Architecture
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database for structured data
- **Redis** - Caching and session storage

### File Organization
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API endpoints
│   ├── (pages)/        # Page components
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── layout/        # Layout components
│   └── navigation/    # Navigation components
├── lib/               # Utility libraries
│   ├── api/          # API utilities
│   ├── config/       # Configuration
│   ├── database/     # Database utilities
│   └── utils/        # General utilities
└── store/            # Redux store
    └── slices/       # Redux slices
```

## 🛠️ Development Workflow

### 1. Setting Up Development Environment

```bash
# Clone and setup
git clone <repository-url>
cd gundam-card-game
npm run setup:full

# Start development
npm run dev:full
```

### 2. Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code patterns
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run check  # Runs type-check, lint, and tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### 3. Code Quality Standards

#### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` types
- Use proper type guards and assertions

#### React Components
- Use functional components with hooks
- Implement proper prop types
- Follow the component composition pattern
- Use custom hooks for complex logic

#### Styling
- Use Tailwind CSS utility classes
- Follow the design system patterns
- Ensure responsive design
- Use CSS variables for theming

#### Testing
- Write unit tests for utilities and hooks
- Write component tests for UI components
- Write integration tests for API endpoints
- Maintain good test coverage

## 🧩 Component Development

### Creating New Components

1. **Create the component file**
   ```typescript
   // src/components/ui/NewComponent.tsx
   import React from 'react';
   import { cn } from '@/lib/utils';

   export interface NewComponentProps {
     className?: string;
     children: React.ReactNode;
   }

   export const NewComponent: React.FC<NewComponentProps> = ({
     className,
     children,
   }) => {
     return (
       <div className={cn('base-styles', className)}>
         {children}
       </div>
     );
   };
   ```

2. **Add to the index file**
   ```typescript
   // src/components/ui/index.ts
   export { NewComponent } from './NewComponent';
   export type { NewComponentProps } from './NewComponent';
   ```

3. **Write tests**
   ```typescript
   // src/components/ui/NewComponent.test.tsx
   import { render, screen } from '@/lib/test-utils';
   import { NewComponent } from './NewComponent';

   describe('NewComponent', () => {
     it('renders children correctly', () => {
       render(<NewComponent>Test content</NewComponent>);
       expect(screen.getByText('Test content')).toBeInTheDocument();
     });
   });
   ```

### Component Patterns

#### UI Components
- Use consistent prop interfaces
- Implement proper accessibility
- Support className merging
- Provide proper TypeScript types

#### Layout Components
- Use semantic HTML elements
- Implement responsive design
- Support different screen sizes
- Follow accessibility guidelines

#### Page Components
- Use Next.js App Router patterns
- Implement proper loading states
- Handle error boundaries
- Use server and client components appropriately

## 🗄️ Database Development

### Schema Changes

1. **Modify the Prisma schema**
   ```prisma
   // prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Create and run migration**
   ```bash
   npm run db:migrate
   ```

3. **Update the Prisma client**
   ```bash
   npm run db:generate
   ```

### Database Utilities

Use the centralized database utilities:

```typescript
import { prisma } from '@/lib/database';

// Example usage
const cards = await prisma.card.findMany({
  include: {
    type: true,
    rarity: true,
    set: true,
  },
});
```

## 🔌 API Development

### Creating API Routes

1. **Create the route file**
   ```typescript
   // src/app/api/example/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';

   export async function GET(request: NextRequest) {
     try {
       // Your logic here
       const data = { message: 'Hello World' };
       return createSuccessResponse(data);
     } catch (error) {
       return createErrorResponse('Operation failed', error.message);
     }
   }
   ```

2. **Write tests**
   ```typescript
   // src/app/api/example/route.test.ts
   import { GET } from './route';

   describe('/api/example', () => {
     it('should return success response', async () => {
       const response = await GET(new Request('http://localhost:3000/api/example'));
       expect(response.status).toBe(200);
     });
   });
   ```

### API Patterns

- Use consistent response formats
- Implement proper error handling
- Add input validation
- Use appropriate HTTP status codes
- Implement rate limiting where needed

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**
   - Test individual functions and utilities
   - Mock external dependencies
   - Focus on business logic

2. **Component Tests**
   - Test React components in isolation
   - Use React Testing Library
   - Test user interactions

3. **Integration Tests**
   - Test API endpoints
   - Test database interactions
   - Test component integration

### Testing Utilities

Use the custom test utilities:

```typescript
import { renderWithProviders, mockCard } from '@/lib/test-utils';

// Example component test
describe('CardComponent', () => {
  it('renders card information', () => {
    renderWithProviders(<CardComponent card={mockCard} />);
    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Frontend Optimization
- Use React.memo for expensive components
- Implement proper code splitting
- Optimize images with Next.js Image component
- Use proper caching strategies

### Backend Optimization
- Implement database query optimization
- Use Redis for caching
- Optimize API response sizes
- Implement proper pagination

### Build Optimization
- Use Next.js build optimization
- Implement proper bundle analysis
- Optimize asset loading
- Use proper compression

## 🐛 Debugging

### Development Tools
- **React Developer Tools** - Component debugging
- **Redux DevTools** - State management debugging
- **Prisma Studio** - Database inspection
- **Next.js DevTools** - Performance monitoring

### Common Issues

1. **Database Connection Issues**
   - Check Docker services are running
   - Verify environment variables
   - Check database migrations

2. **Build Issues**
   - Clear build cache: `npm run clean`
   - Check TypeScript errors
   - Verify all dependencies are installed

3. **Test Failures**
   - Check test environment setup
   - Verify mock data
   - Check test database configuration

## 📝 Code Style Guidelines

### Naming Conventions
- **Files**: kebab-case for files, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### Code Organization
- Group imports logically
- Use absolute imports with `@/` prefix
- Keep functions small and focused
- Use proper error handling

### Documentation
- Write clear comments for complex logic
- Document public APIs
- Keep README files updated
- Use JSDoc for functions

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/refactoring-description` - Code refactoring

### Commit Messages
Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

### Pull Request Process
1. Create feature branch
2. Make changes and test
3. Create pull request with clear description
4. Request code review
5. Address feedback
6. Merge after approval

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure database connections
3. Set up file storage
4. Configure monitoring

### Build Process
1. Run tests: `npm run test:ci`
2. Build application: `npm run build`
3. Deploy to production
4. Run database migrations: `npm run db:migrate:deploy`

### Monitoring
- Set up error tracking (Sentry)
- Monitor performance metrics
- Set up logging
- Monitor database performance

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

### Tools
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Prisma Studio](https://www.prisma.io/studio)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)
- [React Community](https://react.dev/community)
