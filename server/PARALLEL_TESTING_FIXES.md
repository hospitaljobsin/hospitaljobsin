# Parallel Testing Fixes

## Issues Fixed

### 1. Module-Scoped Fixtures
**Problem**: Module-scoped fixtures share state across tests in the same module, causing pollution when tests run in parallel across different workers.

**Solution**: Changed all `scope="module"` to `scope="function"` to ensure each test gets fresh fixtures.

```bash
find tests/integration -name "*.py" -type f -exec sed -i 's/scope="module"/scope="function"/g' {} \;
```

### 2. Random Test IDs in Parametrize
**Problem**: `generate_test_slug()` called during test collection creates different IDs per worker.

**Solution**: Replaced with fixed values in parametrize decorators.

### 3. Per-Worker Databases
**Problem**: Single test database causes conflicts between parallel workers.

**Solution**: Each worker gets unique database name (e.g., `test_database_gw0`, `test_database_gw1`).

## Running Tests

```bash
# Parallel execution
pytest tests/integration -n auto

# Single worker (no parallelization)
pytest tests/integration
```

## Performance Impact

- **Sequential**: ~70s for 1000 tests
- **Parallel (6 workers)**: ~12-15s for 1000 tests
- **Speedup**: ~5x faster
