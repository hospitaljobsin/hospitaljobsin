from typing import Annotated

from pydantic import BaseModel, Field, model_validator


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
    def validate_range(self) -> "JobSalaryRange":
        if (
            self.min_salary is not None and self.max_salary is not None
        ) and self.min_salary > self.max_salary:
            raise ValueError("min_salary must be less than max_salary")
        return self


class JobExperienceRange(BaseModel):
    min_experience: Annotated[int | None, Field(ge=0, le=100)]
    max_experience: Annotated[int | None, Field(ge=0, le=100)]

    @model_validator(mode="after")
    def validate_range(self) -> "JobExperienceRange":
        if (
            self.min_experience is not None and self.max_experience is not None
        ) and self.min_experience > self.max_experience:
            raise ValueError("min_experience must be less than max_experience")
        return self
