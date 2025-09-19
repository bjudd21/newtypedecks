# Deployment Guide

This guide covers deploying the Gundam Card Game website to various platforms and environments.

## Overview

The application is designed to be deployed on modern cloud platforms with the following architecture:

- **Frontend**: Next.js application with static and server-side rendering
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for sessions and caching
- **File Storage**: Cloud storage (Vercel Blob, Cloudinary, or AWS S3)
- **CDN**: Global content delivery network

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment option with built-in Next.js optimization.

#### Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   Set the following in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   REDIS_URL=redis://host:port
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   VERCEL_BLOB_READ_WRITE_TOKEN=your-blob-token
   ```

3. **Database Setup**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npm run db:migrate:deploy`

#### Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Railway

Railway provides a simple platform for full-stack applications.

#### Setup

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect Next.js

2. **Add Services**
   - **PostgreSQL**: Add PostgreSQL service
   - **Redis**: Add Redis service
   - **Web Service**: Your Next.js application

3. **Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Deploy**
   ```bash
   # Railway will auto-deploy on git push
   git push origin main
   ```

### 3. Docker Deployment

Deploy using Docker containers for maximum control.

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://gundam_user:gundam_password@postgres:5432/gundam_card_game
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: gundam_card_game
      POSTGRES_USER: gundam_user
      POSTGRES_PASSWORD: gundam_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npm run db:migrate:deploy

# Seed database
docker-compose exec app npm run db:seed
```

### 4. AWS Deployment

Deploy on AWS using various services.

#### Architecture

- **EC2**: Application server
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis cache
- **S3**: File storage
- **CloudFront**: CDN
- **Route 53**: DNS

#### Setup

1. **Launch EC2 Instance**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd gundam-card-game
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "gundam-card-game" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Configuration

### Production Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Gundam Card Game Database"

# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://host:port
REDIS_PASSWORD=your-redis-password

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-secret-key

# File Storage (choose one)
VERCEL_BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
# OR
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# OR
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Email (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=your-ga-tracking-id

# Security
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
DEBUG=true
ENABLE_API_DOCS=true
```

#### Staging
```bash
NODE_ENV=production
DEBUG=false
ENABLE_API_DOCS=true
```

#### Production
```bash
NODE_ENV=production
DEBUG=false
ENABLE_API_DOCS=false
```

## Database Setup

### Production Database

1. **Create Database**
   ```sql
   CREATE DATABASE gundam_card_game;
   CREATE USER gundam_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE gundam_card_game TO gundam_user;
   ```

2. **Run Migrations**
   ```bash
   npm run db:migrate:deploy
   ```

3. **Seed Initial Data**
   ```bash
   npm run db:seed
   ```

### Database Optimization

```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_cards_name ON cards(name);
CREATE INDEX CONCURRENTLY idx_cards_set_number ON cards(set_id, set_number);
CREATE INDEX CONCURRENTLY idx_decks_user_id ON decks(user_id);
CREATE INDEX CONCURRENTLY idx_collection_cards_collection_id ON collection_cards(collection_id);

-- Full-text search
CREATE INDEX CONCURRENTLY idx_cards_search ON cards USING gin(to_tsvector('english', name || ' ' || description));
```

## File Storage Setup

### Vercel Blob Storage

1. **Enable Blob Storage**
   ```bash
   vercel storage create blob
   ```

2. **Configure Environment**
   ```bash
   VERCEL_BLOB_READ_WRITE_TOKEN=your-token
   ```

### Cloudinary

1. **Create Account**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your cloud URL

2. **Configure Environment**
   ```bash
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```

### AWS S3

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure IAM User**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:GetObject",
           "s3:PutObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

3. **Configure Environment**
   ```bash
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (Recommended)

1. **Add Domain to Cloudflare**
2. **Update DNS Records**
3. **Enable SSL/TLS**
4. **Configure Security Settings**

## Monitoring and Logging

### Application Monitoring

#### Sentry (Error Tracking)

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **Environment Variables**
   ```bash
   SENTRY_DSN=your-sentry-dsn
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   ```

#### Logging

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Performance Monitoring

#### Google Analytics

```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

## Backup and Recovery

### Database Backups

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp ${BACKUP_FILE}.gz s3://your-backup-bucket/

# Cleanup old backups (keep 30 days)
find . -name "backup_*.sql.gz" -mtime +30 -delete
```

### File Storage Backups

```bash
# Backup uploaded files
aws s3 sync s3://your-bucket/uploads/ s3://your-backup-bucket/uploads/
```

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   gunzip backup_20240101_120000.sql.gz
   psql $DATABASE_URL < backup_20240101_120000.sql
   ```

2. **File Recovery**
   ```bash
   # Restore files from backup
   aws s3 sync s3://your-backup-bucket/uploads/ s3://your-bucket/uploads/
   ```

## Security Considerations

### Application Security

1. **Environment Variables**
   - Never commit secrets to version control
   - Use secure secret management
   - Rotate secrets regularly

2. **Authentication**
   - Use strong session secrets
   - Implement rate limiting
   - Use HTTPS only

3. **Database Security**
   - Use connection pooling
   - Implement proper access controls
   - Regular security updates

### Infrastructure Security

1. **Network Security**
   - Use VPC for AWS deployments
   - Configure security groups
   - Enable DDoS protection

2. **Access Control**
   - Use IAM roles and policies
   - Implement least privilege access
   - Enable MFA for admin accounts

## Performance Optimization

### Frontend Optimization

1. **Next.js Optimization**
   - Enable static generation where possible
   - Use image optimization
   - Implement proper caching

2. **CDN Configuration**
   - Cache static assets
   - Enable compression
   - Use HTTP/2

### Backend Optimization

1. **Database Optimization**
   - Use proper indexes
   - Optimize queries
   - Implement connection pooling

2. **Caching Strategy**
   - Use Redis for session storage
   - Cache frequently accessed data
   - Implement cache invalidation

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connectivity
   npm run db:generate
   npm run db:push
   ```

2. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm run build
   ```

3. **Environment Issues**
   ```bash
   # Validate environment
   npm run env:validate
   ```

### Debugging

1. **Enable Debug Logging**
   ```bash
   DEBUG=true npm run dev
   ```

2. **Check Logs**
   ```bash
   # Application logs
   tail -f logs/combined.log
   
   # Error logs
   tail -f logs/error.log
   ```

3. **Database Debugging**
   ```bash
   # Open Prisma Studio
   npm run db:studio
   ```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check application health
   - Review error logs
   - Monitor performance metrics

2. **Monthly**
   - Update dependencies
   - Review security patches
   - Backup verification

3. **Quarterly**
   - Security audit
   - Performance review
   - Disaster recovery testing

### Updates and Upgrades

1. **Dependency Updates**
   ```bash
   # Check for updates
   npm outdated
   
   # Update dependencies
   npm update
   
   # Test after updates
   npm run check
   ```

2. **Database Migrations**
   ```bash
   # Create migration
   npm run db:migrate
   
   # Deploy migration
   npm run db:migrate:deploy
   ```

3. **Application Updates**
   ```bash
   # Deploy new version
   git pull origin main
   npm ci
   npm run build
   npm run start
   ```
