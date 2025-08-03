from posthog import Posthog

from app.config import AppSettings, PosthogSettings, SecretSettings


def create_posthog_client(
    posthog_settings: PosthogSettings,
    secret_settings: SecretSettings,
    app_settings: AppSettings,
) -> Posthog:
    """Create a PostHog client."""
    posthog = Posthog(
        secret_settings.posthog_api_key.get_secret_value(),
        host=posthog_settings.posthog_api_host,
    )
    if not app_settings.is_production:
        posthog.disabled = True
    return posthog
