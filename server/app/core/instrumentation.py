import sentry_sdk
from structlog import get_logger

from app.config import AppSettings, SecretSettings, get_settings


def initialize_instrumentation(settings: AppSettings) -> None:
    """Initialize Sentry for error tracking and performance monitoring."""
    if not settings.is_production:
        # Skip Sentry initialization in non-production environments
        return
    logger = get_logger(__name__)
    sentry_dsn = get_settings(SecretSettings).sentry_dsn
    if not sentry_dsn:
        logger.warning("Sentry DSN is not set. Skipping Sentry initialization.")
        return
    logger.debug("initializing Sentry for error tracking and performance monitoring.")
    sentry_sdk.init(
        dsn=sentry_dsn.get_secret_value(),
        send_default_pii=True,  # Send personally identifiable information
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=0.1,
        # To collect profiles for all profile sessions,
        # set `profile_session_sample_rate` to 1.0.
        profile_session_sample_rate=0.1,
        # Profiles will be automatically collected while
        # there is an active span.
        profile_lifecycle="trace",
    )
