from datetime import UTC, date, datetime, timedelta
from time import timezone
from typing import Annotated, Literal

from beanie import BackLink, Document, Indexed, Link
from pydantic import BaseModel, Field

from app.base.models import Address
from app.lib.constants import EMAIL_VERIFICATION_TOKEN_COOLDOWN


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
    password_hash: str
    has_onboarded: bool
    updated_at: datetime | None = None
    profile: Link["Profile"] | None = None

    class Settings:
        name = "accounts"


class EmailVerificationToken(Document):
    email: Annotated[str, Indexed(unique=True)]
    token_hash: Annotated[str, Indexed()]
    expires_at: datetime

    @property
    def is_expired(self) -> bool:
        """Check if the token is expired."""
        return datetime.utcnow() >= (self.expires_at)

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
