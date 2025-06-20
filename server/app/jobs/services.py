import uuid
from datetime import datetime
from typing import Literal

from bson import ObjectId
from bson.errors import InvalidId
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client

from app.accounts.documents import Account
from app.base.models import GeoObject
from app.config import AWSSettings
from app.core.constants import JobApplicantStatus
from app.core.geocoding import BaseLocationService
from app.jobs.documents import (
    ApplicantField,
    ApplicationField,
    Job,
    JobApplicant,
    JobApplicationForm,
    JobMetric,
    SavedJob,
)
from app.jobs.exceptions import (
    AccountProfileNotFoundError,
    JobApplicantAlreadyExistsError,
    JobApplicantsNotFoundError,
    JobApplicationFormNotFoundError,
    JobIsExternalError,
    JobNotFoundError,
    JobNotPublishedError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.repositories import (
    JobApplicantRepo,
    JobApplicationFormRepo,
    JobMetricRepo,
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
        job_metric_repo: JobMetricRepo,
        location_service: BaseLocationService,
    ) -> None:
        self._job_repo = job_repo
        self._organization_repo = organization_repo
        self._organization_member_service = organization_member_service
        self._job_application_form_repo = job_application_form_repo
        self._job_metric_repo = job_metric_repo
        self._location_service = location_service

    async def log_view(
        self, slug: str, organization_slug: str
    ) -> Result[JobMetric, JobNotFoundError]:
        """Log a job view."""
        organization = await self._organization_repo.get_by_slug(organization_slug)
        if organization is None:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get_by_slug(
            slug=slug, organization_id=organization.id
        )
        if existing_job is None:
            return Err(JobNotFoundError())

        metric = await self._job_metric_repo.create(
            job_id=existing_job.id,
            organization_id=existing_job.organization.ref.id,
            event_type="view",
        )

        return Ok(metric)

    async def create(
        self,
        *,
        account: Account,
        organization_id: str,
        title: str,
        description: str,
        external_application_url: str | None = None,
        location: str | None = None,
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

        geo = None
        if location is not None:
            result = await self._location_service.geocode(location)
            if result is not None:
                geo = GeoObject(
                    coordinates=(result.longitude, result.latitude),
                )

        job = await self._job_repo.create(
            organization=existing_organization,
            title=title,
            description=description,
            vacancies=vacancies,
            location=location,
            min_salary=min_salary,
            max_salary=max_salary,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            job_type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
            external_application_url=external_application_url,
            geo=geo,
        )

        return Ok(job)

    async def update(
        self,
        *,
        account: Account,
        job_id: str,
        title: str,
        description: str,
        location: str | None = None,
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

        geo = None
        if location is not None:
            result = await self._location_service.geocode(location)
            if result is not None:
                geo = GeoObject(
                    coordinates=(result.longitude, result.latitude),
                )

        job = await self._job_repo.update(
            job=existing_job,
            title=title,
            description=description,
            vacancies=vacancies,
            location=location,
            geo=geo,
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
        job_id: str,
    ) -> Result[
        Job,
        JobNotFoundError
        | OrganizationAuthorizationError
        | JobApplicationFormNotFoundError,
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

        if (
            existing_job.external_application_url is None
            and await self._job_application_form_repo.get_by_job_id(
                job_id=existing_job.id
            )
            is None
        ):
            return Err(JobApplicationFormNotFoundError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=True)

        return Ok(existing_job)

    async def unpublish(
        self,
        account: Account,
        job_id: str,
    ) -> Result[
        Job,
        JobNotFoundError | OrganizationAuthorizationError | JobNotPublishedError,
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

        if not existing_job.is_active:
            return Err(JobNotPublishedError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=False)

        return Ok(existing_job)

    async def delete(
        self,
        account: Account,
        job_id: str,
    ) -> Result[
        Job,
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

        await self._job_repo.delete(existing_job)

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
        JobNotFoundError | OrganizationAuthorizationError | JobIsExternalError,
    ]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())

        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if existing_job.external_application_url is not None:
            return Err(JobIsExternalError())

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
        job_applicant_repo: JobApplicantRepo,
        organization_member_service: OrganizationMemberService,
        s3_client: S3Client,
        aws_settings: AWSSettings,
    ) -> None:
        self._job_repo = job_repo
        self._organization_member_service = organization_member_service
        self._job_applicant_repo = job_applicant_repo
        self._s3_client = s3_client
        self._aws_settings = aws_settings

    async def create(
        self,
        account: Account,
        job_id: str,
        applicant_fields: list[ApplicantField],
    ) -> Result[
        JobApplicant,
        JobNotFoundError
        | JobNotPublishedError
        | JobApplicantAlreadyExistsError
        | JobIsExternalError
        | AccountProfileNotFoundError,
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

        if existing_job.external_application_url is not None:
            return Err(JobIsExternalError())

        if account.profile is None:
            return Err(AccountProfileNotFoundError())

        # check if user has already applied here
        existing_job_application = await self._job_applicant_repo.get(
            account_id=account.id, job_id=existing_job.id
        )

        if existing_job_application is not None:
            return Err(JobApplicantAlreadyExistsError())

        job_application = await self._job_applicant_repo.create(
            job=existing_job,
            account=account,
            applicant_fields=applicant_fields,
        )

        return Ok(job_application)

    async def bulk_update_status(
        self,
        account: Account,
        job_id: str,
        job_applicant_ids: list[str],
        status: JobApplicantStatus,
    ) -> Result[
        list[JobApplicant],
        JobNotFoundError
        | OrganizationAuthorizationError
        | JobIsExternalError
        | JobApplicantsNotFoundError,
    ]:
        """Bulk update status for job applicants."""
        try:
            job_id_obj = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())

        existing_job = await self._job_repo.get(job_id=job_id_obj)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

        if existing_job.external_application_url is not None:
            return Err(JobIsExternalError())

        applicant_object_ids: list[ObjectId] = []
        invalid_format_ids: list[str] = []
        for id_str in job_applicant_ids:
            if not ObjectId.is_valid(id_str):
                invalid_format_ids.append(id_str)
            else:
                applicant_object_ids.append(ObjectId(id_str))

        if invalid_format_ids:
            return Err(
                JobApplicantsNotFoundError(
                    not_found_ids=invalid_format_ids,
                )
            )

        # Check if all applicants exist
        existing_applicants = await self._job_applicant_repo.get_many_by_ids(
            applicant_object_ids
        )

        found_applicants = [app for app in existing_applicants if app]

        if len(found_applicants) != len(applicant_object_ids):
            found_ids = {app.id for app in found_applicants}
            not_found_ids = [
                str(id_obj)
                for id_obj in applicant_object_ids
                if id_obj not in found_ids
            ]
            return Err(JobApplicantsNotFoundError(not_found_ids=not_found_ids))

        # Verify that all applicants belong to the specified job
        for applicant in found_applicants:
            if applicant.job.ref.id != job_id_obj:
                # This indicates a client-side error, trying to update an applicant
                # from a different job.
                return Err(OrganizationAuthorizationError())

        job_applications = await self._job_applicant_repo.bulk_update(
            job_applicant_ids=applicant_object_ids,
            status=status,
        )

        return Ok(job_applications)

    async def create_resume_presigned_url(self) -> str:
        """Create a presigned URL for uploading a resume."""
        return await self._s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": self._aws_settings.s3_bucket_name,
                "Key": f"applicant-resumes/{uuid.uuid4()}",
            },
            ExpiresIn=3600,
            HttpMethod="PUT",
        )
