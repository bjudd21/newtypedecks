# Gundam Card Game Database

[![Build Status](https://github.com/bjudd21/newtypedecks/actions/workflows/quality-checks.yml/badge.svg)](https://github.com/bjudd21/newtypedecks/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Next.js Version](https://img.shields.io/badge/next.js-16.0.3-black)](https://nextjs.org)
[![Dependencies Status](https://img.shields.io/badge/dependencies-up%20to%20date-success)](docs/DEPENDENCIES.md)
[![Security](https://img.shields.io/badge/security-0%20vulnerabilities-success)](docs/DEPENDENCIES.md)

A comprehensive website for the Gundam Card Game, combining card database functionality with deck building and collection management features. Built with Next.js 16, React 19, and TypeScript for a modern, type-safe development experience.

## ✨ Features

### Card Database

- 🔍 **Advanced Search & Filtering** - Search by name, type, rarity, cost, faction, series, and more
- 📊 **Detailed Card Information** - View comprehensive card stats, abilities, rulings, and metadata
- 🖼️ **High-Quality Card Images** - Optimized image delivery with multiple size variants
- 📱 **Mobile-Responsive Design** - Seamless experience across all devices

### Deck Building

- 🎴 **Drag-and-Drop Interface** - Intuitive deck construction with visual feedback
- ✅ **Real-Time Validation** - Instant deck legality checking with detailed error messages
- 📈 **Deck Analytics** - Cost curves, type distribution, and meta-game insights
- 📋 **Multiple Export Formats** - JSON, Text, CSV, and other standard formats
- 🔄 **Version History** - Track deck changes and restore previous versions
- ⭐ **Favorites System** - Save and organize your favorite decks
- 📑 **Deck Templates** - Create and share deck templates with the community

### Collection Management

- 📦 **Collection Tracking** - Track owned cards with quantity management
- 📥 **Bulk Import** - Import collections from CSV, JSON, or text formats
- 📤 **Export Options** - Export your collection in multiple formats
- 📊 **Collection Statistics** - View completion rates and collection analytics
- 🔍 **Advanced Filtering** - Filter collection by any card attribute

### User Experience

- 👤 **User Authentication** - Secure signup, login, and email verification
- 🎨 **Dark Purple Theme** - Beautiful, consistent dark theme across the entire app
- 📱 **Progressive Web App** - Install on mobile devices for offline access
- ⚡ **Offline Support** - Continue browsing with service worker caching
- 🎯 **User Dashboard** - Centralized hub for all your decks and collections
- 📊 **Analytics Dashboard** - View meta-game trends and deck statistics

### Administration

- 🛠️ **Admin Panel** - Manage users and card database
- 👥 **User Management** - Admin and moderator user controls
- 🎴 **Card Management** - Add, edit, and organize card database

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher ([Download here](https://nodejs.org))
- **Docker** and Docker Compose ([Download here](https://www.docker.com/products/docker-desktop))
- **Git** ([Download here](https://git-scm.com/downloads))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bjudd21/newtypedecks.git
   cd newtypedecks
   ```

2. **Run the setup script**

   ```bash
   npm run setup
   ```

   This will:
   - Install dependencies
   - Create environment configuration
   - Generate Prisma client
   - Start Docker services (PostgreSQL & Redis)

3. **Set up the database**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### ⚠️ Environment Variables Security Warning

**IMPORTANT**: Never commit your `.env` file with real credentials to version control!

The `.env.example` file contains safe placeholder values. When you run `npm run env:create`, a `.env` file is created with these placeholders. You must replace them with your actual credentials for development or production.

**Protected files** (already in `.gitignore`):

- `.env`
- `.env.local`
- `.env.production`
- `.env.development.local`

## 📋 Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run dev:full` - Start Docker services and development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:reset` - Reset database (⚠️ destructive)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Docker

- `npm run docker:dev` - Start Docker services (PostgreSQL & Redis)
- `npm run docker:down` - Stop Docker services

### Environment

- `npm run env:create` - Create .env file from template
- `npm run env:validate` - Validate environment configuration
- `npm run env:secrets` - Generate secure secrets

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ci` - Run tests for CI/CD

### Utilities

- `npm run clean` - Clean build cache
- `npm run clean:all` - Clean build cache and uploads
- `npm run check` - Run all checks (type, lint, test)
- `npm run precommit` - Run pre-commit checks

### Setup Scripts

- `npm run setup` - Basic setup (install, env, db, docker)
- `npm run setup:full` - Full setup with database seeding

## 🏗️ Project Structure

```
newtypedecks/
├── docs/                    # Comprehensive documentation
│   ├── ARCHITECTURE.md      # System architecture and runtime
│   ├── API_REFERENCE.md     # API endpoints and database schema
│   ├── DEVELOPER_GUIDE.md   # Development workflow and standards
│   ├── DEPLOYMENT.md        # Production deployment guide
│   └── BEGINNERS_GUIDE.md   # Getting started guide
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── cards/          # Card pages
│   │   ├── decks/          # Deck pages
│   │   ├── collection/     # Collection pages
│   │   ├── auth/           # Authentication pages
│   │   ├── profile/        # User profile pages
│   │   ├── analytics/      # Analytics dashboard
│   │   └── admin/          # Admin panel
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── navigation/    # Navigation components
│   │   ├── layout/        # Layout components
│   │   ├── deck/          # Deck-related components
│   │   ├── collection/    # Collection components
│   │   └── analytics/     # Analytics components
│   ├── lib/               # Utility libraries
│   │   ├── api/          # API utilities
│   │   ├── config/       # Configuration
│   │   ├── database/     # Database utilities
│   │   ├── storage/      # File storage utilities
│   │   ├── services/     # Business logic services
│   │   └── utils/        # General utilities
│   └── store/            # Redux store and slices
│       └── slices/       # Redux slices (auth, cards, decks, collections, ui)
├── uploads/               # Local file storage (development)
├── docker-compose.yml     # Docker services
├── Dockerfile            # Docker configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Technology Stack

> **Note**: For the most up-to-date version information, see [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md).

### Frontend

- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library with latest features
- **TypeScript 5.9.3** - Type safety and developer experience
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Redux Toolkit 2.10.1** - Predictable state management
- **Framer Motion 12.23.24** - Animation library for microinteractions

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.19.0** - Type-safe database ORM
- **PostgreSQL** - Primary relational database
- **Redis 5.9.0** - Caching and session storage
- **NextAuth 4.24.13** - Authentication solution

### Development

- **Docker** - Containerized development environment
- **ESLint 9.39.1** - Code linting with strict rules
- **Prettier 3.6.2** - Opinionated code formatting
- **Jest 30.2.0** - Testing framework
- **React Testing Library 16.3.0** - Component testing
- **Husky 9.1.7** - Git hooks for quality checks

### File Storage & Processing

- **Sharp 0.34.5** - High-performance image processing
- **Local storage** - Development file storage
- **Cloud storage ready** - Compatible with Vercel Blob, Cloudinary, AWS S3

### Monitoring & Analytics

- **Sentry 10.24.0** - Error tracking and performance monitoring
- **Web Vitals 5.1.0** - Real user monitoring metrics

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes:

### Core Entities

- **Users** - User accounts, authentication, and profiles
- **Cards** - Complete card database with official attributes
- **Decks** - User-created decks with versioning
- **Collections** - Personal card collection tracking
- **DeckCards** - Many-to-many relationship between decks and cards

### Reference Data

- **CardTypes** - Mobile Suit, Character, Command, etc.
- **Rarities** - Common, Uncommon, Rare, Epic, Legendary
- **Sets** - Card sets and expansions
- **Factions** - Earth Federation, Zeon, etc.
- **Series** - Mobile Suit Gundam, Zeta Gundam, etc.

### Additional Features

- **CardRulings** - Official rulings and clarifications
- **DeckVersions** - Deck change history
- **Favorites** - User's favorite decks
- **CardSubmissions** - Community card submissions

For detailed schema documentation, see [API Reference](docs/API_REFERENCE.md).

## 🔧 Configuration

### Environment Variables

Key environment variables required for the application:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gundam_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (for verification)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@gundamcardgame.com"

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

**Generate secure secrets:**

```bash
npm run env:secrets
```

For complete environment setup, see [Developer Guide](docs/DEVELOPER_GUIDE.md).

### Docker Services

The project includes Docker Compose configuration for local development:

- **PostgreSQL** - Database server (port 5432)
- **Redis** - Cache and session store (port 6379)
- **Next.js App** - Application server (production profile)

Start services:

```bash
npm run docker:dev
```

Stop services:

```bash
npm run docker:down
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Test Coverage

Current test coverage includes:

- ✅ UI components (Button, Badge, Card, Input, etc.)
- ✅ Authentication API routes (signup, verify-email)
- ✅ Card search API
- 🚧 Collection management (in progress)
- 🚧 Deck operations (in progress)

### Test Structure

- **Unit tests** - Individual component and utility testing
- **Integration tests** - API endpoint testing with mocked dependencies
- **Component tests** - React component testing with React Testing Library

## 🚀 Deployment

### Development

1. Run `npm run setup:full`
2. Access at `http://localhost:3000`
3. PostgreSQL available at `localhost:5432`
4. Redis available at `localhost:6379`
5. Prisma Studio available via `npm run db:studio`

### Production

For detailed production deployment instructions, see [Deployment Guide](docs/DEPLOYMENT.md).

**Quick deployment checklist:**

1. Set production environment variables
2. Run database migrations: `npm run db:migrate:deploy`
3. Build the application: `npm run build`
4. Start the server: `npm run start`

### Platform-Specific Guides

- **Vercel** - One-click deployment with automatic CI/CD
- **Docker** - Containerized deployment with docker-compose
- **Kubernetes** - Scalable orchestration with provided manifests

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

Comprehensive documentation organized by topic:

- **[Architecture Guide](docs/ARCHITECTURE.md)** - How the system works, request flow, and runtime architecture
- **[API Reference](docs/API_REFERENCE.md)** - Complete API endpoints and database schema
- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Development workflow, coding standards, and best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment on various platforms
- **[Beginners Guide](docs/BEGINNERS_GUIDE.md)** - Getting started guide for new developers

### Quick Links

- **Setup Issues?** Check [Developer Guide - Troubleshooting](docs/DEVELOPER_GUIDE.md)
- **API Questions?** See [API Reference](docs/API_REFERENCE.md)
- **Deployment Help?** Review [Deployment Guide](docs/DEPLOYMENT.md)
- **New to the Project?** Start with [Beginners Guide](docs/BEGINNERS_GUIDE.md)

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

**Docker services not starting**

```bash
# Check Docker is running
docker ps
# Reset Docker services
npm run docker:down
npm run docker:dev
```

**Prisma client out of sync**

```bash
# Regenerate Prisma client
npm run db:generate
```

**Database migration errors**

```bash
# Reset database (⚠️ destructive)
npm run db:reset
# Or push schema directly
npm run db:push
```

**Module not found errors**

```bash
# Clear cache and reinstall
npm run clean
npm install
```

For more troubleshooting tips, see [Developer Guide](docs/DEVELOPER_GUIDE.md).

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- **Code Style** - Follow existing patterns, use ESLint and Prettier
- **Testing** - Write tests for new features and bug fixes
- **Documentation** - Update docs when changing functionality
- **Commits** - Use conventional commit messages (feat:, fix:, docs:, etc.)
- **Quality** - Ensure all checks pass: `npm run precommit`

### Code Review Process

1. All PRs require review before merging
2. CI/CD checks must pass (tests, linting, type checking)
3. Maintain or improve test coverage
4. Follow the project's coding standards
5. Update relevant documentation

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🎯 Roadmap

### Upcoming Features

- 🎨 Custom deck themes and backgrounds
- 🌐 Multi-language support (Japanese, English)
- 📊 Advanced deck statistics and win rate tracking
- 🏆 Tournament mode with Swiss pairings
- 👥 Social features (follow users, deck likes, comments)
- 🔔 Notifications for new cards and rulings
- 🎮 Play testing mode with virtual cards
- 📱 Native mobile apps (React Native)

### Recent Updates

See git commit history for recent changes. Major updates include:

- ✅ Dark purple theme consistency across all pages
- ✅ Comprehensive documentation suite
- ✅ Advanced collection import/export
- ✅ Deck analytics and meta-game insights
- ✅ PWA support with offline mode
- ✅ Email verification and password reset

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- Next.js - MIT License
- React - MIT License
- Prisma - Apache 2.0 License
- Tailwind CSS - MIT License

## 🙏 Acknowledgments

- **Bandai Namco Entertainment** - For the Gundam franchise and card game
- **Next.js Team** - For the excellent React framework
- **Prisma Team** - For the amazing database toolkit
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Vercel** - For hosting and deployment infrastructure
- **Community Contributors** - For bug reports, feature requests, and contributions

## 📞 Support

### Getting Help

- 📖 **Read the docs** - Check [documentation](docs/) first
- 🐛 **Report bugs** - Create an issue with detailed steps to reproduce
- 💡 **Request features** - Open an issue with your idea
- 💬 **Ask questions** - Use GitHub Discussions for Q&A
- 📧 **Contact** - Reach out via repository issues

### Useful Links

- [GitHub Repository](https://github.com/bjudd21/newtypedecks)
- [Issue Tracker](https://github.com/bjudd21/newtypedecks/issues)
- [Documentation](docs/)
- [Latest Releases](https://github.com/bjudd21/newtypedecks/releases)

---

## ⚖️ Legal Disclaimer

**Important**: This project is not affiliated with or endorsed by Bandai Namco Entertainment Inc. or Sunrise Inc.

All card images, artwork, and game content are copyright © Bandai Namco Entertainment Inc. and are used under fair use for educational and community purposes. The Gundam trademark and all associated properties are owned by Sunrise Inc.

This website is a fan-made project created to support the Gundam Card Game community. No copyright infringement is intended.

---

**Built with ❤️ by the Gundam Card Game community**

_Version 0.1.0 - Last Updated: January 2025_
