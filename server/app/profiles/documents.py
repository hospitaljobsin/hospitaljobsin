from datetime import date, datetime
from typing import Annotated, List, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, Field, HttpUrl


# Address Schema
class Address(BaseModel):
    line1: str
    line2: Optional[str] = None
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
    specialization: Optional[str] = None
    course_type: str = Field(..., pattern="^(Full Time|Part Time|Correspondence)$")
    course_start_date: date
    course_end_date: date


# Current Job Schema
class CurrentJob(BaseModel):
    current_organization: Optional[str] = None
    current_salary: Optional[float] = None  # Salary as a numeric value


# Preferences Schema
class Preferences(BaseModel):
    work_location: str = Field(..., pattern="^(Office|Remote|Hybrid)$")
    salary_expectations: Optional[float] = None  # Expected salary in numeric format


# Links Schema
class Links(BaseModel):
    linkedin_url: Optional[HttpUrl] = None
    doctor_specific_sites: Optional[List[HttpUrl]] = None


# Main Job Seeker Profile Document
class JobSeekerProfile(Document):
    user_id: Annotated[str, Indexed(unique=True)]
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    date_of_birth: date
    address: Address
    is_differently_abled: bool
    category: str = Field(..., pattern="^(SC|ST|OBC|General|Other)$")
    education: List[Education]
    current_job: Optional[CurrentJob] = None
    total_job_experience: float  # Total experience in years
    preferences: Preferences
    links: Optional[Links] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "job_seeker_profiles"  # MongoDB collection name
