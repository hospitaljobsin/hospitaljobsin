from typing import Annotated, Self

from pydantic import BaseModel, Field, model_validator

from app.base.models import GeoObject


class JobApplicantAnalysisEventBody(BaseModel):
    account_id: str
    job_id: str


class JobAutocompleteSuggestion(BaseModel):
    job_id: str
    display_name: str


class JobSalaryRange(BaseModel):
    min_salary: Annotated[int | None, Field(ge=0)]
    max_salary: Annotated[int | None, Field(ge=0)]

    @model_validator(mode="after")
    def validate_range(self) -> Self:
        if (
            self.min_salary is not None and self.max_salary is not None
        ) and self.min_salary > self.max_salary:
            raise ValueError("min_salary must be less than max_salary")
        return self


class JobExperienceRange(BaseModel):
    min_experience: Annotated[int | None, Field(ge=0, le=100)]
    max_experience: Annotated[int | None, Field(ge=0, le=100)]

    @model_validator(mode="after")
    def validate_range(self) -> Self:
        if (
            self.min_experience is not None and self.max_experience is not None
        ) and self.min_experience > self.max_experience:
            raise ValueError("min_experience must be less than max_experience")
        return self


# Map clustering models


class JobClusterFilters(BaseModel):
    """Common filters for job clustering queries."""

    search_term: str | None = None
    location: str | None = None
    work_mode: list[str] = Field(default_factory=list)
    job_type: list[str] = Field(default_factory=list)
    proximity_km: float | None = None
    min_experience: int | None = None
    max_experience: int | None = None
    min_salary: int | None = None
    max_salary: int | None = None


class SalaryRange(BaseModel):
    """Salary range for a cluster of jobs."""

    min_salary: int | None = None
    max_salary: int | None = None


class JobCluster(BaseModel):
    """Aggregated job cluster at a specific H3 hexagon."""

    h3_index: str
    count: int
    center: GeoObject
    bounds: list[list[float]]
