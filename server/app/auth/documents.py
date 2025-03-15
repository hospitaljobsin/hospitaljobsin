from datetime import UTC, datetime, timedelta
from typing import Annotated, ClassVar

from beanie import Document, Indexed, Link, PydanticObjectId
from pymongo import IndexModel
from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.documents import Account
from app.core.constants import (
    PASSWORD_RESET_TOKEN_COOLDOWN,
    OAuthProvider,
)


class Session(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    user_agent: str
    ip_address: str
    expires_at: datetime
    account: Link[Account]

    class Settings:
        name = "sessions"  # MongoDB collection name


class PasswordResetToken(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    expires_at: datetime
    account: Annotated[
        Link[Account],
        Indexed(
            unique=True,
        ),
    ]

    class Settings:
        name = "password_reset_tokens"  # MongoDB collection name
        indexes: ClassVar[list[IndexModel]] = [
            # expire password reset tokens after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]

    @property
    def is_cooled_down(self) -> bool:
        """Check if the token is cooled down."""
        # Get the current time as an aware datetime in UTC
        current_time = datetime.now(UTC)
        # Ensure generation_time is aware (assuming it's stored in UTC)
        generation_time_aware = self.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=PASSWORD_RESET_TOKEN_COOLDOWN
        )
        return current_time >= cooldown_time

    @property
    def cooldown_remaining_seconds(self) -> int:
        """
        Calculate remaining cooldown seconds.

        Returns 0 if cooldown has passed or token is invalid.
        """
        if self.is_cooled_down:
            return 0

        current_time = datetime.now(UTC)
        generation_time_aware = self.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=PASSWORD_RESET_TOKEN_COOLDOWN
        )

        remaining = (cooldown_time - current_time).total_seconds()
        return max(0, int(remaining))  # Ensure non-negative integer


class WebAuthnCredential(Document):
    credential_id: Annotated[bytes, Indexed(unique=True)]
    public_key: bytes
    sign_count: int
    device_type: str
    backed_up: bool

    nickname: str = "My Passkey"

    transports: list[AuthenticatorTransport] | None

    account: Link[Account]

    last_used_at: datetime

    class Settings:
        name = "webauthn_credentials"  # MongoDB collection name


class WebAuthnChallenge(Document):
    challenge: Annotated[bytes, Indexed(unique=True)]
    generated_account_id: PydanticObjectId
    expires_at: datetime

    class Settings:
        name = "webauthn_challenges"  # MongoDB collection name
        indexes: ClassVar[list[IndexModel]] = [
            # expire webauthn challenges after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]


class OAuthCredential(Document):
    provider: Annotated[OAuthProvider, Indexed()]  # e.g., "google"
    provider_user_id: str  # unique id from the provider
    account: Link[Account]

    class Settings:
        name = "oauth_credentials"


class TwoFactorAuthenticationChallenge(Document):
    challenge_hash: str
    expires_at: datetime
    totp_secret: str
    account: Link[Account]

    class Settings:
        name = "two_factor_authentication_challenges"  # MongoDB collection name
        indexes: ClassVar[list[IndexModel]] = [
            # expire webauthn challenges after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]


class RecoveryCode(Document):
    code_hash: str
    account: Link[Account]

    class Settings:
        name = "recovery_codes"  # MongoDB collection name


class TemporaryTwoFactorChallenge(Document):
    """Temporary 2FA challenge used for 2FA password resets."""

    challenge_hash: Indexed(str, unique=True)
    expires_at: datetime
    account: Link[Account]
    password_reset_token: Link[PasswordResetToken]

    class Settings:
        name = "temporary_two_factor_challenges"  # MongoDB collection name
        indexes: ClassVar[list[IndexModel]] = [
            # Automatically expire challenges after expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]
