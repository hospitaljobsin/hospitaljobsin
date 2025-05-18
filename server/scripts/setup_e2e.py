import asyncio

import structlog
from app.config import AppSettings, get_settings
from app.core.instrumentation import initialize_instrumentation
from tests.e2e.seed_data import setup_test_database

if __name__ == "__main__":
    log = structlog.get_logger()

    # setup instrumentation
    log.info("Initializing instrumentation...")
    initialize_instrumentation(settings=get_settings(AppSettings))
    # Setup test database with e2e fixtures
    asyncio.run(setup_test_database())
    log.info("Test database setup complete.")
