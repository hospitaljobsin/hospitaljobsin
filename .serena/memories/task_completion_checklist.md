# Task Completion Checklist

## Pre-Commit Requirements

Before considering any task complete, ensure the following quality checks pass:

### Code Quality
```bash
# Frontend code formatting and linting
pnpm --filter <app-name> lint
# (Biome formatting runs automatically via pre-commit hooks)

# Backend code quality
cd server && uv run ruff check --fix    # Fix any linting issues
cd server && uv run ruff format         # Format Python code
cd server && uv run pyright             # Ensure no type errors
```

### Pre-commit Hooks
```bash
# Run all pre-commit hooks manually to verify
pre-commit run --all-files
```

## Testing Requirements

### Backend Tests
```bash
# Run all backend tests with coverage
cd server && uv run pytest -n auto --cov=app

# Ensure no test failures or regressions
cd server && uv run pytest -xvs  # Stop on first failure, verbose output
```

### E2E Tests (if applicable)
```bash
# Start test environment
docker compose -f docker-compose.e2e.yml up --wait --build --remove-orphans -d

# Run E2E test suite
cd e2e && pnpm run test
```

## GraphQL Schema Updates

### If Backend Schema Changed
```bash
# Regenerate GraphQL schema after any backend changes
cd server && uv run strawberry export-schema app.schema:schema > ../schema/schema.graphql

# Verify Relay compilation
relay-compiler ./relay.config.json
```

## Frontend Build Verification

### Build Tests
```bash
# Test build process for all modified frontend apps
pnpm --filter <app-name> build

# Verify build succeeds without errors or warnings
pnpm --filter <app-name> start  # Test production build locally
```

## Code Review Checklist

### Functionality
- [ ] Feature works as specified in requirements
- [ ] No unintended side effects or regressions
- [ ] Error handling is comprehensive and user-friendly
- [ ] Edge cases are properly handled

### Code Quality
- [ ] Code follows established style conventions
- [ ] TypeScript/Python types are correct and comprehensive
- [ ] No dead code or unused imports (except where intentional)
- [ ] Variable and function names are descriptive and follow conventions
- [ ] Code is well-organized and maintainable

### Security
- [ ] Input validation is implemented where needed
- [ ] No hardcoded secrets or sensitive data
- [ ] Authentication and authorization are properly implemented
- [ ] Database queries are parameterized and safe

### Performance
- [ ] No obvious performance bottlenecks introduced
- [ ] Database queries are optimized with proper indexes
- [ ] GraphQL queries are efficient and not over-fetching
- [ ] Bundle size impact is acceptable for frontend changes

### Testing
- [ ] New functionality is covered by appropriate tests
- [ ] Existing tests still pass (no regressions)
- [ ] Test coverage is maintained or improved
- [ ] Tests are meaningful and test the right scenarios

### Documentation
- [ ] Code comments explain complex logic where necessary
- [ ] GraphQL types have proper descriptions
- [ ] Any breaking changes are documented
- [ ] README or relevant documentation is updated if needed

## Technology-Specific Requirements

### Frontend (React/Next.js)
- [ ] Relay fragments are collocated with components that use them
- [ ] Forms use React Hook Form with Zod validation
- [ ] Components are functional and use hooks appropriately
- [ ] Suspense boundaries are properly implemented for data fetching
- [ ] Error boundaries are implemented for error handling
- [ ] Loading states are provided for async operations
- [ ] Responsive design works across different screen sizes
- [ ] Accessibility requirements are met (ARIA labels, keyboard navigation)

### Backend (Python/FastAPI)
- [ ] Dependency injection is used correctly
- [ ] Repository pattern is followed for data access
- [ ] Error handling uses result monad pattern consistently
- [ ] Database operations are async and use proper connection handling
- [ ] GraphQL types use proper Strawberry decorators
- [ ] Authentication middleware is applied where needed
- [ ] Logging is implemented for debugging and monitoring
- [ ] Database transactions are used where appropriate

### GraphQL/Relay
- [ ] GraphQL queries/mutations follow Relay specification
- [ ] Pagination is implemented using Relay connections
- [ ] Type safety is maintained across frontend and backend
- [ ] No over-fetching or under-fetching of data
- [ ] Persisted queries are properly configured for production
- [ ] Schema descriptions are provided for API documentation

### Database (MongoDB)
- [ ] Database indexes are defined for query performance
- [ ] Data models use proper Pydantic validation
- [ ] Beanie ODM is used correctly for async operations
- [ ] Collection names follow consistent naming conventions
- [ ] Migrations are properly handled if schema changes are made

## Integration Requirements

### Cross-Service Communication
- [ ] API endpoints work correctly across services
- [ ] Authentication tokens are properly handled between services
- [ ] Error responses are consistent across APIs
- [ ] CORS settings are properly configured for cross-origin requests

### External Services
- [ ] Third-party API integrations are properly tested
- [ ] Error handling for external service failures is implemented
- [ ] API keys and secrets are properly managed
- [ ] Rate limiting is considered where applicable

## Final Verification Steps

### Development Environment
- [ ] All services start correctly with `tmuxinator start medical_jobs`
- [ ] Application loads in browser without console errors
- [ ] User authentication flow works end-to-end
- [ ] Key functionality works in development environment

### Production Readiness
- [ ] Application builds successfully for production
- [ ] Environment variables are properly configured
- [ ] Monitoring and logging are in place
- [ ] Error tracking (Sentry) is properly configured
- [ ] Performance monitoring tools are working

### Git and Version Control
- [ ] Changes are committed with descriptive commit messages
- [ ] No sensitive files are accidentally committed
- [ ] `.gitignore` rules are working properly
- [ ] Branch is ready for merge/PR creation

## When to Mark Task as Complete

A task can only be marked complete when:

1. **All automated checks pass**: Pre-commit hooks, linting, type checking, and tests
2. **Manual testing confirms functionality**: Feature works as specified in requirements
3. **No regressions introduced**: Existing functionality still works correctly
4. **Code quality standards met**: Follows all established conventions and patterns
5. **Documentation updated**: Any relevant documentation is updated
6. **Production ready**: Code is ready for deployment to production environment

## Emergency Skip Conditions

In emergency situations, some steps may be skipped, but this requires:

1. **Explicit acknowledgment**: Note which steps were skipped and why
2. **Follow-up plan**: Create issues or tasks to address skipped items
3. **Team approval**: Get approval from team lead or relevant stakeholders
4. **Risk assessment**: Document any risks introduced by skipping steps

## Common Pitfalls to Avoid

### Don't Forget
- GraphQL schema regeneration after backend changes
- Relay compilation after GraphQL schema changes
- Running tests across all affected services, not just modified code
- Testing in multiple browsers if UI changes are made
- Checking both development and production build processes

### Common Issues
- Type errors that only appear in strict mode
- Performance issues that only appear with large datasets
- Memory leaks in long-running processes
- Race conditions in async operations
- Browser compatibility issues with new JavaScript features

### Quality Gates
- Never commit code that fails pre-commit hooks
- Never merge code that fails automated tests
- Never deploy code that hasn't been tested in staging
- Never skip security reviews for authentication/authorization changes
