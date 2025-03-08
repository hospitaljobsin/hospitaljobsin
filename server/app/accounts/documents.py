from datetime import UTC, date, datetime, timedelta
from typing import TYPE_CHECKING, Annotated, ClassVar, Literal

from beanie import BackLink, Document, Indexed, Link
from pydantic import BaseModel, Field
from pymongo import IndexModel

from app.base.models import Address
from app.lib.constants import (
    EMAIL_VERIFICATION_TOKEN_COOLDOWN,
    AuthProvider,
    TwoFactorProvider,
)

if TYPE_CHECKING:
    from app.auth.documents import (
        OAuthCredential,
        RecoveryCode,
        TemporaryTwoFactorChallenge,
        WebAuthnCredential,
    )
    from app.organizations.documents import OrganizationMember


# Current Job Schema
class CurrentJob(BaseModel):
    current_title: str
    current_organization: str | None = None
    current_salary: float | None = None  # Salary as a numeric value


# Links Schema
class Language(BaseModel):
    name: str
    proficiency: str


# Main Job Seeker Profile Document
class Profile(Document):
    # personal edetails
    gender: Literal["MALE", "FEMALE", "OTHER"] | None
    date_of_birth: date | None
    address: Address
    marital_status: Literal["MARRIED", "SINGLE"] | None
    category: str | None
    languages: list[Language]

    # employment details
    total_job_experience: float | None  # Total experience in years
    current_job: CurrentJob | None

    updated_at: datetime = Field(default_factory=datetime.utcnow)
    account: BackLink["Account"] = Field(
        original_field="profile",
    )

    class Settings:
        name = "profiles"  # MongoDB collection name


class Account(Document):
    full_name: str
    email: Annotated[str, Indexed(unique=True)]
    password_hash: str | None = None
    two_factor_secret: str | None = None
    updated_at: datetime | None = None

    auth_providers: list[AuthProvider]

    profile: Link["Profile"] | None = None

    memberships: list[BackLink["OrganizationMember"]] = Field(original_field="account")
    webauthn_credentials: list[BackLink["WebAuthnCredential"]] = Field(
        original_field="account"
    )
    oauth_credentials: list[BackLink["OAuthCredential"]] = Field(
        original_field="account"
    )

    recovery_codes: list[BackLink["RecoveryCode"]] = Field(original_field="account")

    temporary_two_factor_challenges: list[BackLink["TemporaryTwoFactorChallenge"]] = (
        Field(original_field="account")
    )

    @property
    def has_2fa_enabled(self) -> bool:
        """Whether two-factor authentication is enabled for the account."""
        # our only 2FA provider is authenticator for now, so we just check if the secret is set
        return self.two_factor_secret is not None

    @property
    def two_factor_providers(self) -> list[TwoFactorProvider]:
        """The two-factor authentication providers enabled for the account."""
        providers = []
        if self.two_factor_secret:
            providers.append("authenticator")
        return providers

    class Settings:
        name = "accounts"


class EmailVerificationToken(Document):
    email: Annotated[str, Indexed(unique=True)]
    token_hash: Annotated[str, Indexed()]
    expires_at: datetime

    @property
    def is_expired(self) -> bool:
        """Check if the token is expired."""
        return datetime.now(UTC) >= (self.expires_at.replace(tzinfo=UTC))

    @property
    def is_cooled_down(self) -> bool:
        """Check if the token is cooled down."""
        # Get the current time as an aware datetime in UTC
        current_time = datetime.now(UTC)
        # Ensure generation_time is aware (assuming it's stored in UTC)
        generation_time_aware = self.id.generation_time.replace(tzinfo=UTC)
        cooldown_time = generation_time_aware + timedelta(
            seconds=EMAIL_VERIFICATION_TOKEN_COOLDOWN
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
            seconds=EMAIL_VERIFICATION_TOKEN_COOLDOWN
        )

        remaining = (cooldown_time - current_time).total_seconds()
        return max(0, int(remaining))  # Ensure non-negative integer

    class Settings:
        name = "email_verification_tokens"
        indexes: ClassVar[list[IndexModel]] = [
            # expire verification tokens after they cross the expiration timestamp
            IndexModel(
                "expires_at",
                expireAfterSeconds=0,
            ),
        ]
