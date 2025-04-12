import secrets
from datetime import datetime
from typing import Literal

from beanie import DeleteRules, PydanticObjectId, WriteRules
from beanie.operators import And, In
from bson import ObjectId

from app.accounts.documents import Account
from app.base.models import Address
from app.core.constants import JobApplicationStatus
from app.database.paginator import PaginatedResult, Paginator
from app.organizations.documents import Organization

from .documents import (
    ApplicationField,
    Job,
    JobApplication,
    JobApplicationForm,
    SavedJob,
)


class JobRepo:
    async def generate_slug(self, title: str) -> str:
        """Generate a slug from the job title."""
        slug = title.lower().replace(" ", "-")
        if await self.get_by_slug(slug):
            suffix = secrets.token_urlsafe(8)
            while await self.get_by_slug(f"{slug}-{suffix}"):
                suffix = secrets.token_urlsafe(8)
            slug = f"{slug}-{suffix}"
        return slug

    async def create(
        self,
        *,
        organization: Organization,
        title: str,
        description: str,
        address: Address,
        vacancies: int | None = None,
        min_salary: int | None = None,
        max_salary: int | None = None,
        min_experience: int | None = None,
        max_experience: int | None = None,
        expires_at: datetime | None = None,
        job_type: Literal["full_time", "part_time", "internship", "contract"]
        | None = None,
        work_mode: Literal["hybrid", "remote", "office"] | None = None,
        skills: list[str] = [],
        currency: Literal["INR"] = "INR",
    ) -> Job:
        """Create a new job."""
        job = Job(
            title=title,
            description=description,
            vacancies=vacancies,
            address=address,
            min_salary=min_salary,
            max_salary=max_salary,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            organization=organization.id,
            type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
            slug=await self.generate_slug(title),
            is_active=False,
        )

        return await job.insert(
            link_rule=WriteRules.DO_NOTHING,
        )

    async def update(
        self,
        *,
        job: Job,
        title: str,
        description: str,
        address: Address,
        vacancies: int | None = None,
        min_salary: int | None = None,
        max_salary: int | None = None,
        min_experience: int | None = None,
        max_experience: int | None = None,
        expires_at: datetime | None = None,
        job_type: Literal["full_time", "part_time", "internship", "contract"]
        | None = None,
        work_mode: Literal["hybrid", "remote", "office"] | None = None,
        skills: list[str] = [],
        currency: Literal["INR"] = "INR",
    ) -> Job:
        """Update a job."""
        job.title = title
        job.description = description
        job.vacancies = vacancies
        job.address = address
        job.min_salary = min_salary
        job.max_salary = max_salary
        job.min_experience = min_experience
        job.max_experience = max_experience
        job.expires_at = expires_at
        job.type = job_type
        job.work_mode = work_mode
        job.skills = skills
        job.currency = currency
        job.slug = await self.generate_slug(title)
        return await job.save(link_rule=WriteRules.DO_NOTHING)

    async def get(self, job_id: ObjectId) -> Job | None:
        """Get job by ID."""
        return await Job.get(job_id)

    async def get_by_slug(self, slug: str) -> Job | None:
        """Get job by slug."""
        return await Job.find_one(Job.slug == slug)

    async def update_active(self, job: Job, *, is_active: bool) -> Job:
        """Update the given job."""
        job.is_active = is_active
        return await job.save()

    async def get_many_by_ids(self, job_ids: list[ObjectId]) -> list[Job | None]:
        """Get multiple jobs by IDs."""
        jobs = await Job.find(In(Job.id, job_ids)).to_list()
        job_by_id = {job.id: job for job in jobs}

        return [job_by_id.get(PydanticObjectId(job_id)) for job_id in job_ids]

    async def get_many_by_slugs(self, slugs: list[str]) -> list[Job | None]:
        """Get multiple jobs by IDs."""
        jobs = await Job.find(In(Job.slug, slugs)).to_list()
        job_by_slug = {job.slug: job for job in jobs}

        return [job_by_slug.get(slug) for slug in slugs]

    async def get_all_active(
        self,
        search_term: str | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of active jobs."""
        paginator: Paginator[Job, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = Job.find(Job.is_active == True)  # noqa: E712

        if search_term:
            search_criteria = Job.find(
                Job.is_active == True,  # noqa: E712
                {"$text": {"$search": search_term}},
            )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_by_organization_id(
        self,
        organization_id: ObjectId,
        search_term: str | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of jobs."""
        paginator: Paginator[Job, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = Job.find(Job.organization.id == organization_id)

        if search_term:
            search_criteria = search_criteria.find({"$text": {"$search": search_term}})

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, job: Job) -> None:
        """Delete a job by ID."""
        await job.delete()


class SavedJobRepo:
    async def get(self, account_id: ObjectId, job_id: ObjectId) -> SavedJob | None:
        """Get saved job by account ID and job ID."""
        return await SavedJob.find_one(
            SavedJob.account.id == account_id,
            SavedJob.job.id == job_id,
            fetch_links=True,
            nesting_depth=1,
        )

    async def get_many_by_ids(
        self, job_ids: list[tuple[ObjectId, ObjectId]]
    ) -> list[SavedJob | None]:
        """Get multiple saved jobs by account_id and job_id pairs."""
        # Construct filters based on actual schema paths
        filters = [
            And({"account.$id": account_id}, {"job.$id": job_id})
            for account_id, job_id in job_ids
        ]

        # Use the Or operator to combine all conditions
        jobs = await SavedJob.find({"$or": filters}).to_list()

        # Map jobs by (account_id, job_id) for easy lookup
        job_by_id = {(job.account.ref.id, job.job.ref.id): job for job in jobs}

        # Return jobs in the same order as job_ids
        return [job_by_id.get((account_id, job_id)) for account_id, job_id in job_ids]

    async def get_all_saved(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[SavedJob, ObjectId]:
        """Get a paginated result of saved jobs for the given account."""
        paginator: Paginator[SavedJob, ObjectId] = Paginator(
            reverse=True,
            document_cls=SavedJob,
            paginate_by="job.id",
        )

        search_criteria = SavedJob.find(
            SavedJob.account.id == account_id,
            fetch_links=True,
            nesting_depth=1,
        ).sort(-SavedJob.id)

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def create(self, account_id: ObjectId, job: Job) -> SavedJob:
        """Save the given job under the given account."""
        saved_job = await SavedJob.find_one(
            SavedJob.account.id == account_id,
            SavedJob.job.id == job.id,
            fetch_links=True,
            nesting_depth=1,
        )

        if saved_job is None:
            saved_job = await SavedJob(account=account_id, job=job).save()
        return saved_job

    async def delete(self, saved_job: SavedJob) -> None:
        """Unsave the given job under the given account."""
        await saved_job.delete(link_rule=DeleteRules.DO_NOTHING)


class JobApplicationRepo:
    async def get_count_by_job_id(
        self,
        job_id: ObjectId,
        status: JobApplicationStatus,
    ) -> int:
        """Get the count of applications for a given job ID."""
        return await JobApplication.find(
            JobApplication.job.id == job_id,
            JobApplication.status == status,
        ).count()

    async def create(
        self,
        account: Account,
        job: Job,
        application_fields: list[ApplicationField],
    ) -> JobApplication:
        """Create a new job application."""
        application = JobApplication(
            job=job,
            account=account,
            status="applied",
            application_fields=application_fields,
        )
        return await application.insert(link_rule=WriteRules.DO_NOTHING)


class JobApplicationFormRepo:
    async def get(self, job_id: ObjectId) -> JobApplicationForm | None:
        """Get job application form by job ID."""
        return await JobApplicationForm.find_one(
            JobApplicationForm.job.id == job_id,
        )

    async def create(
        self, job: Job, fields: list[ApplicationField]
    ) -> JobApplicationForm:
        """Create a new job application form."""
        form = JobApplicationForm(
            job=job,
            fields=fields,
        )
        return await form.insert(link_rule=WriteRules.DO_NOTHING)

    async def update(
        self,
        job_application_form: JobApplicationForm,
        fields: list[ApplicationField],
    ) -> JobApplicationForm:
        """Update the job application form."""
        job_application_form.fields = fields
        return await job_application_form.save(link_rule=WriteRules.DO_NOTHING)

    async def get_many_by_ids(
        self, job_ids: list[ObjectId]
    ) -> list[JobApplicationForm | None]:
        """Get multiple application forms by IDs."""
        application_forms = await JobApplicationForm.find(
            In(JobApplicationForm.job.id, job_ids)
        ).to_list()
        application_form_by_id = {
            application_form.job.ref.id: application_form
            for application_form in application_forms
        }

        return [
            application_form_by_id.get(PydanticObjectId(job_id)) for job_id in job_ids
        ]
