import asyncio

import structlog
from tests.e2e.seed_data import setup_test_database

if __name__ == "__main__":
    log = structlog.get_logger()
    # Setup test database with e2e fixtures
    asyncio.run(setup_test_database())
    log.info("Test database setup complete.")
