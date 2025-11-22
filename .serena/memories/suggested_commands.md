# Essential Commands for Hospital Jobs Development

## Development Environment Setup

### Initial Setup
```bash
# Install pre-commit hooks (required)
pre-commit install

# Create local SSL certificates for HTTPS development
mkcd certs
mkcert -install
mkcert -cert-file ./localtest.me.pem -key-file ./localtest.me-key.pem "localtest.me" "*.localtest.me"

# Install dependencies
# Frontend apps use pnpm (enforced automatically)
# Backend uses uv for Python 3.14+
```

## Starting Development Services

### Start All Services
```bash
# Start all services in tmux session (recommended)
tmuxinator start medical_jobs
```

### Start Individual Services
```bash
# Frontend Applications (Next.js)
pnpm --filter seeker-portal dev        # Port 5000 - Job search platform
pnpm --filter accounts dev            # Port 5002 - Authentication service
pnpm --filter recruiter-portal-core dev  # Recruitment platform
pnpm --filter recruiter-dashboard dev  # Recruitment dashboard
pnpm --filter cms dev                 # Content management system

# Backend Server (Python/FastAPI)
cd server && uv run -m scripts.run_server           # Main API server with hot reload
cd server && uv run scripts/run_server.py           # Production server without reload
cd server && uv run scripts/run_persist_server.py   # Persisted queries server

# GraphQL Compilation
relay-compiler --watch                            # Runs in background for Relay schema compilation

# Supporting Services
docker compose up                                 # Redis, MongoDB for development
```

## Code Quality and Linting

### Frontend Code Quality
```bash
# Lint TypeScript/JavaScript code (Biome)
pnpm --filter <app-name> lint
# Examples:
pnpm --filter seeker-portal lint
pnpm --filter accounts lint

# Format code (Biome) - runs automatically via pre-commit
pnpm --filter <app-name> format
# Or run Biome directly:
biome format --write .
```

### Backend Code Quality
```bash
# Lint Python code (Ruff)
cd server && uv run ruff check
cd server && uv run ruff check --fix    # Auto-fix issues

# Format Python code (Ruff)
cd server && uv run ruff format

# Type checking (Pyright)
cd server && uv run pyright

# Run all quality checks together
cd server && uv run ruff check && uv run ruff format && uv run pyright
```

### Infrastructure Code Quality
```bash
# Format Terraform files
cd infrastructure && terraform fmt

# Validate Terraform configuration
cd infrastructure && terraform validate

# Lint Terraform files
cd infrastructure && tflint .
```

## Testing

### E2E Testing (Playwright)
```bash
# Start test environment
docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d

# Run E2E tests
cd e2e && pnpm run test

# Run tests with specific browser or file
cd e2e && pnpm run test --project=chromium
cd e2e && pnpm run test tests/auth.spec.ts
```

### Backend Testing (pytest)
```bash
# Run all tests
cd server && uv run pytest

# Run tests with coverage and parallel execution
cd server && uv run pytest -n auto --cov=app

# Run specific test files or directories
cd server && uv run pytest tests/integration/auth/
cd server && uv run pytest tests/integration/jobs/

# Run tests with verbose output
cd server && uv run pytest -v

# Run tests with specific markers
cd server && uv run pytest -m "slow"
```

## Build and Deployment

### Frontend Builds
```bash
# Build for production
pnpm --filter <app-name> build

# Build for AWS Lambda deployment with OpenNext
pnpm --filter seeker-portal package

# Start production server locally
pnpm --filter <app-name> start
```

### Backend Operations
```bash
# Generate GraphQL schema (after backend changes)
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql

# Run database migrations
cd server && uv run beanie migrate -uri 'mongodb://user:pass@localhost:27017/?directConnection=true' -db medicaljobs -p ./migrations

# Import regions data (initial setup)
cd server && uv run -m scripts.utils.import_regions

# Run persisted queries server (handles Relay compiler updates)
cd server && uv run scripts/run_persist_server.py
```

## Utility Commands

### Database and Data Operations
```bash
# Import regions/geographic data
cd server && uv run -m scripts.utils.import_regions

# Connect to MongoDB (if running locally)
docker compose exec mongodb mongo

# Check Redis connection
docker compose exec redis redis-cli ping
```

### Development Utilities
```bash
# Check Python environment and dependencies
cd server && uv tree

# Check Node.js and pnpm versions
node --version
pnpm --version

# Watch files for changes (alternative to tmuxinator)
watchfiles --patterns "*.py" --patterns "*.ts" --patterns "*.tsx" --patterns "*.js" --patterns "*.jsx" "echo 'Files changed'"

# Analyze bundle size
pnpm --filter seeker-portal build && pnpm --filter seeker-portal analyze
```

### Git and Repository Management
```bash
# Check git status across monorepo
git status

# Run pre-commit hooks manually
pre-commit run --all-files

# Check recent commits
git log --oneline -10

# Switch between branches
git checkout main
git checkout staging
```

## Performance and Debugging

### Performance Monitoring
```bash
# Analyze Next.js bundle
pnpm --filter seeker-portal build

# Check React components performance
# React Scan is integrated in seeker-portal for component profiling

# Monitor server performance
cd server && uv run -m scripts.run_server --reload  # Development with hot reload
```

### Debugging
```bash
# Debug with better exceptions (Python)
cd server && uv run python -m better_exceptions your_script.py

# Check TypeScript compilation
pnpm --filter seeker-portal type-check

# Verify Relay GraphQL compilation
relay-compiler ./relay.config.json --verbose
```

## Environment Management

### Environment Variables
```bash
# Copy environment templates
cp .env.example .env
cp server/.env.example server/.env
cp apps/.env.example apps/.env

# Check current environment
printenv | grep -E "(MONGO|REDIS|API|NODE|PYTHON)"
```

### Service Health Checks
```bash
# Check if services are running
curl http://localhost:5000/api/health  # Seeker Portal
curl http://localhost:5002/api/health  # Accounts
curl http://localhost:8000/health      # Backend Server
curl http://localhost:6379            # Redis
curl http://localhost:27017           # MongoDB
```

## Quick Reference for Common Tasks

### "I want to..."
```bash
# Start everything for development
tmuxinator start medical_jobs

# Fix code formatting issues
pre-commit run --all-files

# Run tests before committing
cd e2e && pnpm run test && cd ../server && uv run pytest

# Add new dependencies
pnpm --filter seeker-portal add package-name    # Frontend
cd server && uv add package-name               # Backend

# Update GraphQL schema after backend changes
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql

# Deploy to staging
# (Handled via GitHub Actions - push to staging branch)

# Check what's running
tmux ls
docker ps
```

### Common Port Numbers
- **5000**: Seeker Portal (job search platform)
- **5002**: Accounts service
- **8000**: Backend GraphQL API server
- **6379**: Redis cache
- **27017**: MongoDB database
- **3000**: Payload CMS (if running separately)

### Emergency Commands
```bash
# Stop all services
tmuxinator stop medical_jobs
docker compose down

# Reset development environment
git clean -fd
pnpm install
cd server && uv sync
pre-commit install

# Clear caches
rm -rf node_modules/.cache
rm -rf server/.pytest_cache
rm -rf .next
```
