import httpx

from app.config import Settings


class BaseRecaptchaVerifier:
    """Base class for Recaptcha verifier."""

    async def verify(self, recaptcha_token: str) -> bool:
        """Verify Recaptcha token."""
        raise NotImplementedError


class RecaptchaVerifier(BaseRecaptchaVerifier):
    """Recaptcha verifier class."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def verify(self, recaptcha_token: str) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://www.google.com/recaptcha/api/siteverify?secret={self._settings.recaptcha_secret_key.get_secret_value()}&response={recaptcha_token}",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            )
            response_data = response.json()

        return response_data["success"]


class DummyRecaptchaVerifier(BaseRecaptchaVerifier):
    """Dummy Recaptcha verifier class."""

    async def verify(self, recaptcha_token: str) -> bool:
        return recaptcha_token == "dummy_recaptcha_token"  # noqa: S105


def create_recaptcha_verifier(settings: Settings) -> BaseRecaptchaVerifier:
    """Create a Recaptcha verifier."""
    if settings.is_testing:
        return DummyRecaptchaVerifier()
    return RecaptchaVerifier(settings)
