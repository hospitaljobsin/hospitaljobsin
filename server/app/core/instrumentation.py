import sentry_sdk
from structlog import get_logger


def initialize_instrumentation() -> None:
    """Initialize Sentry for error tracking and performance monitoring."""
    logger = get_logger(__name__)
    logger.debug("initializing Sentry for error tracking and performance monitoring.")
    sentry_sdk.init(
        dsn="https://your_sentry_dsn_here",
        traces_sample_rate=1.0,  # Adjust this value to control the amount of performance data sent
        send_default_pii=True,  # Send personally identifiable information
    )
    logger.debug("Sentry initialized for error tracking and performance monitoring.")
