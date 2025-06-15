from datetime import UTC, date, datetime
from typing import TYPE_CHECKING, Annotated, ClassVar, Literal

import pymongo
from beanie import BackLink, Document, Indexed, Link
from pydantic import BaseModel, Field
from pymongo import IndexModel

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
GenderEnum = Literal["MALE", "FEMALE", "OTHER"]
MaritalStatusEnum = Literal["MARRIED", "SINGLE"]
LanguageProficiencyEnum = Literal["NATIVE", "PROFESSIONAL", "BASIC"]
LicenseVerificationStatusEnum = Literal["pending", "verified", "rejected"]


# EDUCATION
class Education(BaseModel):
    degree: str
    institution: str
    started_at: date
    completed_at: date | None = None


# LICENSE
class License(BaseModel):
    name: str
    issuer: str
    license_number: str
    issued_at: date
    expires_at: date
    verification_status: LicenseVerificationStatusEnum
    verified_at: date | None = None
    verification_notes: str | None = None


# LANGUAGE (update to use enum)
class Language(BaseModel):
    name: str
    proficiency: LanguageProficiencyEnum


# WORK EXPERIENCE
class WorkExperience(BaseModel):
    title: str
    organization: str
    start_date: date
    end_date: date | None = None
    employment_type: str
    department_experience: list[str]


# SKILL EXPERIENCE
class SkillExperience(BaseModel):
    organization: str
    title: str
    start_date: date
    end_date: date | None = None


# SKILL
class Skill(BaseModel):
    skill: str
    yoe_total: float
    experiences: list[SkillExperience]


# SALARY EXPECTATIONS
class SalaryExpectations(BaseModel):
    preferred_monthly_salary_inr: int
    negotiable: bool


# CERTIFICATION
class Certification(BaseModel):
    name: str
    issuer: str
    certification_url: str
    created_at: date
    expires_at: date | None = None


# Main Job Seeker Profile Document
# AKA Reusable Resume
class Profile(Document):
    account: BackLink["Account"] = Field(  # type: ignore[call-overload]
        original_field="profile",
    )
    # personal details
    gender: GenderEnum | None
    date_of_birth: date | None
    address: str
    marital_status: MaritalStatusEnum | None
    category: str | None
    locations_open_to_work: list[str]
    open_to_relocation_anywhere: bool
    education: list[Education]
    licenses: list[License]
    languages: list[Language]
    job_preferences: list[str]
    work_experience: list[WorkExperience]
    skills: list[Skill]
    salary_expectations: SalaryExpectations | None
    certifications: list[Certification]
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

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
