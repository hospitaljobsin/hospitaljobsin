import sentry_sdk
from sentry_sdk.integrations.strawberry import StrawberryIntegration
from structlog import get_logger

from app.config import AppSettings, SentrySettings, get_settings


def initialize_instrumentation(settings: AppSettings) -> None:
    """Initialize Sentry for error tracking and performance monitoring."""
    logger = get_logger(__name__)
    logger.debug("Initializing Sentry for error tracking and performance monitoring.")
    sentry_sdk.init(
        dsn=get_settings(SentrySettings).sentry_dsn,
        environment=settings.environment,
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
        integrations=[
            StrawberryIntegration(
                # Set async_execution to True if you have
                # at least one async resolver
                async_execution=True,
            ),
        ],
        _experiments={"enable_logs": True},
    )
