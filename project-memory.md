# Gundam Card Game Website Project - Complete Memory File

## Project Overview

This is a comprehensive Gundam Card Game website project that serves as both a card database and deck building platform. The project aims to create the easiest-to-use card database/deckbuilding website that runs smoothly on both browser and mobile devices.

## Project Goals

1. **Create the most user-friendly Gundam Card Game database** with intuitive search and filtering capabilities
2. **Build an advanced deck building platform** with drag-and-drop functionality and real-time statistics
3. **Ensure optimal performance** across desktop and mobile devices
4. **Establish a one-stop-shop** for all Gundam Card Game player needs
5. **Support the growing community** of new and experienced players in this emerging game

## Key Requirements and Decisions

### User Requirements

- **Target Users**: Competitive, casual, and new players (brand new to 3 months experience)
- **Primary Use Cases**: Both online and in-person play
- **Core Features**: Card database, deck building, collection management
- **User Stories**:
  - Share deck builds with friends in group chats
  - Export deck builds to text format for other tools
  - Keep a list of built decks for easy reference
  - Track physical card collection with quantities
  - See which cards in deck are owned and how many copies

### Technical Requirements

- **Budget Constraint**: Maximum $30/month, preferably less
- **Local Development**: Full Docker environment before any cloud hosting
- **Performance**: Page load times under 2 seconds, search response under 500ms
- **Mobile-First**: Responsive design for phone/tablet use
- **Legal Compliance**: Proper attribution for Bandai Namco content

### Data Sources

- **Primary Source**: gundam-gcg.com/en/cards
- **Manual Uploads**: Support for previews and leaks
- **Data Management**: Pull into local database, maintain up-to-date information

## Technology Stack Decisions

### Core Stack

- **Frontend**: Next.js 13+ with TypeScript for SSR and optimal performance
- **Styling**: Tailwind CSS for rapid, responsive UI development
- **State Management**: Redux Toolkit for complex state management
- **Backend**: Next.js API routes (serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js for cost-effective user management

### Development Environment

- **Local Development**: Docker Compose for complete local development stack
- **Database**: PostgreSQL container with Docker
- **Caching**: Redis container for caching and session storage
- **File Storage**: Local file system for development, Vercel Blob/Cloudinary for production
- **Deployment**: Vercel for full-stack deployment (free tier available)

### Architecture

- **Server-Side Rendering (SSR)** with Next.js for optimal performance and SEO
- **RESTful API** using Next.js API routes for card data and deck management
- **Static Generation** for card database pages to improve performance
- **CDN integration** via Vercel Edge Network for fast card image delivery
- **Progressive Web App (PWA)** capabilities for mobile experience

## Coding Preferences and Standards

### Core Principles

- **Simple solutions preferred** over complex implementations
- **DRY principle** - avoid code duplication, reuse existing functionality
- **Environment-aware code** - proper handling of dev, test, and prod environments
- **Clean, organized codebase** with consistent patterns
- **File size limits** - refactor when files exceed 200-300 lines
- **No mock data** in dev or prod environments (only in tests)
- **No stubbing or fake data** patterns in production code
- **Environment file protection** - never overwrite .env without confirmation

### Development Practices

- Check for existing similar functionality before creating new code
- Reuse existing patterns and components
- Maintain consistent patterns throughout codebase
- Use proper mocking only in tests, never in dev or prod
- Keep files under 200-300 lines, refactor when exceeded

## Project Structure - Three Major Milestones

### Milestone 1: Complete Card Database Website

**Goal**: A fully functional, standalone card database website that could be deployed independently

**Key Features**:

- Complete Docker-based local development environment
- Comprehensive card search and filtering system
- High-quality card display with zoom functionality
- Mobile-responsive design
- Data integration from official source (gundam-gcg.com)
- Manual card upload functionality for previews/leaks
- Legal compliance footers and disclaimers
- User authentication system
- Card detail views with rulings and official text
- Advanced search with boolean operators
- Image optimization and CDN integration
- Performance optimization and caching

**Success Criteria**: Users can search, filter, and view all Gundam Card Game cards with a professional, fast, and mobile-friendly experience.

### Milestone 2: Deck Building and Collection Management Platform

**Goal**: Complete deck building and collection management functionality integrated with the card database

**Key Features**:

- Drag-and-drop deck construction interface
- Custom category system for deck organization
- Deck validation and legality checking
- Deck saving, loading, and management
- Personal collection tracking with quantity management
- Collection-deck integration (showing owned cards)
- Deck analytics and statistics
- Deck import/export functionality
- Collection search and filtering
- Bulk collection import/export
- Collection statistics and completion tracking

**Success Criteria**: Users can build, save, and manage decks while tracking their physical card collections with full integration between the two systems.

### Milestone 3: Complete Integrated Solution

**Goal**: Bring all features together into a cohesive, production-ready platform with advanced features

**Key Features**:

- Deck sharing system (public/private options)
- Advanced deck analytics and performance metrics
- Social features and user interactions
- Tournament tracking and management
- Donation/tip integration
- Advanced search and recommendation systems
- Performance optimizations and monitoring
- Production deployment and scaling
- API access for third-party integrations
- Advanced collection sharing and comparison
- Market integration planning
- Future monetization infrastructure

**Success Criteria**: A complete, production-ready Gundam Card Game platform that serves as the definitive resource for the community.

## Monetization Strategy

### Current Approach

- **Ads**: Deferred until post-MVP (after full website is complete and satisfactory)
- **Donations/Tips**: Integrated in Milestone 3 for immediate sustainability
- **Ad-Ready Design**: Layout designed with designated spaces for future ad integration

### Future Monetization (Post-Milestone 3)

- Google AdSense integration
- Premium features and subscription models
- Advanced analytics and business intelligence
- Community features and tournaments

## Legal and Compliance

### Requirements

- **Footer attributions** required for Bandai Namco content
- **Clear disclaimers** about non-affiliation with copyright holders
- **Proper attribution** for all copyrighted material
- **Privacy policy and terms of service** pages
- **Legal compliance footers** on all pages

## Current Project Status

### Completed Work

1. ✅ **PRD Creation**: Comprehensive Product Requirements Document
2. ✅ **Task List Generation**: Detailed task breakdown with 3-milestone structure
3. ✅ **Git Repository Setup**: Local git repository with proper .gitignore
4. ✅ **Coding Standards**: Integrated coding preferences and development standards
5. ✅ **Project Documentation**: README and project structure documentation

### Current State

- **Repository**: Initialized with 2 commits
- **Branch**: `main`
- **Status**: Ready to begin Milestone 1 implementation
- **Next Step**: Start with Task 1.1 - Initialize Next.js project

### File Structure

```
GCG/
├── .git/                              # Git repository
├── .gitignore                         # Git ignore rules
├── README.md                          # Project documentation
├── prd-gundam-card-game-website.md    # Product Requirements Document
├── cursorrules/                       # Development rules
│   ├── create-prd.md
│   ├── generate-tasks.md
│   ├── process-task-list.md
│   └── coding-prefs.md
├── tasks/                             # Task lists
│   └── tasks-prd-gundam-card-game-website.md
├── projectnotes/                      # Project notes
│   ├── clarifying-questions-gundam-website.md
│   └── prd-open-questions.md
└── project-memory.md                  # This memory file
```

## Key Decisions Made

### Development Approach

1. **Docker-First**: Complete local development environment before any cloud hosting
2. **Milestone-Based**: Three major milestones for manageable development
3. **Budget-Conscious**: Technology stack optimized for $30/month budget
4. **Ad-Deferred**: Focus on core functionality before monetization

### Technical Decisions

1. **Next.js with SSR**: For optimal performance and SEO
2. **PostgreSQL + Prisma**: For robust data management
3. **Docker Compose**: For consistent local development
4. **Vercel**: For cost-effective production deployment
5. **Tailwind CSS**: For rapid, responsive UI development

### User Experience Decisions

1. **Mobile-First**: Responsive design for all devices
2. **Collection Integration**: Show owned cards in deck building
3. **Manual Uploads**: Support for previews and leaks
4. **Legal Compliance**: Proper attribution and disclaimers

## Next Steps for Implementation

### Immediate Next Task

**Task 1.1**: Initialize Next.js project with TypeScript, Tailwind CSS, and SSR configuration

### Milestone 1 Focus

Complete the card database website as a standalone, deployable application before moving to deck building features.

### Development Workflow

1. Use Docker Compose for local development
2. Follow coding preferences and standards
3. Implement with DRY principles and code reuse
4. Maintain file size limits and clean organization
5. Test thoroughly before any production deployment

## Important Notes for Future Sessions

- **Budget Constraint**: $30/month maximum, preferably less
- **Local Development**: Must have full Docker environment working before cloud deployment
- **Coding Standards**: Strict adherence to coding preferences in cursorrules/coding-prefs.md
- **Milestone Approach**: Complete each milestone fully before moving to the next
- **Ad Strategy**: Ads deferred until post-MVP, focus on core functionality first
- **Legal Compliance**: Proper attribution and disclaimers required throughout

## Contact and Context

This project is for creating a Gundam Card Game website that combines the best of Scryfall (card database) and Moxfield (deck building) specifically for the Gundam Card Game community. The user wants a professional, fast, mobile-friendly experience that serves both competitive and casual players.

The project is currently ready to begin implementation of Milestone 1, starting with the Next.js project initialization and Docker development environment setup.

---

_This memory file was created to allow seamless continuation of the project in future sessions. All key decisions, requirements, and current status are documented above._
