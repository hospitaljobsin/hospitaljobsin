from app.lib.constants import AuthProvider


class EmailInUseError:
    """Raised when an user with an email address already exists."""

    pass


class InvalidEmailError:
    """Raised when an invalid email address is provided."""

    def __init__(self, message: str) -> None:
        self.message = message


class InvalidCredentialsError:
    """Raised when an user provides invalid credentials."""

    pass


class InvalidPasswordResetTokenError:
    """Raised when an invalid password reset token is provided."""

    pass


class EmailVerificationTokenCooldownError:
    """Raised when an user tries to request a new email verification token too soon."""

    remaining_seconds: int

    def __init__(self, remaining_seconds: int):
        self.remaining_seconds = remaining_seconds


class InvalidEmailVerificationTokenError:
    """Raised when an invalid email verification token is provided."""

    pass


class InvalidRecaptchaTokenError:
    """Raised when an invalid recaptcha token is provided."""

    pass


class PasswordNotStrongError:
    """Raised when the provided password is not strong enough."""

    pass


class InvalidSignInMethodError:
    """Raised when the user tries an invalid sign in method (occurs when users
    sign in via Oauth2/ passkeys and try to login with their password)."""

    available_providers: list[AuthProvider]

    def __init__(self, available_providers: list[AuthProvider]):
        self.available_providers = available_providers


class PasswordResetTokenNotFoundError:
    """Raised when a password reset token is not found."""

    pass


class InvalidPasskeyRegistrationCredentialError:
    """Raised when the passkey registration credential is invalid."""

    pass


class InvalidPasskeyAuthenticationCredentialError:
    """Raised when the passkey authentication credential is invalid."""

    pass


class WebAuthnChallengeNotFoundError:
    """Raised when a WebAuthn challenge is not found."""

    pass


class SessionNotFoundError:
    """Raised when a session is not found."""

    pass


class WebAuthnCredentialNotFoundError:
    """Raised when a WebAuthn credential is not found."""

    pass


class AccountNotFoundError:
    """Raised when an account is not found."""

    pass


class InsufficientAuthProvidersError:
    """Raised when the user has insufficient auth providers remaining."""

    pass
