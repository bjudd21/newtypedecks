# 🚀 **Running the Gundam Card Game Website Locally**

Here's a complete step-by-step guide to get the website running on your local machine using containers:

## **Prerequisites**
- **Docker & Docker Compose** installed
- **Node.js 18+** and **npm** installed
- **Git** (if cloning the repository)

## **🔧 Quick Start (Recommended)**

### **1. Navigate to Project Directory**
```bash
cd /Users/mkv/Documents/Projects/GCG
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Environment & Database**
```bash
# Create environment file from template
npm run env:create

# Generate secure secrets for authentication
npm run env:secrets

# Start PostgreSQL and Redis containers
npm run docker:dev

# Generate Prisma client and setup database
npm run db:generate
npm run db:push

# Seed database with sample data (optional)
npm run db:seed
```

### **4. Start Development Server**
```bash
npm run dev
```

**🎉 Your website will be available at:** `http://localhost:3000`

---

## **🐳 Alternative: Full Container Setup**

If you prefer to run everything in containers:

### **1. Production-like Container Setup**
```bash
# Start all services including the app container
docker-compose --profile production up -d

# OR build and start manually
docker-compose up -d postgres redis
docker-compose up app
```

### **2. Development with External Database**
```bash
# Start just the database services
npm run docker:dev

# Run the app locally (recommended for development)
npm run dev
```

---

## **📋 Environment Configuration**

The `.env` file is automatically created with these defaults:
- **Database**: PostgreSQL on `localhost:5432`
- **Redis**: Redis cache on `localhost:6379`
- **NextAuth**: Basic authentication setup
- **File Storage**: Local storage (no external CDN needed)

### **Optional: Enable Advanced Features**

Edit your `.env` file to enable:

**🔐 Social Login (Optional)**
```bash
# Add to .env for Google/Discord OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

**📧 Email Features (Optional)**
```bash
# Add to .env for password reset/verification
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
```

---

## **🛠️ Development Workflow**

### **Essential Commands**
```bash
# Development server with hot reload
npm run dev

# Database management
npm run db:studio        # Visual database browser
npm run db:seed          # Add sample data
npm run db:reset         # Reset database

# Code quality
npm run lint:fix         # Fix linting issues
npm run type-check       # Check TypeScript
npm run test             # Run tests

# Container management
npm run docker:dev       # Start database containers
npm run docker:down      # Stop all containers
```

### **🗃️ Database Management**
```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# View database in browser at: http://localhost:5555
```

---

## **✨ Features Available Locally**

Once running, you'll have access to all implemented features:

- **🃏 Card Database**: Browse 1000+ cards with advanced search
- **🏗️ Deck Builder**: Anonymous & authenticated deck building
- **📚 Collection Manager**: Track your card collection
- **🏆 Tournament Tools**: Deck validation, simulation, practice tracking
- **👥 Social Features**: User profiles, ratings, comments, community hub
- **📱 PWA Features**: Install as app, offline support
- **📊 Analytics**: Deck statistics, comparisons, recommendations

---

## **🔍 Troubleshooting**

### **Port Conflicts**
If ports 3000, 5432, or 6379 are in use:
```bash
# Check what's using the ports
lsof -i :3000 -i :5432 -i :6379

# Modify docker-compose.yml to use different ports if needed
```

### **Database Issues**
```bash
# Reset everything and start fresh
npm run docker:down
docker volume prune -f
npm run docker:dev
npm run db:push
npm run db:seed
```

### **Permission Issues**
```bash
# Fix file permissions (macOS/Linux)
sudo chown -R $USER:$USER .
```

---

## **🚀 Production Deployment**

For production deployment, the project includes:
- **Docker production images**
- **Kubernetes configurations** (`k8s/` directory)
- **Nginx reverse proxy** setup
- **Automated deployment scripts** (`scripts/deployment/`)

---

## **📖 Additional Documentation**

- **CLAUDE.md** - Complete development commands and architecture overview
- **tasks/tasks-prd-gundam-card-game-website.md** - Full feature implementation status
- **DEPLOYMENT.md** - Production deployment guide (if available)

---

**🎮 Enjoy building and managing your Gundam Card Game decks!**

The website includes all features from the PRD - card database, deck building, collection management, social features, tournament tools, and PWA capabilities, all running locally with full offline support.