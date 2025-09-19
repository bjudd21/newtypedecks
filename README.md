# Gundam Card Game Database

A comprehensive website for the Gundam Card Game, combining card database functionality with deck building and collection management features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gundam-card-game
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
gundam-card-game/
├── docs/                    # Documentation
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── cards/          # Card pages
│   │   ├── decks/          # Deck pages
│   │   └── collection/     # Collection pages
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── navigation/    # Navigation components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility libraries
│   │   ├── api/          # API utilities
│   │   ├── config/       # Configuration
│   │   ├── database/     # Database utilities
│   │   ├── storage/      # File storage utilities
│   │   └── utils/        # General utilities
│   └── store/            # Redux store and slices
├── uploads/               # Local file storage
├── docker-compose.yml     # Docker services
├── Dockerfile            # Docker configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### Development
- **Docker** - Containerized development environment
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

### File Storage
- **Sharp** - Image processing
- **Local storage** - Development file storage
- **Cloud storage ready** - Vercel Blob, Cloudinary, AWS S3

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User accounts and authentication
- **Cards** - Card database with types, rarities, and sets
- **Decks** - User-created decks
- **Collections** - User card collections
- **Card Types** - Mobile Suit, Character, Command, etc.
- **Rarities** - Common, Uncommon, Rare, Epic, Legendary
- **Sets** - Card sets and expansions

## 🔧 Configuration

### Environment Variables

See [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) for detailed configuration.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXTAUTH_URL` - Authentication base URL
- `NEXTAUTH_SECRET` - JWT secret key

### Docker Services

The project includes Docker Compose configuration for:
- **PostgreSQL** - Database server
- **Redis** - Cache and session store
- **Next.js App** - Application server (production profile)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Structure
- **Unit tests** - Individual component and utility testing
- **Integration tests** - API endpoint testing
- **Component tests** - React component testing with React Testing Library

## 🚀 Deployment

### Development
1. Run `npm run setup:full`
2. Access at `http://localhost:3000`

### Production
1. Set production environment variables
2. Run `npm run build`
3. Run `npm run start`

### Docker Production
```bash
docker-compose --profile production up -d
```

## 📚 Documentation

- [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) - Environment configuration
- [API Documentation](docs/API.md) - API endpoints and usage
- [Component Library](docs/COMPONENTS.md) - UI component documentation
- [Database Schema](docs/DATABASE.md) - Database design and relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all checks pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bandai Namco Entertainment for the Gundam franchise
- Next.js team for the excellent framework
- Prisma team for the database toolkit
- Tailwind CSS team for the utility framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Note**: This project is not affiliated with Bandai Namco Entertainment Inc. All card images and game content are used under fair use for educational and community purposes.