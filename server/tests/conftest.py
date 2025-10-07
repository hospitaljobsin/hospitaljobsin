import logging
import pkgutil

import pytest
import structlog
from structlog.stdlib import ProcessorFormatter

import tests.plugins


# Configure structlog to output to console in a readable format during tests
def setup_logging():
    processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="%Y-%m-%d %H:%M:%S"),
        structlog.dev.ConsoleRenderer(colors=True),
    ]

    structlog.configure(
        processors=processors,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Set up the root logger for standard logging
    handler = logging.StreamHandler()
    handler.setFormatter(
        ProcessorFormatter(processor=structlog.dev.ConsoleRenderer(colors=True))
    )
    root_logger = logging.getLogger()
    root_logger.handlers.clear()  # Remove any existing handlers
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)


# Set up logging before tests run
setup_logging()

pytest_plugins = [
    "anyio",
    *(
        mod.name
        for mod in pkgutil.walk_packages(
            tests.plugins.__path__,
            prefix="tests.plugins.",
        )
        if not mod.ispkg
    ),
]


@pytest.fixture(scope="session", autouse=True)
def anyio_backend() -> str:
    return "asyncio"
