from datetime import UTC, date, datetime
from typing import TYPE_CHECKING, Annotated, ClassVar, Literal

import pymongo
from beanie import BackLink, Document, Indexed, Link
from pydantic import BaseModel, Field
from pymongo import IndexModel

from app.base.models import GeoObject
from app.core.constants import (
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


# ENUMS
Gender = Literal["MALE", "FEMALE", "OTHER"]
MaritalStatus = Literal["MARRIED", "SINGLE"]
LanguageProficiencyEnum = Literal["NATIVE", "PROFESSIONAL", "BASIC"]
LicenseVerificationStatusEnum = Literal["pending", "verified", "rejected"]


# EDUCATION
class Education(BaseModel):
    degree: str = Field(..., description="The degree of the education.")
    institution: str = Field(..., description="The institution of the education.")
    started_at: date = Field(..., description="When the education started.")
    completed_at: date | None = Field(None, description="When the education ended.")


# LICENSE
class License(BaseModel):
    name: str = Field(..., description="The name of the license.")
    issuer: str = Field(..., description="The issuer of the license.")
    license_number: str = Field(..., description="The license number.")
    registration_year: int = Field(
        ..., description="The year the license was registered."
    )
    verification_status: LicenseVerificationStatusEnum = Field(
        ..., description="The verification status of the license."
    )
    verified_at: date | None = Field(None, description="When the license was verified.")
    verification_notes: str | None = Field(
        None, description="The notes from the verification."
    )


# LANGUAGE (update to use enum)
class Language(BaseModel):
    name: str = Field(..., description="The name of the language.")
    proficiency: LanguageProficiencyEnum = Field(
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
    employment_type: str | None = Field(
        None, description="The type of employment (full-time, part-time, etc.)."
    )
    skills: list[str] = Field(..., description="The skills of the work experience.")


# SALARY EXPECTATIONS
class SalaryExpectations(BaseModel):
    preferred_monthly_salary_inr: int
    negotiable: bool


# CERTIFICATION
class Certification(BaseModel):
    name: str = Field(..., description="The name of the certification.")
    issuer: str = Field(..., description="The issuer of the certification.")
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
    gender: Gender | None = None
    date_of_birth: date | None = None
    address: str | None = None
    marital_status: MaritalStatus | None = None
    category: str | None = None
    locations_open_to_work: list[Location] = []
    open_to_relocation_anywhere: bool
    education: list[Education]
    licenses: list[License]
    languages: list[Language]
    job_preferences: list[str]
    work_experience: list[WorkExperience]
    total_work_experience_years: float = 0.0
    salary_expectations: SalaryExpectations | None
    certifications: list[Certification]
    professional_summary: str | None = None
    headline: str | None = None

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
                self.work_experience,
                self.education,
                (self.locations_open_to_work or self.open_to_relocation_anywhere),
                self.professional_summary,
                self.headline,
            ]
        )

    def __str__(self) -> str:
        """LLM friendly text representation of a job."""
        return self.model_dump_json(exclude={"embedding", "account", "updated_at"})


class Account(Document):
    full_name: str
    email: Annotated[str, Indexed(unique=True)]
    password_hash: str | None = None
    two_factor_secret: str | None = None
    updated_at: datetime | None = None

    avatar_url: str | None = None

    auth_providers: list[AuthProvider]

    profile: Link[Profile] | None = None

    webauthn_credentials: list[BackLink["WebAuthnCredential"]] = Field(  # type: ignore[call-overload]
        original_field="account"
    )
    oauth_credentials: list[BackLink["OAuthCredential"]] = Field(  # type: ignore[call-overload]
        original_field="account"
    )

    recovery_codes: list[BackLink["RecoveryCode"]] = Field(original_field="account")  # type: ignore[call-overload]

    temporary_two_factor_challenges: list[BackLink["TemporaryTwoFactorChallenge"]] = (
        Field(original_field="account")  # type: ignore[call-overload]
    )

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
