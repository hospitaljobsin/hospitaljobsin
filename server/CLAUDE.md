# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Server Overview

The Hospital Jobs API server is a Python-based GraphQL backend built with FastAPI, Strawberry GraphQL, MongoDB with Beanie ODM, and uv for package management. It serves as the central API for the medical recruitment platform.

## Common Development Commands

### Starting the Server

```bash
# Main development server (with hot reload)
uv run -m scripts.run_server

# Production server without hot reload
uv run scripts/run_server.py

# Persisted queries server (for production optimization)
uv run scripts/run_persist_server.py
```

### Testing

```bash
# Run all tests
uv run pytest

# Run tests with coverage and parallel execution
uv run pytest -n auto --cov=app

# Run specific test files
uv run pytest tests/integration/auth/
uv run pytest tests/integration/jobs/

# Run tests with output files
uv run pytest --dist=worksteal
```

### Code Quality & Linting

```bash
# Python linting with Ruff
uv run ruff check
uv run ruff format

# Type checking with Pyright
uv run pyright

# Run both linting and formatting
uv run ruff check --fix
uv run ruff format .
```

### Database Operations

```bash
# Run database migrations
uv run beanie migrate -uri 'mongodb://user:pass@localhost:27017/?directConnection=true' -db medicaljobs -p ./migrations

# Import regions data
uv run -m scripts.utils.import_regions

# Run persisted queries server (handles Relay compiler updates)
uv run scripts/run_persist_server.py
```

### GraphQL Schema

```bash
# Generate GraphQL schema after backend changes
uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql
```

## High-Level Architecture

### Technology Stack

- **Framework**: FastAPI with Strawberry GraphQL
- **Database**: MongoDB with Beanie ODM
- **ASGI Server**: Granian with uvloop
- **Package Manager**: uv (Python 3.14+)
- **Dependency Injection**: aioinject
- **Authentication**: WebAuthn, OAuth2, 2FA
- **Monitoring**: Sentry, Structlog
- **AI/ML**: Pydantic AI, Bedrock embeddings

### Core Application Structure

```
server/
├── app/
│   ├── __init__.py           # FastAPP factory
│   ├── context.py            # GraphQL context types
│   ├── config.py             # Environment configuration
│   ├── container.py          # DI container setup
│   ├── database/            # MongoDB connection & indexes
│   ├── graphql_app.py        # GraphQL router configuration
│   ├── schema/              # GraphQL schemas & extensions & types
│   ├── accounts/             # User account management
│   ├── auth/                 # Authentication & authorization
│   ├── jobs/                 # Job posting & applications
│   ├── organizations/        # Recruiter/organization management
│   ├── geocoding/           # Location services
│   ├── core/                 # Core services & utilities
│   └── middleware/          # Custom middleware
├── scripts/                  # Server scripts
|   ├── utils/                # Utility scripts
├── tests/                   # Test suite
├── lambda_handlers/          # AWS Lambda handlers
└── query_map.json          # GraphQL persisted queries map (auto-generated, do NOT edit manually)
```

## Key Directories and Their Purposes

### `app/accounts/` - User Management

User registration, profiles, account management, profile parsing, document processing, and account services.

### `app/auth/` - Authentication System

WebAuthn (passkey) authentication, OAuth2 integration with Google, two-factor authentication (TOTP, authenticator), session management, and JWT tokens.

### `app/jobs/` - Core Business Logic

Job posting and management, job applications and applicant tracking, job metrics and analytics, resume processing, and OCR.

### `app/organizations/` - Company Management

Organization creation and management, employee benefits and invites, organization membership, and permissions.

### `app/core/` - Shared Services

AWS SDK integration (S3, SQS, SES, Textract), email and SMS services, embeddings and AI services, template rendering, and message sending.

## Development Patterns and Conventions

### Dependency Injection

- Uses `aioinject` for dependency management
- Services are registered in `container.py`
- Settings are auto-injected with type safety

### Repository Pattern

- Each domain has repositories for data access
- Services use repositories for business logic
- Beanie ODM for MongoDB document operations

### Error Handling

- Uses `result` monad for error handling
- Structured logging with `structlog`
- Sentry integration for error tracking

### Testing Strategy

- pytest with async support
- Integration tests for GraphQL mutations/queries
- Mock services for testing
- Parallel test execution with `pytest-xdist`

### Configuration Management

- Pydantic settings with environment variables
- AWS Secrets Manager integration
- Environment-specific configurations
- Type-safe configuration with validation

## Database Architecture

### MongoDB Collections

- **Accounts**: User accounts and authentication data
- **Jobs**: Job postings with embeddings and search indexes
- **JobApplicants**: Job applications with vector embeddings
- **Organizations**: Company and organization data
- **Sessions**: User sessions and authentication state
- **Regions**: Geographic location data with search indexes

### Search Indexes

- **Vector Search**: Job and applicant embeddings for similarity matching
- **Atlas Search**: Full-text search for jobs, regions, and applicants
- **H3 Hexagonal Indexes**: Geographic clustering for map visualization

## GraphQL Schema Structure

### Query Types

- **AccountQuery**: User account and profile queries
- **AuthQuery**: Authentication state and tokens
- **JobQuery**: Job search and filtering
- **OrganizationQuery**: Organization management
- **GeocodingQuery**: Location services
- **JobAlertQuery**: Job alert management
- **StatsQuery**: Analytics and statistics

### Mutation Types

- **AuthMutation**: Login, registration, password management
- **JobMutation**: Job CRUD operations
- **AccountMutation**: Profile updates and account management
- **OrganizationMutation**: Organization CRUD operations
- **JobAlertMutation**: Job alert management

## Key Features

### AI/ML Integration

- Job embeddings for similarity matching
- Resume parsing with Textract and Tesseract OCR
- Applicant profile analysis with AI agents
- Bedrock integration for AI services

### Advanced Authentication

- WebAuthn (passkey) support
- OAuth2 with Google
- Two-factor authentication (TOTP, authenticator)
- Password reset and recovery codes

### Geospatial Features

- MongoDB Atlas Search with geo indexes
- H3 hexagonal indexing for map clustering
- Region-based job search and filtering
- Geographic autocomplete and search

### Performance Optimization

- Redis caching for frequently accessed data
- Dataloader pattern for batch loading
- Vector search for intelligent matching
- Persisted queries for production performance

## Important Configuration Files

### `pyproject.toml`

- Dependencies and dev tools configuration
- Ruff linting configuration with strict rules
- Pytest configuration for parallel execution
- Python 3.14+ requirement enforced

### `.env` / `.env.example`

- Environment variables for local development
- Database connections, API keys, service URLs

### `Dockerfile`

- Multi-stage builds for development and production
- Support for AWS Lambda deployment
- Layer caching with UV package manager

## Environment Setup

### Prerequisites

- Python 3.14+
- UV package manager
- MongoDB and Redis (via Docker Compose)

### Initial Setup

1. Install dependencies: `uv sync -p 3.14 --frozen`
2. Set up Google OAuth2 Client with proper redirect URIs
3. Create `.env` file from `.env.example` template
4. Import regions data: `uv run -m scripts.utils.import_regions`
5. Run database migrations if needed
6. Start server: `uv run -m scripts.run_server`
