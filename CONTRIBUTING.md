# Contributing to Gundam Card Game Database

Thank you for your interest in contributing to the Gundam Card Game Database! We welcome contributions from developers of all skill levels. This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive Behavior:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable Behavior:**

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by creating an issue or contacting the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18.0.0+** installed
- **npm 9.0.0+** installed
- **Docker and Docker Compose** installed
- **Git** installed and configured
- A **GitHub account**

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/newtypedecks.git
   cd newtypedecks
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/bjudd21/newtypedecks.git
   ```

4. **Run the setup**:

   ```bash
   npm run setup:full
   ```

5. **Verify the installation**:
   ```bash
   npm test
   npm run build
   ```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream main into your local main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch first
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Test your changes locally

### 3. Test Your Changes

Before submitting, ensure all checks pass:

```bash
# Run all quality checks
npm run check

# Run tests with coverage
npm run test:coverage

# Check TypeScript types
npm run type-check

# Run linting
npm run lint

# Check code formatting
npm run format:check
```

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new deck export format"
```

See [Commit Message Guidelines](#commit-message-guidelines) for details.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template with details
4. Submit the pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing or `unknown`
- Define interfaces for all component props
- Use type inference where appropriate

**Example:**

```typescript
// Good
interface CardProps {
  id: string;
  name: string;
  cost?: number;
}

export const Card: React.FC<CardProps> = ({ id, name, cost }) => {
  // ...
};

// Bad
export const Card = (props: any) => {
  // ...
};
```

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Extract complex logic into custom hooks
- Keep components focused and single-purpose

**Component Structure:**

```typescript
'use client'; // If client component

import React from 'react';
import { useCallback, useEffect } from 'react';

// Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // Hooks
  const [state, setState] = React.useState('');

  // Callbacks
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Render
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow the dark purple theme palette:
  - `#1a1625` - Darkest background
  - `#2d2640` - Card backgrounds
  - `#443a5c` - Borders
  - `#8b7aaa` - Primary purple
  - `#a89ec7` - Light purple
- Extract reusable component classes to UI components

### Code Organization

- Maximum file size: 300 lines (refactor if larger)
- Group related functionality together
- Use barrel exports (index.ts) for clean imports
- Separate concerns: logic, UI, types

### Naming Conventions

- **Components:** PascalCase (e.g., `CardGrid.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useCards.ts`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces:** PascalCase (e.g., `CardType`, `DeckData`)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

### Examples

```bash
# Simple feature
git commit -m "feat: add CSV export for decks"

# Bug fix with scope
git commit -m "fix(auth): resolve email verification token expiry"

# Breaking change
git commit -m "feat!: change card search API response format

BREAKING CHANGE: The search API now returns cards in a different structure.
Clients must update their response handling."

# Detailed commit
git commit -m "refactor(deck): extract validation logic to service

- Move deck validation from component to deckValidationService
- Add comprehensive unit tests for validation rules
- Improve error messages for invalid decks

Closes #123"
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all quality checks**:

   ```bash
   npm run precommit
   ```

3. **Test the build**:
   ```bash
   npm run build
   ```

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe testing performed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All checks passing
```

### Review Process

1. **Automated Checks:** CI/CD runs tests, linting, type checking
2. **Code Review:** Maintainers review code quality and design
3. **Feedback:** Address review comments and suggestions
4. **Approval:** Requires approval from at least one maintainer
5. **Merge:** Maintainer merges after approval

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "refactor: address PR feedback"
git push origin feature/your-feature-name
```

## Testing Requirements

### Test Coverage

- Aim for >80% code coverage on new code
- Write tests for all new features
- Update tests when modifying existing code
- Include both success and error cases

### Test Types

**Unit Tests:**

```typescript
// Component test
describe('CardGrid', () => {
  it('should render cards correctly', () => {
    const cards = [mockCard1, mockCard2];
    render(<CardGrid cards={cards} />);

    expect(screen.getByText(mockCard1.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard2.name)).toBeInTheDocument();
  });
});
```

**API Tests:**

```typescript
describe('POST /api/cards/search', () => {
  it('should return filtered cards', async () => {
    const response = await request(app)
      .post('/api/cards/search')
      .send({ name: 'Gundam' });

    expect(response.status).toBe(200);
    expect(response.body.cards).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- CardGrid.test.tsx

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Documentation

### When to Update Documentation

- Adding new features
- Changing existing functionality
- Fixing bugs that affect user behavior
- Adding new environment variables
- Modifying API endpoints

### Documentation Locations

- **README.md** - Project overview and quick start
- **docs/ARCHITECTURE.md** - System architecture
- **docs/API_REFERENCE.md** - API endpoints and database
- **docs/DEVELOPER_GUIDE.md** - Development workflow
- **docs/DEPLOYMENT.md** - Deployment instructions
- **Code Comments** - Complex logic explanations

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep docs up-to-date with code changes

## Issue Guidelines

### Creating Issues

**Bug Reports:**

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**

- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]
```

**Feature Requests:**

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## Community

### Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Q&A and general discussion
- **Documentation** - Check docs first
- **Code Review** - Ask questions in PR comments

### Recognition

Contributors are recognized in:

- GitHub contributors page
- Release notes for significant contributions
- README acknowledgments

### Communication

- Be respectful and constructive
- Stay on topic
- Help others when you can
- Ask questions when unclear

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to the Gundam Card Game Database!** Your efforts help make this project better for everyone in the community. 🎴
