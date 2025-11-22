# Code Style and Conventions Guide

## Frontend (TypeScript/React/Next.js)

### Code Formatting (Biome)
- **Indentation**: Tabs
- **Line Width**: 140 characters
- **Quotes**: Single quotes for strings and JSX
- **Trailing Commas**: None
- **Arrow Parentheses**: As needed
- **Semicolons**: Required (JavaScript standard)

### TypeScript Configuration
- **Strict Mode**: Enabled for all applications
- **Type Checking**: Comprehensive type checking enforced
- **Unused Variables**: Allowed for TypeScript (due to GraphQL fragment usage)
- **Imports**: Automatic import organization enabled

### React Patterns
- **Components**: Functional components only (no class components)
- **Fragments**: Use fragment syntax `<>...</>` instead of `<React.Fragment>`
- **Hooks**: Custom hooks in `hooks/` directories
- **State Management**:
  - Use Relay for server state
  - Use XState for complex state machines
  - Use React hooks for local component state

### Relay GraphQL Conventions
- **Fragment Colocation**: Declare fragments in components that use them
- **Type Safety**: All GraphQL operations must be fully typed
- **Query Organization**:
  - Queries in components or separate hook files
  - No prop drilling of GraphQL data
  - Each child component must have its own fragment
- **Suspense**: Use Suspense boundaries with appropriate loading skeletons

### Styling Conventions
- **CSS Framework**: TailwindCSS 4.1.13 with custom configurations
- **Component Library**: HeroUI v2.8.4 as primary component system
- **Theme**: Follow HeroUI theme system, no hardcoded colors
- **Responsive**: Mobile-first approach with defined breakpoints
- **Icons**: Lucide React for consistent iconography

### Form Patterns
- **Form Library**: React Hook Form for all form handling
- **Validation**: Zod for schema validation with TypeScript integration
- **Form Structure**: Reusable form components with consistent patterns
- **Error Handling**: Comprehensive error states and validation messages

### File Organization
```
components/
├── shared/          # Cross-cutting UI elements
├── layout/          # Header, footer, navigation
├── forms/           # Form components and validation
├── [feature]/       # Feature-specific components
└── index.ts         # Barrel exports

app/
├── (route-group)/   # Next.js route groups for layouts
├── [slug]/          # Dynamic routes
└── api/             # API routes

lib/
├── hooks/           # Custom React hooks
├── relay/           # GraphQL configuration
├── env/             # Environment validation (T3 OSS)
└── utils/           # Utility functions
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`, `JobCard`)
- **Files**: kebab-case for directories, PascalCase for component files
- **Hooks**: camelCase with `use` prefix (e.g., `useJobSearch`)
- **Constants**: UPPER_SNAKE_CASE for exported constants
- **Functions**: camelCase (e.g., `formatSalary`, `validateForm`)

## Backend (Python/FastAPI)

### Code Formatting (Ruff)
- **Configuration**: Based on `ruff check` and `ruff format`
- **Line Length**: No enforced limit (configured in E501 ignore)
- **Import Style**: `isort` compatible import organization
- **Type Checking**: Pyright with strict mode enabled

### Python Standards
- **Version**: Python 3.14+ required
- **Type Hints**: Mandatory for all function signatures and class attributes
- **Docstrings**: Not mandatory (D10 disabled), but encouraged for complex functions
- **Error Handling**: Use `result` monad pattern for error propagation

### Architecture Patterns
- **Dependency Injection**: Use `aioinject` for service management
- **Repository Pattern**: Separate data access layer from business logic
- **Service Layer**: Business logic encapsulated in service classes
- **FastAPI**: Use dependency injection for request-level dependencies

### Database Conventions
- **ODM**: Beanie V4 with PyMongo async client
- **Models**: Pydantic models for data validation and serialization
- **Collections**: Follow Beanie naming conventions
- **Indexes**: Define indexes in model classes for performance

### File Organization
```
app/
├── __init__.py         # FastAPI application factory
├── config.py           # Environment configuration
├── container.py        # DI container setup
├── database/           # MongoDB connection and models
├── schema/             # GraphQL schemas and types
├── accounts/           # User account management
├── auth/               # Authentication logic
├── jobs/               # Job posting and application logic
├── organizations/      # Company/organization management
├── core/               # Core services and utilities
└── middleware/         # Custom middleware

tests/
├── conftest.py         # Pytest configuration
├── integration/        # Integration tests
├── unit/               # Unit tests
└── fixtures/           # Test data fixtures
```

### Naming Conventions
- **Classes**: PascalCase (e.g., `JobService`, `UserRepository`)
- **Functions/Variables**: snake_case (e.g., `get_user_by_id`, `job_repository`)
- **Constants**: UPPER_SNAKE_CASE for module-level constants
- **Private Members**: Single underscore prefix (e.g., `_internal_method`)
- **Files**: snake_case (e.g., `user_service.py`, `job_repository.py`)

### GraphQL Schema Conventions
- **Schema Generation**: Export from Python with `strawberry export-schema`
- **Types**: Use Strawberry type decorators extensively
- **Queries/Mutations**: Organized by domain in separate modules
- **Relay Specification**: Follow Relay patterns for pagination and connections

## Testing Conventions

### Frontend Testing
- **E2E Testing**: Playwright for user flow testing
- **Component Testing**: Leverage TypeScript for compile-time validation
- **Mock Patterns**: Use Relay Mock environment for testing GraphQL operations

### Backend Testing (pytest)
- **Test Style**: Functional tests only (no class containers for test cases)
- **Async Testing**: Use `pytest-asyncio` for async function testing
- **Test Organization**: Separate test files by feature/domain
- **Fixtures**: Use pytest fixtures for test setup and data
- **Parallel Execution**: Tests must support parallel execution with `pytest-xdist`

### Testing Structure
```
tests/
├── conftest.py         # Shared fixtures and configuration
├── integration/        # API integration tests
│   ├── auth/           # Authentication tests
│   ├── jobs/           # Job functionality tests
│   └── accounts/       # Account management tests
├── unit/               # Unit tests for individual functions
└── e2e/                # End-to-end test scenarios
```

## Infrastructure (Terraform)

### Terraform Conventions
- **Formatting**: `terraform fmt` and `terraform validate` enforced
- **Linting**: TFLint for additional code quality checks
- **State Management**: S3 backend with state locking
- **Modules**: Use reusable modules for common patterns

## Documentation Standards

### Code Comments
- **Purpose**: Comments should explain "why" not "what"
- **Language**: English for all comments and documentation
- **GraphQL**: Use schema descriptions for API documentation
- **Python**: Use docstrings for complex functions and classes

### README Files
- **Project Level**: Comprehensive setup and development instructions
- **Service Level**: Service-specific documentation in each app directory
- **API Documentation**: Auto-generated from GraphQL schema

## Git and Version Control

### Commit Messages
- **Format**: Conventional Commits (feat:, fix:, docs:, etc.)
- **Scope**: Use service/feature scope when applicable
- **Body**: Detailed description for complex changes

### Branch Strategy
- **main**: Production-ready code
- **staging**: Integration and testing branch
- **feature/***: Feature development branches

### Code Review Guidelines
- **Type Safety**: Ensure all TypeScript is properly typed
- **Performance**: Consider performance implications for GraphQL queries
- **Security**: Review authentication and authorization logic
- **Testing**: Ensure adequate test coverage for new features

## Performance Conventions

### Frontend Performance
- **Bundle Size**: Monitor with `@next/bundle-analyzer`
- **Code Splitting**: Use Next.js automatic code splitting
- **Images**: Use Next.js Image component with WebP/AVIF support
- **Loading States**: Implement proper loading states with Suspense

### Backend Performance
- **Database Queries**: Optimize MongoDB queries with proper indexes
- **Caching**: Use Redis for frequently accessed data
- **Async Operations**: Use async/await patterns throughout
- **Connection Pooling**: Proper database connection management

## Security Conventions

### Authentication
- **OAuth2**: Use secure OAuth2 flows with proper state handling
- **JWT Tokens**: Secure token storage and transmission
- **WebAuthn**: Implement passkey authentication with proper security measures
- **2FA**: Support multiple two-factor authentication methods

### Data Validation
- **Input Validation**: Use Zod/Pydantic for comprehensive input validation
- **SQL Injection**: Use ORM (Beanie) to prevent injection attacks
- **XSS Prevention**: Proper sanitization of user-generated content
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

## Environment Configuration

### Environment Variables
- **Validation**: Use T3 OSS (frontend) and Pydantic Settings (backend)
- **Type Safety**: Environment variables are type-checked and validated
- **Secrets Management**: Use AWS Secrets Manager in production
- **Development**: Copy from `.env.example` templates

### Service Configuration
- **Port Allocation**: Consistent port assignments across services
- **Service Discovery**: Use environment variables for service URLs
- **Health Checks**: Implement health check endpoints for all services
- **Monitoring**: Integrate Sentry for error tracking and performance monitoring
