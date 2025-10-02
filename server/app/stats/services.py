from app.jobs.repositories import JobRepo
from app.organizations.repositories import OrganizationRepo
from app.stats.models import Stats


class StatsService:
    def __init__(self, job_repo: JobRepo, organization_repo: OrganizationRepo) -> None:
        self._job_repo = job_repo
        self._organization_repo = organization_repo

    async def get(self) -> Stats:
        (
            total_jobs,
            total_vacancies,
        ) = await self._job_repo.get_active_and_vacancies_count()
        total_organizations = await self._organization_repo.get_all_count()

        return Stats(
            total_organizations=total_organizations,
            total_jobs=total_jobs,
            total_vacancies=total_vacancies,
        )
