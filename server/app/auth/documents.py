from datetime import datetime
from typing import Annotated

from beanie import Document, Indexed, Link, PydanticObjectId
from pymongo import IndexModel
from webauthn.helpers.structs import AuthenticatorTransport

from app.accounts.documents import Account


class Session(Document):
    token_hash: Annotated[str, Indexed(unique=True)]
    user_agent: str
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
        indexes = [
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
        indexes = [
            # expire webauthn challenges after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]
