import uuid

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
    """Data model for job generation results."""

    title: str
    description: str
    requirements: list[str]
    responsibilities: list[str]
    location: str
    salary_range: str
    employment_type: str
    benefits: list[str]


class JobStatusResponse(BaseModel):
    kickoff_id: uuid.UUID
    status: str
    result: JobResultData | None = None


class ProfileMatch(BaseModel):
    """Data model for a matched profile."""

    applicant_id: str = Field(..., description="The ID of the matched job applicant")
    score: float = Field(..., description="The match score")
    summary: str = Field(..., description="A one-sentence summary of the match.")
    match_reasons: list[str] = Field(..., description="Reasons for the match")
    mismatched_fields: list[str] = Field(..., description="Fields that do not match")
    match_type: str = Field(..., description="The type of match")


class FilterJobResultData(BaseModel):
    """Data model for filter job results."""

    matches: list[ProfileMatch]
    total_matches: int = Field(..., description="Total number of matches found")
    query: str = Field(..., description="Original query used for filtering")
    execution_time: float = Field(
        ..., description="Time taken to execute the filter in seconds"
    )
