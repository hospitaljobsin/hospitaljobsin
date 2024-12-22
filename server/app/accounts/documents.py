from datetime import date, datetime
from typing import Annotated, Literal

from beanie import BackLink, Document, Indexed, Link
from pydantic import BaseModel, Field

from app.base.models import Address


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
    gender: Literal["male", "female", "other"]
    date_of_birth: date
    address: Address
    marital_status: Literal["married", "single"]
    category: Literal["SC", "ST", "OBC", "general", "other"]
    languages: list[Language]

    # employment details
    total_job_experience: float  # Total experience in years
    current_job: CurrentJob | None = None

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


class EmailVerification(Document):
    account: Link[Account]
    verification_token_hash: Annotated[str, Indexed(unique=True)]
    expires_at: datetime

    class Settings:
        name = "email_verifications"
