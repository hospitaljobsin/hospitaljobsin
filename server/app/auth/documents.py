from datetime import datetime
from typing import Annotated, ClassVar

from beanie import Document, Indexed, Link, PydanticObjectId
from pymongo import IndexModel
from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.documents import Account
from app.lib.constants import OAuthProvider


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
    account: Link[Account]

    class Settings:
        name = "password_reset_tokens"  # MongoDB collection name
        indexes: ClassVar[list[IndexModel]] = [
            # expire password reset tokens after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]


class WebAuthnCredential(Document):
    credential_id: Annotated[bytes, Indexed(unique=True)]
    public_key: bytes
    sign_count: int
    device_type: str
    backed_up: bool

    nickname: str = "My Passkey"

    transports: list[AuthenticatorTransport] | None

    account: Link[Account]

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
