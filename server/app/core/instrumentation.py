import sentry_sdk
from sentry_sdk.integrations import Integration
from sentry_sdk.integrations.strawberry import StrawberryIntegration
from structlog import get_logger

from app.config import EnvironmentSettings, SentrySettings, get_settings


def initialize_instrumentation(settings: EnvironmentSettings) -> None:
    """Initialize Sentry for error tracking and performance monitoring."""
    logger = get_logger(__name__)
    logger.debug("Initializing Sentry for error tracking and performance monitoring.")
    integrations: list[Integration] = [
        StrawberryIntegration(
            # Set async_execution to True if you have
            # at least one async resolver
            async_execution=True,
        )
    ]
    sentry_sdk.init(
        dsn=get_settings(SentrySettings).sentry_dsn,
        environment=settings.environment,
        send_default_pii=True,  # Send personally identifiable information
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=1.0,
        # To collect profiles for all profile sessions,
        # set `profile_session_sample_rate` to 1.0.
        profile_session_sample_rate=1.0,
        # Profiles will be automatically collected while
        # there is an active span.
        profile_lifecycle="trace",
        integrations=integrations,
        _experiments={"enable_logs": True},
    )
