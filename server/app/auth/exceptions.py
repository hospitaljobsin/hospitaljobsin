from app.core.constants import AuthProvider


class EmailInUseError:
    """Raised when an user with an email address already exists."""


class InvalidEmailError:
    """Raised when an invalid email address is provided."""

    def __init__(self, message: str) -> None:
        self.message = message


class InvalidCredentialsError:
    """Raised when an user provides invalid credentials."""


class InvalidPasswordResetTokenError:
    """Raised when an invalid password reset token is provided."""


class EmailVerificationTokenCooldownError:
    """Raised when an user tries to request a new email verification token too soon."""

    remaining_seconds: int

    def __init__(self, remaining_seconds: int) -> None:
        self.remaining_seconds = remaining_seconds


class PasswordResetTokenCooldownError:
    """Raised when an user tries to request a new password reset token too soon."""

    remaining_seconds: int

    def __init__(self, remaining_seconds: int) -> None:
        self.remaining_seconds = remaining_seconds


class InvalidEmailVerificationTokenError:
    """Raised when an invalid email verification token is provided."""


class InvalidCaptchaTokenError:
    """Raised when an invalid captcha token is provided."""


class PasswordNotStrongError:
    """Raised when the provided password is not strong enough."""


class InvalidAuthenticationProviderError:
    """
    Raised when the user tries an invalid authetication provider.

    (occurs when users sign in via Oauth2/ passkeys and try to login with their password).
    """

    available_providers: list[AuthProvider]

    def __init__(self, available_providers: list[AuthProvider]) -> None:
        self.available_providers = available_providers


class PasswordResetTokenNotFoundError:
    """Raised when a password reset token is not found."""


class InvalidPasskeyRegistrationCredentialError:
    """Raised when the passkey registration credential is invalid."""


class InvalidPasskeyAuthenticationCredentialError:
    """Raised when the passkey authentication credential is invalid."""


class WebAuthnChallengeNotFoundError:
    """Raised when a WebAuthn challenge is not found."""


class SessionNotFoundError:
    """Raised when a session is not found."""


class WebAuthnCredentialNotFoundError:
    """Raised when a WebAuthn credential is not found."""


class AccountNotFoundError:
    """Raised when an account is not found."""


class InsufficientAuthProvidersError:
    """Raised when the user has insufficient auth providers remaining."""


class TwoFactorAuthenticationNotEnabledError:
    """Raised when the user's 2FA is not enabled."""


class AuthenticatorNotEnabledError:
    """Raised when the authenticator 2FA method is not enabled."""


class TwoFactorAuthenticationRequiredError:
    """Raised when the user's 2FA is required."""


class TwoFactorAuthenticationChallengeNotFoundError:
    """Raised when a 2FA challenge is not found."""
