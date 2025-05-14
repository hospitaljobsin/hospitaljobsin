import httpx

from app.config import SecretSettings

# TODO: add request IP while verifying captcha here


class BaseCaptchaVerifier:
    """Base class for Captcha verifier."""

    async def verify(self, captcha_token: str, ip_address: str) -> bool:
        """Verify Recaptcha token."""
        raise NotImplementedError


class RecaptchaVerifier(BaseCaptchaVerifier):
    """Recaptcha verifier class."""

    def __init__(self, settings: SecretSettings) -> None:
        self._settings = settings

    async def verify(self, captcha_token: str, ip_address: str) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://www.google.com/recaptcha/api/siteverify?secret={self._settings.captcha_secret_key.get_secret_value()}&response={captcha_token}&remoteip={ip_address}",
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            )
            response_data = response.json()

        return response_data["success"]


class TurnstileCaptchaVerifier(BaseCaptchaVerifier):
    """Turnstile captcha verifier class."""

    def __init__(self, settings: SecretSettings) -> None:
        self._settings = settings

    async def verify(self, captcha_token: str, ip_address: str) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                data={
                    "secret": self._settings.captcha_secret_key.get_secret_value(),
                    "response": captcha_token,
                    "remoteip": ip_address,
                },
            )
            response_data = response.json()

        return response_data["success"]


class DummyCaptchaVerifier(BaseCaptchaVerifier):
    """Dummy captcha verifier class."""

    async def verify(self, captcha_token: str, ip_address: str) -> bool:  # noqa: ARG002
        return captcha_token == "dummy_recaptcha_token"  # noqa: S105


def create_captcha_verifier(settings: SecretSettings) -> BaseCaptchaVerifier:
    """Create a captcha verifier."""
    return TurnstileCaptchaVerifier(settings)
