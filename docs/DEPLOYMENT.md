# Production Deployment Guide

> Complete guide for deploying the Gundam Card Game website to production environments.

---

## Quick Deployment Checklist

Before deploying to production, ensure:

- [ ] **Environment variables** configured (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- [ ] **Database** set up (PostgreSQL with migrations applied)
- [ ] **Redis** configured (for sessions and caching)
- [ ] **Build successful** (`npm run build` completes without errors)
- [ ] **Tests passing** (`npm run test:ci` passes)
- [ ] **Domain** configured with DNS pointing to your server
- [ ] **SSL certificate** obtained (Let's Encrypt or purchased)
- [ ] **File storage** configured (local or cloud)
- [ ] **Email service** configured (for authentication emails)
- [ ] **Monitoring** set up (health checks, logging, error tracking)
- [ ] **Backups** automated (database and uploaded files)
- [ ] **Security** review complete (secrets, CORS, rate limiting)

---

## Platform Quick Starts

### Vercel (Fastest - Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Configure project
vercel

# Deploy to production
vercel --prod
```
**Time to deploy**: ~5 minutes
**Best for**: Simple deployments, automatic scaling, edge functions

### Docker (Self-Hosted)
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```
**Time to deploy**: ~15 minutes
**Best for**: Full control, custom infrastructure, multi-service setups

### Railway (Easy - One-Click)
```bash
# Connect GitHub repo, Railway handles the rest
# Configure env vars in Railway dashboard
```
**Time to deploy**: ~10 minutes
**Best for**: Quick prototypes, automatic deploys, simple setup

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Cloud Platform Deployment](#cloud-platform-deployment)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring and Health Checks](#monitoring-and-health-checks)
8. [Backup and Recovery](#backup-and-recovery)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (local or cloud-hosted)
- Redis instance (optional but recommended)
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

## Environment Configuration

### 1. Copy Production Environment Template

```bash
cp .env.production .env
```

### 2. Configure Required Environment Variables

Edit `.env` with your production values:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-very-long-random-secret-key-here"

# Email
SMTP_HOST="smtp.your-provider.com"
SMTP_USER="your-email@your-domain.com"
SMTP_PASS="your-email-password"
```

### 3. Generate Secure Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 24
```

## Docker Deployment

### Option 1: Quick Deployment Script

```bash
# Make deployment script executable
chmod +x scripts/deployment/deploy.sh

# Run deployment
./scripts/deployment/deploy.sh
```

### Option 2: Manual Docker Compose

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### 3. Verify Deployment

```bash
# Check application health
curl http://localhost:3000/api/health

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

## Kubernetes Deployment

### 1. Create Namespace and Secrets

```bash
# Apply namespace
kubectl apply -f k8s/namespace.yaml

# Update secrets with your values
vim k8s/secret.yaml

# Apply configuration
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
```

### 2. Deploy Database (if using in-cluster)

```bash
# Apply PostgreSQL deployment
kubectl apply -f k8s/postgres.yaml

# Apply Redis deployment
kubectl apply -f k8s/redis.yaml
```

### 3. Deploy Application

```bash
# Apply persistent volume claims
kubectl apply -f k8s/pvc.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Expose service
kubectl apply -f k8s/service.yaml

# Configure ingress
kubectl apply -f k8s/ingress.yaml
```

### 4. Verify Deployment

```bash
# Check pod status
kubectl get pods -n gundam-gcg

# Check service endpoints
kubectl get endpoints -n gundam-gcg

# View logs
kubectl logs -f deployment/gundam-gcg-app -n gundam-gcg
```

## Cloud Platform Deployment

### Vercel (Recommended for Next.js)

1. **Connect Repository**
   - Import project from GitHub/GitLab
   - Configure build settings

2. **Environment Variables**
   - Add all production environment variables
   - Use Vercel's secret management

3. **Database Setup**
   - Use Vercel Postgres or external database
   - Configure connection pooling

4. **Deploy**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### AWS ECS/Fargate

1. **Build and Push Image**
   ```bash
   # Build for production
   docker build -t gundam-gcg .

   # Tag for ECR
   docker tag gundam-gcg:latest 123456789012.dkr.ecr.region.amazonaws.com/gundam-gcg:latest

   # Push to ECR
   docker push 123456789012.dkr.ecr.region.amazonaws.com/gundam-gcg:latest
   ```

2. **Configure ECS Service**
   - Create task definition
   - Configure service with load balancer
   - Set up auto-scaling

### Google Cloud Run

1. **Deploy with Cloud Build**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/gundam-gcg
   gcloud run deploy --image gcr.io/PROJECT_ID/gundam-gcg --platform managed
   ```

2. **Configure Environment**
   - Set environment variables
   - Configure Cloud SQL connection
   - Set up domain mapping

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Certificate

1. Place certificate files in `nginx/ssl/`
2. Update `nginx/nginx.conf` with correct paths
3. Restart Nginx container

## Monitoring and Health Checks

### Health Check Endpoint

The application provides a comprehensive health check at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

Response includes:
- Application status
- Database connectivity
- Memory usage
- Uptime information
- Service statuses

### Monitoring Setup

1. **Prometheus + Grafana**
   ```bash
   # Add monitoring stack
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

2. **Application Metrics**
   - Add Prometheus client to Next.js
   - Expose metrics endpoint
   - Configure alerting rules

3. **Log Aggregation**
   - Use ELK stack or similar
   - Configure structured logging
   - Set up log rotation

## Backup and Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T db pg_dump -U postgres gundam_gcg > $BACKUP_DIR/database.sql

# Uploads backup
cp -r ./uploads $BACKUP_DIR/uploads
```

### Restore Process

```bash
# Restore database
docker-compose exec -T db psql -U postgres gundam_gcg < backup/database.sql

# Restore uploads
cp -r backup/uploads/* ./uploads/
```

## Performance Optimization

### 1. Image Optimization

- Configure CDN (Cloudinary, ImageKit)
- Enable WebP/AVIF formats
- Implement responsive images

### 2. Caching Strategy

- Redis for session storage
- Database query caching
- Static asset caching (Nginx)

### 3. Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_level ON cards(level);
CREATE INDEX idx_decks_user_id ON decks(user_id);
```

### 4. Load Balancing

```nginx
upstream nextjs {
    server app1:3000;
    server app2:3000;
    server app3:3000;
    keepalive 32;
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database container
   docker-compose ps db

   # Check database logs
   docker-compose logs db

   # Test connection
   docker-compose exec app npx prisma db pull
   ```

2. **Application Not Starting**
   ```bash
   # Check application logs
   docker-compose logs app

   # Verify environment variables
   docker-compose exec app env | grep DATABASE_URL

   # Check health endpoint
   curl http://localhost:3000/api/health
   ```

3. **High Memory Usage**
   ```bash
   # Monitor memory usage
   docker stats

   # Check for memory leaks
   docker-compose exec app node --inspect=0.0.0.0:9229 server.js
   ```

4. **SSL Certificate Issues**
   ```bash
   # Test SSL configuration
   openssl s_client -connect your-domain.com:443

   # Check certificate expiration
   echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

### Performance Issues

1. **Slow Database Queries**
   ```sql
   -- Enable query logging
   SET log_statement = 'all';

   -- Analyze slow queries
   SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC;
   ```

2. **High CPU Usage**
   ```bash
   # Profile Node.js application
   docker-compose exec app node --prof server.js

   # Generate flamegraph
   node --prof-process isolate-*.log > processed.txt
   ```

### Security Checklist

- [ ] Environment variables are not exposed
- [ ] Database uses strong password
- [ ] SSL/TLS is properly configured
- [ ] Security headers are enabled
- [ ] File upload restrictions are in place
- [ ] Rate limiting is configured
- [ ] Dependencies are up to date

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Configuration**
   - Session affinity (if needed)
   - Health check configuration
   - SSL termination

2. **Database Scaling**
   - Read replicas for queries
   - Connection pooling
   - Query optimization

3. **File Storage**
   - Use object storage (S3, GCS)
   - CDN for static assets
   - Distributed file uploads

### Vertical Scaling

- Monitor resource usage
- Adjust container limits
- Optimize application code
- Database tuning

## Security Best Practices

1. **Container Security**
   - Use non-root user
   - Minimal base images
   - Security scanning

2. **Network Security**
   - Private networks
   - Firewall rules
   - VPN access

3. **Data Protection**
   - Encryption at rest
   - Encryption in transit
   - Regular security audits

For additional support or questions, please refer to the project documentation or create an issue in the repository.