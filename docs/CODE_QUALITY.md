# Code Quality Standards

This document outlines the code quality standards, monitoring tools, and best practices for the Gundam Card Game website.

## Overview

Our code quality standards ensure:
- **Consistency** - Uniform code style across the project
- **Maintainability** - Code that's easy to understand and modify
- **Reliability** - Fewer bugs and better error handling
- **Performance** - Optimized code that runs efficiently
- **Security** - Secure coding practices and vulnerability prevention

## Quality Standards

### File Size Limits

To maintain code readability and maintainability, we enforce the following file size limits:

| File Type | Maximum Lines | Purpose |
|-----------|---------------|---------|
| TypeScript/JavaScript | 300 lines | General source files |
| React Components | 300 lines | UI components |
| Test Files | 500 lines | Unit and integration tests |
| Configuration Files | No limit | Build and config files |

**Why these limits?**
- **300 lines** - Optimal for code review and understanding
- **500 lines for tests** - Tests may need more setup and assertions
- **Refactoring trigger** - Files approaching limits should be refactored

### Code Complexity

We monitor code complexity using the following metrics:

| Metric | Limit | Description |
|--------|-------|-------------|
| Cyclomatic Complexity | 10 | Number of independent paths through code |
| Maximum Depth | 4 | Maximum nesting level |
| Maximum Parameters | 4 | Function parameter count |
| Maximum Statements | 20 | Statements per function |
| Maximum Lines per Function | 50 | Lines per function |

### Code Style

#### TypeScript/JavaScript
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always required
- **Line Length**: Maximum 100 characters
- **Trailing Commas**: ES5 style (objects, arrays)

#### React Components
- **Functional Components**: Use function declarations or arrow functions
- **Props Interface**: Always define TypeScript interfaces
- **Default Props**: Use default parameters instead of defaultProps
- **Event Handlers**: Use useCallback for performance optimization

#### Import Organization
```typescript
// 1. Node modules
import React from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. Internal modules (absolute imports)
import { Button } from '@/components/ui';
import { prisma } from '@/lib/database';

// 3. Relative imports
import { CardComponent } from './CardComponent';
import { CardProps } from './types';
```

## Quality Tools

### ESLint Configuration

Our ESLint configuration enforces:

#### Code Quality Rules
- `no-console` - Warn on console.log (allow console.warn, console.error)
- `no-debugger` - Error on debugger statements
- `no-var` - Require const/let instead of var
- `prefer-const` - Prefer const for variables that aren't reassigned

#### TypeScript Rules
- `@typescript-eslint/no-unused-vars` - Error on unused variables
- `@typescript-eslint/no-explicit-any` - Warn on any type usage
- `@typescript-eslint/prefer-nullish-coalescing` - Prefer ?? over ||
- `@typescript-eslint/consistent-type-imports` - Consistent import types

#### React Rules
- `react/jsx-key` - Require keys in lists
- `react/no-unescaped-entities` - Prevent unescaped entities
- `react/prop-types` - Disabled (using TypeScript)

#### Import Rules
- `import/order` - Enforce import order and grouping
- `import/no-duplicates` - Prevent duplicate imports

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### File Size Monitoring

We use a custom script to monitor file sizes:

```bash
# Check file sizes
npm run check:sizes

# Check with detailed report
node scripts/check-file-sizes.js --check
```

The script:
- Checks all source files against size limits
- Generates detailed reports
- Provides refactoring recommendations
- Integrates with CI/CD pipeline

## Quality Checks

### Pre-commit Hooks

Before each commit, we run:

1. **Type Checking** - `npm run type-check`
2. **Linting** - `npm run lint`
3. **Formatting** - `npm run format:check`
4. **File Size** - `node scripts/check-file-sizes.js --check`
5. **Tests** - `npm run test:ci` (optional)

### CI/CD Pipeline

Our GitHub Actions workflow includes:

#### Quality Checks Job
- TypeScript type checking
- ESLint code quality
- Prettier formatting
- File size monitoring
- Unit tests with coverage
- Application build

#### Security Audit Job
- npm audit for vulnerabilities
- Dependency review for PRs
- License compliance checking

#### Performance Check Job
- Bundle size analysis
- Performance regression detection
- Build optimization verification

### Manual Quality Checks

#### Code Review Checklist

Before merging code, reviewers should check:

- [ ] **Functionality** - Code works as expected
- [ ] **Style** - Follows project conventions
- [ ] **Performance** - No obvious performance issues
- [ ] **Security** - No security vulnerabilities
- [ ] **Tests** - Adequate test coverage
- [ ] **Documentation** - Code is well-documented
- [ ] **File Size** - Files are within size limits
- [ ] **Complexity** - Code is not overly complex

#### Self-Review Checklist

Before submitting code, developers should:

- [ ] Run `npm run check` locally
- [ ] Ensure all tests pass
- [ ] Check file sizes are within limits
- [ ] Verify TypeScript types are correct
- [ ] Remove console.log statements
- [ ] Add/update documentation
- [ ] Consider performance implications

## Best Practices

### Code Organization

#### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   └── navigation/     # Navigation components
├── lib/                # Utility libraries
│   ├── api/           # API utilities
│   ├── database/      # Database utilities
│   └── utils/         # General utilities
├── store/             # Redux store
└── app/               # Next.js app router
```

#### Component Organization
- **One component per file** - Keep components focused
- **Co-locate related files** - Keep tests and types nearby
- **Use index files** - For clean imports
- **Consistent naming** - PascalCase for components, camelCase for utilities

### Performance Best Practices

#### React Components
```typescript
// ✅ Good - Memoized component
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveProcessing(data), [data]
  );
  
  return <div>{processedData}</div>;
});

// ❌ Bad - Unnecessary re-renders
const ExpensiveComponent = ({ data }) => {
  const processedData = expensiveProcessing(data);
  return <div>{processedData}</div>;
};
```

#### Database Queries
```typescript
// ✅ Good - Specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Bad - All fields
const users = await prisma.user.findMany();
```

### Security Best Practices

#### Input Validation
```typescript
// ✅ Good - Validate input
const createUser = async (data: CreateUserData) => {
  const validatedData = userSchema.parse(data);
  return prisma.user.create({ data: validatedData });
};

// ❌ Bad - No validation
const createUser = async (data: any) => {
  return prisma.user.create({ data });
};
```

#### Environment Variables
```typescript
// ✅ Good - Use environment config
import { env } from '@/lib/config';

const apiUrl = env.NEXT_PUBLIC_API_URL;

// ❌ Bad - Direct process.env access
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Error Handling

#### API Routes
```typescript
// ✅ Good - Proper error handling
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return createSuccessResponse(data);
  } catch (error) {
    logger.error('Failed to fetch data', error);
    return createErrorResponse('Failed to fetch data', 500);
  }
}
```

#### React Components
```typescript
// ✅ Good - Error boundaries
const CardList = () => {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    return <ErrorFallback error={error} />;
  }
  
  return <div>...</div>;
};
```

## Monitoring and Metrics

### Quality Metrics

We track the following metrics:

#### Code Quality
- **ESLint violations** - Number of linting errors/warnings
- **TypeScript errors** - Type checking failures
- **Test coverage** - Percentage of code covered by tests
- **File size violations** - Files exceeding size limits

#### Performance Metrics
- **Bundle size** - Application bundle size
- **Build time** - Time to build the application
- **Test execution time** - Time to run all tests
- **Lighthouse scores** - Performance, accessibility, SEO

#### Security Metrics
- **Vulnerability count** - Known security vulnerabilities
- **Dependency updates** - Outdated dependencies
- **License compliance** - License compatibility issues

### Quality Gates

We enforce quality gates in our CI/CD pipeline:

#### Required (Blocking)
- All tests must pass
- No TypeScript errors
- No ESLint errors
- No file size violations
- No security vulnerabilities (high/critical)

#### Recommended (Warning)
- ESLint warnings should be minimal
- Test coverage should be > 80%
- Bundle size should be within limits
- Performance should meet benchmarks

## Tools and Scripts

### Available Scripts

```bash
# Quality checks
npm run check              # Run all quality checks
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run type-check         # TypeScript type checking
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting

# File size monitoring
npm run check:sizes        # Check file sizes
node scripts/check-file-sizes.js --check

# Pre-commit checks
npm run precommit          # Run pre-commit checks
node scripts/pre-commit.js

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run test:ci            # Run tests for CI
```

### IDE Configuration

#### VS Code Settings
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

#### Recommended Extensions
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Continuous Improvement

### Quality Reviews

We conduct regular quality reviews:

#### Weekly Reviews
- Review quality metrics
- Identify trends and issues
- Update quality standards
- Share best practices

#### Monthly Reviews
- Analyze quality trends
- Review tool effectiveness
- Update quality gates
- Plan improvements

### Quality Improvements

#### Process Improvements
- Automate more quality checks
- Improve error messages
- Enhance documentation
- Streamline workflows

#### Tool Improvements
- Update linting rules
- Enhance monitoring
- Improve reporting
- Add new quality checks

## Troubleshooting

### Common Issues

#### ESLint Errors
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npx eslint src/components/Button.tsx

# Disable rule for specific line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
```

#### TypeScript Errors
```bash
# Check types
npm run type-check

# Generate types
npm run db:generate

# Check specific file
npx tsc --noEmit src/components/Button.tsx
```

#### File Size Issues
```bash
# Check file sizes
npm run check:sizes

# Get detailed report
node scripts/check-file-sizes.js --check

# Refactor large files
# - Extract components
# - Split utilities
# - Use composition
```

#### Test Failures
```bash
# Run specific test
npm test -- Button.test.tsx

# Run tests in watch mode
npm run test:watch

# Debug test
npm test -- --verbose Button.test.tsx
```

### Getting Help

If you encounter quality issues:

1. **Check the documentation** - This guide and other docs
2. **Run quality checks** - Use the provided scripts
3. **Ask the team** - Reach out for help
4. **Review examples** - Look at existing code
5. **Update standards** - Suggest improvements

## Conclusion

Maintaining high code quality is essential for:
- **Developer productivity** - Easier to work with clean code
- **Bug prevention** - Fewer issues in production
- **Team collaboration** - Consistent standards
- **Long-term maintainability** - Code that ages well

By following these standards and using the provided tools, we ensure our codebase remains high-quality, maintainable, and efficient.
