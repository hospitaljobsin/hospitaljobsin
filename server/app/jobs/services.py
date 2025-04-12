from datetime import datetime
from typing import Literal

from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result

from app.accounts.documents import Account
from app.base.models import Address
from app.jobs.documents import (
    ApplicantField,
    ApplicationField,
    Job,
    JobApplicant,
    JobApplicationForm,
    SavedJob,
)
from app.jobs.exceptions import (
    JobApplicantAlreadyExistsError,
    JobApplicationFormNotFoundError,
    JobNotFoundError,
    JobNotPublishedError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.repositories import (
    JobApplicantRepo,
    JobApplicationFormRepo,
    JobRepo,
    SavedJobRepo,
)
from app.organizations.exceptions import (
    OrganizationAuthorizationError,
)
from app.organizations.repositories import OrganizationRepo
from app.organizations.services import OrganizationMemberService


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
    def __init__(
        self,
        job_repo: JobRepo,
        organization_repo: OrganizationRepo,
        organization_member_service: OrganizationMemberService,
        job_application_form_repo: JobApplicationFormRepo,
    ) -> None:
        self._job_repo = job_repo
        self._organization_repo = organization_repo
        self._organization_member_service = organization_member_service
        self._job_application_form_repo = job_application_form_repo

    async def create(
        self,
        *,
        account: Account,
        organization_id: str,
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
    ) -> Result[Job, OrganizationNotFoundError | OrganizationAuthorizationError]:
        """Create a new job."""
        try:
            organization_id = ObjectId(organization_id)
        except InvalidId:
            return Err(OrganizationNotFoundError())
        existing_organization = await self._organization_repo.get(organization_id)
        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=existing_organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        job = await self._job_repo.create(
            organization=existing_organization,
            title=title,
            description=description,
            vacancies=vacancies,
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

    async def update(
        self,
        *,
        account: Account,
        job_id: str,
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
    ) -> Result[Job, JobNotFoundError | OrganizationAuthorizationError]:
        """Update a job."""
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get(job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

        job = await self._job_repo.update(
            job=existing_job,
            title=title,
            description=description,
            vacancies=vacancies,
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

    async def publish(
        self,
        account: Account,
        job_id: ObjectId,
    ) -> Result[
        Job,
        JobNotFoundError
        | OrganizationAuthorizationError
        | JobApplicationFormNotFoundError,
    ]:
        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

        if await self._job_application_form_repo.get(job_id=existing_job.id) is None:
            return Err(JobApplicationFormNotFoundError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=True)

        return Ok(existing_job)

    async def unpublish(
        self,
        account: Account,
        job_id: ObjectId,
    ) -> Result[
        Job,
        JobNotFoundError | OrganizationAuthorizationError | JobNotPublishedError,
    ]:
        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

        if not existing_job.is_active:
            return Err(JobNotPublishedError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=False)

        return Ok(existing_job)


class JobApplicationFormService:
    def __init__(
        self,
        job_application_form_repo: JobApplicationFormRepo,
        job_repo: JobRepo,
        organization_member_service: OrganizationMemberService,
    ) -> None:
        self._job_application_form_repo = job_application_form_repo
        self._job_repo = job_repo
        self._organization_member_service = organization_member_service

    async def update(
        self, account: Account, job_id: str, fields: list[ApplicationField]
    ) -> Result[
        tuple[JobApplicationForm, Job],
        JobNotFoundError | OrganizationAuthorizationError,
    ]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())

        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

        existing_application_form = await self._job_application_form_repo.get_by_job_id(
            job_id=existing_job.id
        )

        if existing_application_form is None:
            existing_application_form = await self._job_application_form_repo.create(
                job=existing_job, fields=fields
            )
        else:
            await self._job_application_form_repo.update(
                existing_application_form,
                fields=fields,
            )
        return Ok((existing_application_form, existing_job))


class JobApplicantService:
    def __init__(
        self,
        job_repo: JobRepo,
        job_application_repo: JobApplicantRepo,
        organization_member_service: OrganizationMemberService,
    ) -> None:
        self._job_repo = job_repo
        self._organization_member_service = organization_member_service
        self._job_application_repo = job_application_repo

    async def create(
        self,
        account: Account,
        job_id: str,
        applicant_fields: list[ApplicantField],
    ) -> Result[
        JobApplicant,
        JobNotFoundError | JobNotPublishedError | JobApplicantAlreadyExistsError,
    ]:
        """Create a job application."""
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not existing_job.is_active:
            return Err(JobNotPublishedError())

        # check if user has already applied here
        existing_job_application = await self._job_application_repo.get(
            account_id=account.id, job_id=existing_job.id
        )

        if existing_job_application is not None:
            return Err(JobApplicantAlreadyExistsError())

        job_application = await self._job_application_repo.create(
            job=existing_job,
            account=account,
            applicant_fields=applicant_fields,
        )

        return Ok(job_application)
