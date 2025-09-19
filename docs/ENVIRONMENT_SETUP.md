# Environment Setup Guide

This guide explains how to set up environment variables for the Gundam Card Game website in different environments.

## Quick Start

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` for your environment
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Required Variables

These variables are required for the application to function:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |

### Application Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` | No |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Gundam Card Game Database` | No |

### Database Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `DATABASE_POOL_MIN` | Minimum connection pool size | `2` | No |
| `DATABASE_POOL_MAX` | Maximum connection pool size | `10` | No |

### Redis Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Redis connection string | - | Yes |
| `REDIS_PASSWORD` | Redis password (if required) | - | No |

### Authentication (NextAuth.js)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXTAUTH_URL` | Base URL for authentication | - | Yes |
| `NEXTAUTH_SECRET` | Secret key for JWT tokens | - | Yes |

### File Storage

#### Local Development
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `UPLOAD_DIR` | Local upload directory | `./uploads` | No |

#### Production Options (choose one)

**Vercel Blob Storage:**
| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Yes |

**Cloudinary:**
| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_URL` | Cloudinary connection string | Yes |

**AWS S3:**
| Variable | Description | Required |
|----------|-------------|----------|
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_REGION` | AWS region | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |

### Email Configuration (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_SERVER_HOST` | SMTP server host | Yes |
| `EMAIL_SERVER_PORT` | SMTP server port | Yes |
| `EMAIL_SERVER_USER` | SMTP username | Yes |
| `EMAIL_SERVER_PASSWORD` | SMTP password | Yes |
| `EMAIL_FROM` | From email address | Yes |

### Social Login Providers (Optional)

#### Google OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |

#### Discord OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_CLIENT_ID` | Discord OAuth client ID | Yes |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret | Yes |

#### GitHub OAuth
| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Yes |

### Analytics and Monitoring (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics tracking ID | No |
| `SENTRY_DSN` | Sentry error tracking DSN | No |
| `SENTRY_ORG` | Sentry organization | No |
| `SENTRY_PROJECT` | Sentry project name | No |

### Security Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000,http://localhost:3001` | No |
| `SESSION_MAX_AGE` | Session maximum age in seconds | `2592000` (30 days) | No |
| `SESSION_UPDATE_AGE` | Session update age in seconds | `86400` (1 day) | No |
| `RATE_LIMIT_MAX` | Maximum requests per window | `100` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 minutes) | No |

### Development Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DEBUG` | Enable debug logging | `false` | No |
| `ENABLE_API_DOCS` | Enable API documentation | `true` | No |

### Testing Settings

| Variable | Description | Required |
|----------|-------------|----------|
| `TEST_DATABASE_URL` | Test database connection string | No |
| `TEST_REDIS_URL` | Test Redis connection string | No |

### Docker Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `COMPOSE_PROJECT_NAME` | Docker Compose project name | `gundam-card-game` | No |
| `DOCKER_NETWORK` | Docker network name | `gundam-network` | No |

## Environment-Specific Setup

### Development Environment

1. **Local Development with Docker:**
   ```bash
   # Start services
   docker-compose up -d postgres redis
   
   # Copy environment template
   cp .env.example .env
   
   # Update .env with local values
   DATABASE_URL="postgresql://gundam_user:gundam_password@localhost:5432/gundam_card_game"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-development-secret-key"
   ```

2. **Generate a secure secret:**
   ```bash
   openssl rand -base64 32
   ```

### Production Environment

1. **Set required variables:**
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   DATABASE_URL="postgresql://user:pass@prod-db:5432/gundam_card_game"
   REDIS_URL="redis://prod-redis:6379"
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-production-secret-key"
   ```

2. **Configure file storage** (choose one):
   - Vercel Blob: Set `VERCEL_BLOB_READ_WRITE_TOKEN`
   - Cloudinary: Set `CLOUDINARY_URL`
   - AWS S3: Set AWS credentials and bucket

3. **Configure email** (if needed):
   ```bash
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@your-domain.com"
   ```

### Testing Environment

1. **Set test-specific variables:**
   ```bash
   NODE_ENV=test
   TEST_DATABASE_URL="postgresql://gundam_user:gundam_password@localhost:5432/gundam_card_game_test"
   TEST_REDIS_URL="redis://localhost:6379/1"
   ```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for `NEXTAUTH_SECRET`
3. **Rotate secrets regularly** in production
4. **Use environment-specific values** for different deployments
5. **Limit CORS origins** to your actual domains
6. **Use secure database credentials** with limited permissions

## Troubleshooting

### Common Issues

1. **"Environment variable X is required but not set"**
   - Check that the variable is defined in your `.env` file
   - Ensure there are no typos in the variable name
   - Restart your development server after changes

2. **Database connection errors**
   - Verify `DATABASE_URL` format is correct
   - Ensure database server is running
   - Check network connectivity

3. **Redis connection errors**
   - Verify `REDIS_URL` format is correct
   - Ensure Redis server is running
   - Check Redis authentication if required

4. **Authentication errors**
   - Verify `NEXTAUTH_URL` matches your application URL
   - Ensure `NEXTAUTH_SECRET` is set and secure
   - Check OAuth provider configuration

### Validation

The application automatically validates required environment variables on startup. If any required variables are missing, you'll see an error message listing the missing variables.

## Environment Template

See `.env.example` for a complete template with all available environment variables and their descriptions.
