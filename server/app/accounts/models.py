from datetime import UTC, date, datetime
from typing import Annotated

from pydantic import BaseModel, Field, HttpUrl, StringConstraints, field_validator

from app.core.constants import ExperienceEmploymentType, LicenseVerificationStatusType


class LicenseInput(BaseModel):
    name: Annotated[
        str,
        Field(description="The name of the license."),
        StringConstraints(
            min_length=1,
            max_length=200,
            strip_whitespace=True,
        ),
    ]
    issuer: Annotated[
        str,
        Field(description="The issuer of the license."),
        StringConstraints(
            min_length=1,
            strip_whitespace=True,
            max_length=200,
        ),
    ]
    license_number: Annotated[
        str,
        Field(description="The license number."),
        StringConstraints(
            min_length=1,
            strip_whitespace=True,
            max_length=100,
        ),
    ]
    registration_year: int = Field(
        ...,
        description="The year the license was registered.",
        ge=1900,
    )
    verification_status: LicenseVerificationStatusType = Field(
        ..., description="The verification status of the license."
    )
    verified_at: date | None = Field(None, description="When the license was verified.")
    verification_notes: str | None = Field(
        None, description="The notes from the verification."
    )


class EducationInput(BaseModel):
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


class WorkExperienceInput(BaseModel):
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

    @field_validator("started_at")
    @classmethod
    def validate_started_at(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("started_at cannot be in the future")
        return v

    @field_validator("completed_at")
    @classmethod
    def validate_completed_at(cls, v: date | None, info) -> date | None:
        if v is None:
            return v
        if v > date.today():
            raise ValueError("completed_at cannot be in the future")
        started_at = info.data.get("started_at")
        if started_at and v < started_at:
            raise ValueError("completed_at cannot be before started_at")
        return v


class CertificationInput(BaseModel):
    name: str = Field(
        ...,
        description="The name of the certification.",
        max_length=200,
        min_length=1,
    )
    issuer: str = Field(
        ...,
        description="The issuer of the certification.",
        max_length=200,
        min_length=1,
    )
    certification_url: HttpUrl = Field(
        ..., description="The absolute URL of the certification."
    )
    created_at: date = Field(..., description="When the certification was created.")
    expires_at: date | None = Field(None, description="When the certification expires.")
