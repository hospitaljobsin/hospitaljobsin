from pydantic import BaseModel

from app.core.constants import JobKindType, WorkModeType


class AlertFilters(BaseModel):
    search_term: str | None = None
    location: str | None = None
    min_experience: int | None = None
    max_experience: int | None = None
    min_salary: int | None = None
    max_salary: int | None = None
    job_type: list[JobKindType] | None = None
    work_mode: list[WorkModeType] | None = None
