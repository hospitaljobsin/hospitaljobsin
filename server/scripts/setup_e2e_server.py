import asyncio  # noqa: INP001

import uvicorn
from app.config import Settings
from app.logger import build_server_log_config, setup_logging
from tests.e2e.seed_data import setup_test_database

if __name__ == "__main__":
    settings = Settings()

    # setup test database with e2e fixtures
    asyncio.run(setup_test_database())

    # set up logging
    setup_logging(
        human_readable=settings.debug,
    )

    # run application
    uvicorn.run(
        app="app:create_app",
        factory=True,
        host=settings.host,
        port=settings.port,
        server_header=False,
        date_header=False,
        reload=settings.debug,
        access_log=settings.debug,
        log_config=build_server_log_config(
            log_level=settings.log_level,
            human_readable=settings.debug,
        ),
    )
