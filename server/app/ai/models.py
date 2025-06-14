import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class JobOutlineInput(BaseModel):
    outline: str


class JobOutlineParsed(BaseModel):
    role: str = Field(..., description="The job role/title parsed from the outline.")
    vacancies: int | None = Field(
        None,
        description="The number of vacancies parsed from the outline, if specified.",
    )
    additional_attributes: dict[str, str] | None = Field(
        None,
        description="Any additional structured attributes parsed from the outline.",
    )


class KickoffResponse(BaseModel):
    kickoff_id: uuid.UUID


class JobResultData(BaseModel):
    organizationId: str = Field(
        ..., description="The ID of the organization to create the job under."
    )
    title: str = Field(..., description="The title of the job.")
    description: str = Field(..., description="The description of the job.")
    skills: list[str] = Field(..., description="The skills required for the job.")
    externalApplicationUrl: str | None = Field(
        None, description="The external application URL for the job."
    )
    location: str | None = Field(None, description="The location of the job.")
    vacancies: int | None = Field(
        None, description="The number of vacancies for the job."
    )
    minSalary: int | None = Field(None, description="The minimum salary of the job.")
    maxSalary: int | None = Field(None, description="The maximum salary of the job.")
    minExperience: int | None = Field(
        None, description="The minimum experience required for the job."
    )
    maxExperience: int | None = Field(
        None, description="The maximum experience required for the job."
    )
    expiresAt: datetime | None = Field(
        None, description="The expiration date of the job posting."
    )
    jobType: str | None = Field(
        None, description="The type of the job (e.g., full-time, part-time, contract)."
    )
    workMode: str | None = Field(
        None, description="The work mode of the job (e.g., onsite, remote, hybrid)."
    )
    currency: str = Field(
        default="INR", description="The currency for the job's salary (default: INR)."
    )


class JobStatusResponse(BaseModel):
    kickoff_id: uuid.UUID
    status: str
    result: JobResultData | None = None
