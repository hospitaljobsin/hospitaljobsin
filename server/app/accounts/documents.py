from datetime import date, datetime
from typing import Annotated

from beanie import Document, Indexed, Link
from pydantic import BaseModel, Field, HttpUrl


class Account(Document):
    email: Annotated[str, Indexed(unique=True)]
    email_verified: bool = False
    password_hash: str
    has_onboarded: str
    updated_at: datetime | None
    profile: Link["Profile"] | None = None

    class Settings:
        name = "accounts"


class EmailVerification(Document):
    account: Link[Account]
    verification_token_hash: str
    expires_at: datetime

    class Settings:
        name = "email_verifications"


# Address Schema
class Address(BaseModel):
    line1: str
    line2: str | None = None
    city: str
    state: str
    country: str
    pincode: str


# Education Schema
class Education(BaseModel):
    type: str = Field(
        ..., pattern="^(Doctorate|Master's|Bachelor's|Associate's|High School|Other)$"
    )
    institution_name: str
    course_name: str
    specialization: str | None = None
    course_type: str = Field(..., pattern="^(Full Time|Part Time|Correspondence)$")
    course_start_date: date
    course_end_date: date


# Current Job Schema
class CurrentJob(BaseModel):
    current_organization: str | None = None
    current_salary: float | None = None  # Salary as a numeric value


# Preferences Schema
class Preferences(BaseModel):
    work_location: str = Field(..., pattern="^(Office|Remote|Hybrid)$")
    salary_expectations: float | None = None  # Expected salary in numeric format


# Links Schema
class Links(BaseModel):
    linkedin_url: HttpUrl | None = None
    doctor_specific_sites: list[HttpUrl] | None = None


# Main Job Seeker Profile Document
class Profile(Document):
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    date_of_birth: date
    address: Address
    is_differently_abled: bool
    category: str = Field(..., pattern="^(SC|ST|OBC|General|Other)$")
    education: list[Education]
    current_job: CurrentJob | None = None
    total_job_experience: float  # Total experience in years
    preferences: Preferences
    links: Links | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    account: Link[Account]

    class Settings:
        name = "profiles"  # MongoDB collection name
