from datetime import date

from beanie import PydanticObjectId, WriteRules
from beanie.operators import In

from app.companies.documents import Company
from app.database.paginator import PaginatedResult, Paginator

from .documents import Job


class JobRepo:
    async def create(
        self,
        title: str,
        description: str,
        location: str,
        salary: str,
        closing_date: date,
        company: Company,
    ) -> Job:
        """Create a new job."""
        job = Job(
            title=title,
            description=description,
            location=location,
            salary=salary,
            closing_date=closing_date,
            company=company,
        )

        return await job.insert(
            link_rule=WriteRules.DO_NOTHING,
        )

    async def get(self, job_id: str) -> Job | None:
        """Get job by ID."""
        return await Job.get(job_id)

    async def update(
        self,
        job: Job,
        *,
        title: str,
        description: str,
        location: str,
        salary: str,
        closing_date: date,
    ) -> Job:
        """Update the given job."""
        job.title = title
        job.description = description
        job.location = location
        job.salary = salary
        job.closing_date = closing_date
        return await job.save()

    async def get_many_by_ids(self, job_ids: list[str]) -> list[Job | None]:
        """Get multiple jobs by IDs."""
        jobs = await Job.find(In(Job.id, job_ids)).to_list()
        job_by_id = {job.id: job for job in jobs}

        return [job_by_id.get(PydanticObjectId(job_id)) for job_id in job_ids]

    async def get_all(
        self,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, str]:
        """Get a paginated result of jobs."""

        paginator: Paginator[Job, str] = Paginator(
            reverse=True,
            document_cls=Job,
        )

        return await paginator.paginate(
            search_criteria=Job.find(),
            first=first,
            last=last,
            before=before,
            after=after,
        )

    async def delete(self, job: Job) -> None:
        """Delete a job by ID."""
        await job.delete()
