# Parallel Testing with pytest-xdist

## Setup

Each pytest-xdist worker gets its own database to avoid conflicts.

### Changes Made

1. **`tests/conftest.py`** - Extract worker ID from pytest-xdist
2. **`tests/plugins/database.py`** - Append worker ID to database name

### How It Works

```python
# Worker "gw0" uses: test_database_gw0
# Worker "gw1" uses: test_database_gw1
# Worker "main" uses: test_database_main (non-parallel)
```

### Usage

```bash
# Run tests in parallel (auto-detect CPU cores)
pytest tests/integration -n auto

# Run with specific number of workers
pytest tests/integration -n 4

# Run without parallelization
pytest tests/integration
```

### Performance Impact

- **Before**: ~1000 tests × 1s = ~16 minutes
- **After (4 workers)**: ~16 minutes ÷ 4 = ~4 minutes

### Database Cleanup

Each worker's database is cleaned up after the session ends.
