# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.
- Always use serena MCP for semantic code indexing and retrieval. this is more efficient than using grep.

## Project Overview

Hospital Jobs is a medical recruitment platform connecting healthcare professionals with job opportunities. The system consists of multiple services:

- **Seeker Portal** - Job search and application platform for medical professionals
- **Accounts** - Authentication and user management service
- **Recruiter Portal Core** - Recruitment platform UI
- **Recruiter Dashboard** - Recruitment dashboard interface
- **CMS** - Payload CMS content management
- **Server** - GraphQL API backend (Python/FastAPI)
- **E2E Tests** - Playwright test suite

## Technology Stack

### Frontend Applications (Next.js)

- **Framework**: Next.js 15.5.4 with React 19
- **Styling**: TailwindCSS with HeroUI components
- **State Management**: XState with React Relay for GraphQL
- **Language**: TypeScript with strict type checking
- **Build Tool**: Turbopack (dev), standard Next.js build
- **Package Manager**: pnpm (required via preinstall hook)

### Backend Server (Python)

- **Framework**: FastAPI with Strawberry GraphQL
- **Database**: MongoDB with Beanie ODM
- **Runtime**: Python 3.14+ with uv package manager
- **ASGI Server**: Granian with uvloop
- **Container**: Docker for deployment

### Development Tools

- **Linting**: Biome for frontend, Ruff for Python
- **Testing**: Playwright for E2E, pytest for backend
- **Code Quality**: Pre-commit hooks, Sentry for monitoring
- **Local Development**: Docker Compose, Tmuxinator for session management

## Common Development Commands

### Starting Development Environment

```bash
# Start all services in tmux session
tmuxinator start medical_jobs

# Start individual services
pnpm --filter seeker-portal dev        # Port 5000
pnpm --filter accounts dev            # Port 5002
pnpm --filter recruiter-portal-core dev
pnpm --filter recruiter-dashboard dev
pnpm --filter cms dev
cd server && uv run -m scripts.run_server
```

### Building Applications

```bash
# Frontend applications
pnpm --filter seeker-portal build
pnpm --filter accounts build
# etc. for each app

# Server packaging (handled by SST/CDK)
# No manual build required
```

### Testing

```bash
# E2E Tests (requires docker-compose.e2e.yml)
docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d
cd e2e && pnpm run test

# Backend Tests
cd server && uv run pytest
```

### Code Quality

```bash
# Frontend linting
pnpm --filter <app> lint

# Backend linting and formatting
cd server && uv run ruff check
cd server && uv run ruff format
```

### GraphQL Relay

```bash
# Compile Relay queries (watch mode)
relay-compiler --watch

# Manual compilation
relay-compiler ./relay.config.json

# Regenerate GraphQL Schema (after backend changes)
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

## Development Guidelines

### React & Frontend Development

#### DO

- Use Relay GraphQL client for data fetching. Queries must be in the component files that need them, or in a separate hook file if they need to be reused
- Use Suspense with appropriate skeletons over components that fetch data
- Declare fragments for each sub component that needs to read data
- Use HeroUI v2 components for the frontend, along with TailwindCSS v4
- Use React Hook Form whenever building forms
- Use XState whenever state machines are required (e.g., multi-step forms)
- Always use functional React components
- Use next/dynamic imports for components that are strictly client side (only "use client" directive usage pre-renders it on the server)
- Use zod/v4 for input validation in the frontend
- Always use Context7 when you need code generation, setup or configuration steps, or library/API documentation

#### DON'T

- Don't edit the GraphQL schema in schema/schema.graphql manually - it's a generated file from the Python GraphQL code
- Don't use class components in React
- Don't declare fragments in a top-level component and prop drill it to child components. Each child component must have its own fragment, following Relay best practices
- Don't hardcode colors. Always follow the HeroUI theme

### Backend & Database Development

#### DO

- Always run Python scripts/tests with `uv` instead of the raw Python command to ensure the right virtual environment is activated
- Use Beanie V4 with the PyMongo async client while interacting with the database

#### DON'T

- Don't use the legacy MongoDB motor client - use PyMongo async client instead
- Don't create class containers for test cases in pytest. Test cases must always be functional. Separate test cases by files as boundaries if required

## Architecture and Code Organization

### Monorepo Structure

- `apps/` - Next.js applications (seeker-portal, accounts, etc.)
  - Under each frontend app, the components are in the `components/` directory
- `server/` - Python FastAPI GraphQL backend
- `e2e/` - Playwright end-to-end tests
- `infrastructure/` - Terraform IaC definitions
- Shared configuration in root (pnpm-workspace.yaml, biome.json, etc.)

**Important**: Backend is in `server/` directory, frontends are separate in `apps/` directory.

### Frontend Application Structure

Each Next.js app follows this pattern:

- `src/` - Source code
  - `components/` - React components
  - `pages/` - Next.js pages (if using pages router)
  - `app/` - Next.js app router (if using app router)
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `__generated__/` - Relay-generated GraphQL types

### Backend Server Structure

- `app/` - Main application code
  - `accounts/` - User account management
  - `auth/` - Authentication logic
  - `jobs/` - Job posting and application logic
  - `organizations/` - Company/organization management
  - `schema/` - GraphQL schema definitions
  - `core/` - Core business logic
  - `database/` - Database models and connections
- `scripts/` - Utility scripts and server runners
- `tests/` - Backend test suite

### GraphQL Architecture

- **Backend**: Strawberry GraphQL with FastAPI
- **Frontend**: React Relay for type-safe GraphQL queries
- **Code Generation**: Relay compiler generates TypeScript types
- **Schema**: Centralized in server/app/schema/

### Database Design

- **Primary**: MongoDB with document-based storage
- **Caching**: Redis for session management and caching
- **ODM**: Beanie for async MongoDB operations

## Development Workflow

### Environment Setup

1. Install required tools (Docker, Node.js 22+, Python 3.14+, pnpm)
2. Set up pre-commit hooks: `pre-commit install`
3. Create local SSL certificates with mkcert for HTTPS development
4. Copy `.env.example` to `.env` in each service directory

### Feature Development

1. Use tmuxinator session for local development
2. Make changes to frontend and backend concurrently
3. Run Relay compiler after GraphQL schema changes
4. Test E2E flows before committing

### Deployment

- **Infrastructure**: Terraform with GitHub Actions
- **Frontend**: Next.js deployed via SST/CDK on AWS Lambda
- **Backend**: FastAPI in containers on AWS ECS/Fargate
- **Database**: MongoDB Atlas with Redis Cloud
- **Monitoring**: Sentry for error tracking and performance

## Important Notes

### Package Management

- Frontend uses pnpm (enforced by preinstall hook)
- Backend uses uv for Python package management
- Never mix package managers within the same ecosystem

### Code Standards

- TypeScript strict mode enabled for all frontend apps
- Python strict type checking with pyright
- Biome for consistent code formatting (frontend)
- Ruff for Python linting and formatting

### Relay GraphQL

- All GraphQL queries must use Relay
- **The Relay compiler runs in the background and automatically regenerates compiled files after changes - no need to run manual commands**
- Types are auto-generated in `__generated__/` directories
- Never edit generated files manually

### Local Development

- All services run on different ports (5000, 5002, etc.)
- Use `.localtest.me` domains for HTTPS development
- Docker Compose for supporting services (Redis, MongoDB)
- Hot reload enabled for all frontend apps

### Security

- Authentication handled by accounts service
- JWT tokens for API authentication
- Environment-specific configurations
- Never commit secrets or API keys
