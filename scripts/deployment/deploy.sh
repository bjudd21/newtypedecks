#!/bin/bash

# Production Deployment Script for Gundam Card Game Website
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
APP_NAME="gundam-gcg"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking deployment requirements..."

    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check if required files exist
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Production compose file ($COMPOSE_FILE) not found."
        exit 1
    fi

    if [ ! -f ".env.production" ]; then
        log_error "Production environment file (.env.production) not found."
        log_warning "Please copy .env.production.example and configure it."
        exit 1
    fi

    log_success "All requirements satisfied."
}

backup_data() {
    log_info "Creating backup of current data..."

    mkdir -p "$BACKUP_DIR"

    # Backup database if container is running
    if docker-compose -f "$COMPOSE_FILE" ps db | grep -q "Up"; then
        log_info "Backing up database..."
        docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U postgres gundam_gcg > "$BACKUP_DIR/database.sql"
        log_success "Database backup created: $BACKUP_DIR/database.sql"
    fi

    # Backup uploads directory if it exists
    if [ -d "./uploads" ]; then
        log_info "Backing up uploads..."
        cp -r ./uploads "$BACKUP_DIR/uploads"
        log_success "Uploads backup created: $BACKUP_DIR/uploads"
    fi

    log_success "Backup completed: $BACKUP_DIR"
}

build_application() {
    log_info "Building application..."

    # Build the Docker image
    docker-compose -f "$COMPOSE_FILE" build --no-cache app

    log_success "Application build completed."
}

deploy_application() {
    log_info "Deploying application..."

    # Copy production environment
    cp .env.production .env

    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down

    # Start new containers
    log_info "Starting new containers..."
    docker-compose -f "$COMPOSE_FILE" up -d

    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 30

    # Run database migrations
    log_info "Running database migrations..."
    docker-compose -f "$COMPOSE_FILE" exec -T app npx prisma migrate deploy

    log_success "Application deployed successfully."
}

verify_deployment() {
    log_info "Verifying deployment..."

    # Check if all services are running
    if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_error "Some services are not running properly."
        docker-compose -f "$COMPOSE_FILE" logs --tail=50
        exit 1
    fi

    # Check application health
    log_info "Checking application health..."
    sleep 10

    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Application is responding to health checks."
    else
        log_error "Application health check failed."
        docker-compose -f "$COMPOSE_FILE" logs app --tail=50
        exit 1
    fi

    log_success "Deployment verification completed."
}

cleanup() {
    log_info "Cleaning up old Docker images..."

    # Remove dangling images
    docker image prune -f

    # Remove old images (keep last 3)
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | \
    grep "$APP_NAME" | sort -k4 -r | tail -n +4 | awk '{print $3}' | xargs -r docker rmi

    log_success "Cleanup completed."
}

# Main deployment process
main() {
    log_info "Starting production deployment for $APP_NAME..."

    check_requirements
    backup_data
    build_application
    deploy_application
    verify_deployment
    cleanup

    log_success "🚀 Production deployment completed successfully!"
    log_info "Application is available at: http://localhost"
    log_info "Backup created at: $BACKUP_DIR"
}

# Run main function
main "$@"