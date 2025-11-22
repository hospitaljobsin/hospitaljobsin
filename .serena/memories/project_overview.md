# Hospital Jobs Project Overview

## Project Purpose

Hospital Jobs is a comprehensive medical recruitment platform connecting healthcare professionals with job opportunities. It serves as a complete ecosystem for medical recruitment, featuring job searching, application management, organization profiles, and content management.

## System Architecture

The platform consists of multiple microservices organized as a monorepo:

### Core Services

- **Seeker Portal** (`apps/seeker-portal`) - Job search and application platform for medical professionals (Next.js 15.5.4, React 19)
- **Accounts** (`apps/accounts`) - Authentication and user management service (Next.js)
- **Recruiter Portal Core** (`apps/recruiter-portal-core`) - Recruitment platform UI (Next.js)
- **Recruiter Dashboard** (`apps/recruiter-dashboard`) - Recruitment dashboard interface (Next.js)
- **CMS** (`apps/cms`) - Payload CMS content management (Next.js)
- **Server** (`server/`) - GraphQL API backend (Python/FastAPI with Strawberry GraphQL)

### Supporting Infrastructure

- **E2E Tests** (`e2e/`) - Playwright test suite
- **Infrastructure** (`infrastructure/`) - Terraform IaC definitions
- **Schema** (`schema/`) - Shared GraphQL schema definitions

## Technology Stack

### Frontend Applications (Next.js)
- **Framework**: Next.js 15.5.4 with React 19 and App Router
- **Styling**: TailwindCSS 4.1.13 with HeroUI v2.8.4 components
- **State Management**: XState 5.22.0 for complex state, React Relay for GraphQL data fetching
- **Language**: TypeScript with strict mode enabled
- **Build Tool**: Turbopack (development), standard Next.js build (production)
- **Package Manager**: pnpm (enforced via preinstall hook, Node.js 22+ required)

### Backend Server (Python)
- **Framework**: FastAPI with Strawberry GraphQL
- **Database**: MongoDB with Beanie ODM and Redis for caching
- **Runtime**: Python 3.14+ with uv package manager
- **ASGI Server**: Granian with uvloop for high performance
- **Containerization**: Docker for deployment (AWS Lambda support)

### Development Tools
- **Linting**: Biome 2.2.3 for frontend, Ruff 0.14.0 for Python
- **Testing**: Playwright for E2E, pytest for backend with parallel execution
- **Code Quality**: Pre-commit hooks, Sentry for monitoring, React Compiler (experimental)
- **Local Development**: Docker Compose, Tmuxinator for session management

## Key Features

### Frontend Features
- **Job Search**: Advanced filtering, location-based search, speciality matching
- **Map Integration**: Interactive geographic job search with Leaflet and H3 hexagonal indexing
- **User Authentication**: Google OAuth, WebAuthn (passkey) support
- **Application Management**: Resume builder, application tracking
- **Content Management**: CMS integration with MDX support for blogs and content pages
- **Real-time Updates**: Relay GraphQL with persisted queries for optimal performance

### Backend Features
- **AI/ML Integration**: Resume parsing with OCR, job embeddings, applicant analysis
- **Geospatial Capabilities**: MongoDB Atlas Search with geo indexes, H3 indexing
- **Advanced Authentication**: WebAuthn, OAuth2, two-factor authentication
- **Performance Optimization**: Redis caching, vector search, dataloader patterns
- **API Features**: GraphQL API with Relay specification, type-safe operations

## Development Environment

### Prerequisites
- Docker Engine 4.35+
- Node.js 22+ with pnpm
- Python 3.14+ with uv
- TMUX 3.2a+ and Tmuxinator 3.0+
- Watchman for file watching
- Relay Compiler 19.0.0
- Pre-Commit 4.2.0
- MKCert 1.4.4+ for SSL certificates
- Terraform v1.12.1+ for infrastructure

### Quick Start Commands
```bash
# Set up pre-commit hooks
pre-commit install

# Start all development services
tmuxinator start medical_jobs

# Start individual services
pnpm --filter seeker-portal dev        # Port 5000
pnpm --filter accounts dev            # Port 5002
cd server && uv run -m scripts.run_server
```

### Code Quality Commands
```bash
# Frontend linting and formatting
pnpm --filter <app> lint              # Biome linting

# Backend linting and formatting
cd server && uv run ruff check         # Ruff linting
cd server && uv run ruff format        # Ruff formatting

# Type checking
cd server && uv run pyright           # Python type checking
```

### Testing Commands
```bash
# E2E Tests
docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d
cd e2e && pnpm run test

# Backend Tests
cd server && uv run pytest             # Standard execution
cd server && uv run pytest -n auto --cov=app  # Parallel with coverage
```

### GraphQL Operations
```bash
# Compile Relay queries (runs automatically in watch mode)
relay-compiler --watch

# Regenerate GraphQL schema (after backend changes)
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

## Code Organization Patterns

### Frontend Architecture
- **App Router**: Next.js 13+ with route groups and SEO-optimized URLs
- **Component Structure**: Feature-based organization with shared components
- **State Management**: Relay for server state, XState for complex client state
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with HeroUI component library

### Backend Architecture
- **Dependency Injection**: aioinject for service management
- **Repository Pattern**: Data access layer with Beanie ODM
- **Error Handling**: Result monad pattern with structured logging
- **Database**: MongoDB with vector search, Atlas Search, and H3 indexing
- **API Design**: GraphQL with Relay specification, persisted queries for production

## Deployment and Infrastructure

### Cloud Architecture
- **Frontend**: Next.js deployed via SST/CDK on AWS Lambda
- **Backend**: FastAPI in containers on AWS ECS/Fargate
- **Database**: MongoDB Atlas with Redis Cloud for caching
- **Infrastructure**: Terraform with GitHub Actions CI/CD
- **Monitoring**: Sentry for error tracking and performance
- **Analytics**: PostHog for product analytics

### Development Deployment
- **Local SSL**: MKCert for HTTPS development with .localtest.me domains
- **Hot Reload**: Enabled for all frontend apps and backend server
- **Container Support**: Docker Compose for supporting services
- **Environment Management**: Separate configs for development/staging/production

## Important Development Guidelines

### DO
- Use Relay GraphQL client for all data fetching with collocated fragments
- Use Suspense with appropriate skeletons for data-loading components
- Use HeroUI v2 components and TailwindCSS for styling
- Use React Hook Form for all forms with Zod validation
- Use XState for complex state machines and multi-step workflows
- Use functional React components consistently
- Use Context7 MCP tools for code generation and library documentation
- Follow strict TypeScript typing throughout the codebase

### DON'T
- Don't edit the generated GraphQL schema manually - regenerate from backend
- Don't use class components in React
- Don't prop drill GraphQL data - each component should have its own fragments
- Don't hardcode colors - follow the HeroUI theme system
- Don't mix package managers (pnpm for frontend, uv for backend)
- Don't create class containers for pytest tests - use functional test cases
- Don't use the legacy MongoDB motor client - use PyMongo async client with Beanie

## Quality Assurance

### Pre-commit Hooks
- Ruff formatting for Python files in server/
- Biome formatting for all TypeScript/JavaScript files
- Terraform validation and formatting for infrastructure files
- Large file detection and YAML/TOML validation

### Code Standards
- **Frontend**: Biome with 140 character width, tab indentation, single quotes
- **Backend**: Ruff with comprehensive linting rules and Pyright strict type checking
- **GraphQL**: Relay specification compliance with persisted queries
- **Testing**: High coverage requirements with integration tests for critical paths

This project represents a modern, scalable approach to medical recruitment with emphasis on performance, type safety, and developer experience.
