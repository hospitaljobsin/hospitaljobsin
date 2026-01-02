import hashlib
from datetime import UTC, datetime
from typing import Annotated, ClassVar, Literal

import pymongo
from beanie import Document, Indexed
from pydantic import BaseModel, Field
from pymongo import IndexModel

from app.core.constants import (
    AuthProvider,
    TwoFactorProvider,
)


class TermsAndPolicy(BaseModel):
    """Terms and privacy policy acceptance information."""

    type: Literal["acceptance", "rejection", "undecided"]
    updated_at: datetime
    version: str


class AnalyticsPreference(BaseModel):
    """Opt-in analytics cookies preference information."""

    type: Literal["acceptance", "rejection", "undecided"]
    updated_at: datetime


class Account(Document):
    full_name: str
    email: Annotated[str, Indexed(unique=True)]
    phone_number: str | None = None
    password_hash: str | None = None
    two_factor_secret: str | None = None
    updated_at: datetime | None = None

    internal_avatar_url: str | None = Field(default=None, alias="avatar_url")

    auth_providers: list[AuthProvider]

    terms_and_policy: TermsAndPolicy

    analytics_preference: AnalyticsPreference

    @property
    def avatar_url(self) -> str:
        """Return the account's avatar URL, or a placeholder."""
        if self.internal_avatar_url is not None:
            return self.internal_avatar_url
        seed_hash = hashlib.md5(self.full_name.encode()).hexdigest()
        return f"https://api.dicebear.com/9.x/shapes/png?seed={seed_hash}"

    @avatar_url.setter
    def avatar_url(self, value: str | None) -> None:
        """Set the internal avatar URL."""
        self.internal_avatar_url = value

    @property
    def has_2fa_enabled(self) -> bool:
        """Whether two-factor authentication is enabled for the account."""
        # our only 2FA provider is authenticator for now, so we just check if the secret is set
        return self.two_factor_secret is not None

    @property
    def two_factor_providers(self) -> list[TwoFactorProvider]:
        """The two-factor authentication providers enabled for the account."""
        providers: list[TwoFactorProvider] = []
        if self.two_factor_secret:
            providers.append("authenticator")
        return providers

    class Settings:
        name = "accounts"
        indexes: ClassVar[list[IndexModel]] = [
            IndexModel(
                [
                    ("name", pymongo.TEXT),
                ],
                name="account_name_text_index",
                default_language="english",
            ),
        ]


class EmailVerificationToken(Document):
    email: Annotated[str, Indexed(unique=True)]
    token_hash: Annotated[str, Indexed()]
    expires_at: datetime

    @property
    def is_expired(self) -> bool:
        """Check if the token is expired."""
        return datetime.now(UTC) >= (self.expires_at.replace(tzinfo=UTC))

    class Settings:
        name = "email_verification_tokens"
        indexes: ClassVar[list[IndexModel]] = [
            # expire verification tokens after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]


class PhoneNumberVerificationToken(Document):
    phone_number: Annotated[str, Indexed(unique=True)]
    token_hash: Annotated[str, Indexed()]
    expires_at: datetime

    @property
    def is_expired(self) -> bool:
        """Check if the token is expired."""
        return datetime.now(UTC) >= (self.expires_at.replace(tzinfo=UTC))

    class Settings:
        name = "phone_number_verification_tokens"
        indexes: ClassVar[list[IndexModel]] = [
            # expire verification tokens after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]
