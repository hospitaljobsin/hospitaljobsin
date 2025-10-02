from pydantic import BaseModel


class Stats(BaseModel):
    total_vacancies: int
    total_organizations: int
    total_jobs: int
