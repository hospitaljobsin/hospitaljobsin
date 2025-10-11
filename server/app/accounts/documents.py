import hashlib
from datetime import UTC, date, datetime
from typing import Annotated, ClassVar, Literal

import pymongo
from beanie import Document, Indexed, Link
from pydantic import BaseModel, Field, field_validator
from pymongo import IndexModel

from app.base.models import GeoObject
from app.core.constants import (
    AuthProvider,
    ExperienceEmploymentType,
    GenderType,
    JobKindType,
    LanguageProficiencyType,
    LicenseVerificationStatusType,
    MaritalStatusType,
    TwoFactorProvider,
    WorkModeType,
)


# EDUCATION
class Education(BaseModel):
    degree: str = Field(..., description="The degree of the education.")
    institution: str = Field(..., description="The institution of the education.")
    started_at: date = Field(..., description="When the education started.")
    completed_at: date | None = Field(None, description="When the education ended.")

    @field_validator("started_at")
    @classmethod
    def validate_started_at(cls, v: date) -> date:
        if v > datetime.now(tz=UTC).date():
            raise ValueError("started_at cannot be in the future")
        return v

    @field_validator("completed_at")
    @classmethod
    def validate_completed_at(cls, v: date | None, info) -> date | None:
        if v is None:
            return v
        if v > datetime.now(tz=UTC).date():
            raise ValueError("completed_at cannot be in the future")
        started_at = info.data.get("started_at")
        if started_at and v < started_at:
            raise ValueError("completed_at cannot be before started_at")
        return v


# LICENSE
class License(BaseModel):
    name: Annotated[
        str,
        Field(description="The name of the license."),
    ]
    issuer: Annotated[
        str,
        Field(description="The issuer of the license."),
    ]
    license_number: Annotated[
        str,
        Field(description="The license number."),
    ]
    registration_year: int = Field(
        ...,
        description="The year the license was registered.",
    )
    verification_status: LicenseVerificationStatusType = Field(
        ..., description="The verification status of the license."
    )
    verified_at: date | None = Field(None, description="When the license was verified.")
    verification_notes: str | None = Field(
        None, description="The notes from the verification."
    )


# LANGUAGE (update to use enum)
class Language(BaseModel):
    name: str = Field(..., description="The name of the language.")
    proficiency: LanguageProficiencyType = Field(
        ..., description="The proficiency level of the language."
    )


# WORK EXPERIENCE
class WorkExperience(BaseModel):
    title: str = Field(..., description="The title of the work experience.")
    description: str | None = Field(
        None, description="The description of the work experience."
    )
    organization: str = Field(
        ..., description="The organization of the work experience."
    )
    started_at: date = Field(..., description="When the work experience started.")
    completed_at: date | None = Field(
        None, description="When the work experience ended."
    )
    employment_type: ExperienceEmploymentType | None = Field(
        None, description="The type of employment (full-time, part-time, etc.)."
    )
    skills: list[str] = Field(..., description="The skills of the work experience.")


class CareerProfile(BaseModel):
    current_industry: str | None = None
    desired_job_types: list[JobKindType] = []
    desired_work_modes: list[WorkModeType] = []
    expected_salary: float | None = None
    locations_open_to_work: list[str] = Field(
        default_factory=list,
        description="The locations the candidate prefers to work in.",
    )
    open_to_relocation_anywhere: bool = Field(
        default=False,
        description="Whether the candidate is open to relocation anywhere.",
    )


# CERTIFICATION
class Certification(BaseModel):
    name: str = Field(
        ...,
        description="The name of the certification.",
    )
    issuer: str = Field(
        ...,
        description="The issuer of the certification.",
    )
    certification_url: str = Field(
        ..., description="The absolute URL of the certification."
    )
    created_at: date = Field(..., description="When the certification was created.")
    expires_at: date | None = Field(None, description="When the certification expires.")


class Location(BaseModel):
    name: str
    geo: GeoObject


class BaseProfile(BaseModel):
    # personal details
    gender: GenderType | None = None
    date_of_birth: date | None = None
    address: str | None = None
    marital_status: MaritalStatusType | None = None
    category: str | None = None
    education: list[Education]
    licenses: list[License]
    languages: list[Language]
    job_preferences: list[str]
    work_experience: list[WorkExperience]
    total_work_experience_years: float = 0.0
    career_profile: CareerProfile | None = None
    certifications: list[Certification]
    professional_summary: str | None = None
    headline: str | None = None
    resume_url: str | None = None

    def __str__(self) -> str:
        """LLM friendly text representation of a job."""
        return self.model_dump_json()


# Main Job Seeker Profile Document
# AKA Reusable Resume
class Profile(BaseProfile, Document):
    embedding: list[float] | None = Field(default=None, repr=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "profiles"  # MongoDB collection name

    @property
    def is_complete(self) -> bool:
        """Checks if the profile has the minimum required information to apply for a job."""
        return all(
            [
                self.date_of_birth,
                self.address,
                (
                    self.career_profile
                    and (
                        self.career_profile.locations_open_to_work
                        or self.career_profile.open_to_relocation_anywhere
                    )
                ),
                self.headline,
                self.resume_url,
            ]
        )

    @property
    def progress_percentage(self) -> int:
        """Calculates the profile completion percentage based on filled fields."""
        total_fields = 8  # Total number of key fields to check
        filled_fields = sum(
            [
                bool(self.date_of_birth),
                bool(self.address),
                bool(self.work_experience),
                bool(self.education),
                bool(
                    self.career_profile
                    and (
                        self.career_profile.locations_open_to_work
                        or self.career_profile.open_to_relocation_anywhere
                    )
                ),
                bool(self.professional_summary),
                bool(self.headline),
            ]
        )
        return int((filled_fields / total_fields) * 100)

    def __str__(self) -> str:
        """LLM friendly text representation of a job."""
        return self.model_dump_json(exclude={"embedding", "account", "updated_at"})


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

    profile: Link[Profile] | None = None

    terms_and_policy: TermsAndPolicy

    analytics_preference: AnalyticsPreference

    whatsapp_job_alerts_enabled: bool = False

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
