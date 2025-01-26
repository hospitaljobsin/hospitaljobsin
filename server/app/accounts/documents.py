from datetime import date, datetime, timedelta
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
    email_verified: bool = False
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
        return datetime.utcnow() >= (
            self.id.generation_time
            + timedelta(seconds=EMAIL_VERIFICATION_TOKEN_COOLDOWN)
        )

    class Settings:
        name = "email_verification_tokens"
