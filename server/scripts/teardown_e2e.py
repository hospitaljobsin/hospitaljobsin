import asyncio

import structlog
from tests.e2e.seed_data import teardown_test_database

if __name__ == "__main__":
    log = structlog.get_logger()
    # Clean up test database
    asyncio.run(teardown_test_database())
    log.info("Test database cleanup complete.")
