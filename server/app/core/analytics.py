from posthog import Posthog

from app.config import EnvironmentSettings, PosthogSettings


def create_posthog_client(
    posthog_settings: PosthogSettings,
    env_settings: EnvironmentSettings,
) -> Posthog:
    """Create a PostHog client."""
    posthog = Posthog(
        posthog_settings.posthog_api_key.get_secret_value(),
        host=posthog_settings.posthog_api_host,
    )
    if not env_settings.is_production:
        posthog.disabled = True
    return posthog
