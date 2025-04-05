from datetime import datetime
from typing import Literal

from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.base.models import Address
from app.jobs.documents import Job, SavedJob
from app.jobs.exceptions import (
    JobNotFoundError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.repositories import JobRepo, SavedJobRepo
from app.organizations.repositories import OrganizationRepo


class SavedJobService:
    def __init__(self, saved_job_repo: SavedJobRepo, job_repo: JobRepo) -> None:
        self._saved_job_repo = saved_job_repo
        self._job_repo = job_repo

    async def save_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[SavedJob, JobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        job = await self._job_repo.get(job_id=job_id)
        if job is None:
            return Err(JobNotFoundError())
        result = await self._saved_job_repo.create(
            account_id=account_id,
            job=job,
        )

        return Ok(result)

    async def unsave_job(
        self, account_id: ObjectId, job_id: str
    ) -> Result[SavedJob, SavedJobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(SavedJobNotFoundError())
        saved_job = await self._saved_job_repo.get(account_id=account_id, job_id=job_id)
        if saved_job is None:
            return Err(SavedJobNotFoundError())
        await self._saved_job_repo.delete(saved_job)

        return Ok(saved_job)


class JobService:
    def __init__(self, job_repo: JobRepo, organization_repo: OrganizationRepo) -> None:
        self._job_repo = job_repo
        self._organization_repo = organization_repo

    async def create(
        self,
        *,
        account: Account,
        organization_id: str,
        title: str,
        description: str,
        address: Address,
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
    ) -> Result[Job, OrganizationNotFoundError]:
        """Create a new job."""
        try:
            organization_id = ObjectId(organization_id)
        except InvalidId:
            return Err(OrganizationNotFoundError())
        existing_organization = await self._organization_repo.get(organization_id)
        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        job = await self._job_repo.create(
            organization=existing_organization,
            title=title,
            description=description,
            address=address,
            min_salary=min_salary,
            max_salary=max_salary,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            job_type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
        )

        return Ok(job)
