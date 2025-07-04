import logging
import uuid
from datetime import datetime
from typing import Literal

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Request
from result import Err, Ok, Result
from types_aiobotocore_s3 import S3Client
from types_aiobotocore_sqs import SQSClient

from app.accounts.documents import Account
from app.accounts.exceptions import AccountProfileIncompleteError
from app.base.models import GeoObject
from app.config import AppSettings, AWSSettings
from app.core.constants import JobApplicantStatus, JobKindType
from app.core.geocoding import BaseLocationService
from app.jobs.agents.applicant_analysis import (
    JobApplicantAnalysisOutput,
    JobApplicantAnalyzerAgent,
)
from app.jobs.documents import (
    ApplicantField,
    ApplicationField,
    ImpressionJobMetric,
    Job,
    JobApplicant,
    JobApplicationForm,
    SavedJob,
)
from app.jobs.exceptions import (
    AccountProfileNotFoundError,
    InsufficientActiveVacanciesError,
    JobApplicantAlreadyExistsError,
    JobApplicantsNotFoundError,
    JobIsExternalError,
    JobNotFoundError,
    JobNotPublishedError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.models import JobApplicantAnalysisEventBody
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
    def __init__(
        self,
        saved_job_repo: SavedJobRepo,
        job_repo: JobRepo,
        job_metric_repo: JobMetricRepo,
    ) -> None:
        self._saved_job_repo = saved_job_repo
        self._job_repo = job_repo
        self._job_metric_repo = job_metric_repo

    async def save_job(
        self,
        account_id: ObjectId,
        job_id: str,
        request: Request,
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

        # log the job application metric
        await self._job_metric_repo.create_core_metric(
            job_id=job.id,
            organization_id=job.organization.ref.id,
            event_type="save",
            account_id=account_id,
            fingerprint_id=request.state.fingerprint,
        )

        return Ok(result)

    async def unsave_job(
        self,
        account_id: ObjectId,
        job_id: str,
        request: Request,
    ) -> Result[SavedJob, SavedJobNotFoundError]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(SavedJobNotFoundError())

        job = await self._job_repo.get(job_id=job_id)
        if job is None:
            return Err(SavedJobNotFoundError())

        saved_job = await self._saved_job_repo.get(account_id=account_id, job_id=job.id)
        if saved_job is None:
            return Err(SavedJobNotFoundError())
        await self._saved_job_repo.delete(saved_job)

        # log the job application metric
        await self._job_metric_repo.create_core_metric(
            job_id=job.id,
            organization_id=job.organization.ref.id,
            event_type="unsave",
            account_id=account_id,
            fingerprint_id=request.state.fingerprint,
        )

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

    async def log_view_start(
        self,
        request: Request,
        job_id: ObjectId,
        impression_id: str,
        account_id: ObjectId | None = None,
    ) -> Result[ImpressionJobMetric, JobNotFoundError]:
        """Log a job view start."""
        existing_job = await self._job_repo.get(
            job_id=job_id,
        )
        if existing_job is None:
            return Err(JobNotFoundError())

        metric = await self._job_metric_repo.create_impression_metric(
            job_id=existing_job.id,
            organization_id=existing_job.organization.ref.id,
            event_type="view_start",
            account_id=account_id,
            fingerprint_id=request.state.fingerprint,
            impression_id=impression_id,
        )

        return Ok(metric)

    async def log_view_end(
        self,
        request: Request,
        job_id: ObjectId,
        impression_id: str,
        account_id: ObjectId | None = None,
    ) -> Result[ImpressionJobMetric, JobNotFoundError]:
        """Log a job view end."""
        existing_job = await self._job_repo.get(
            job_id=job_id,
        )
        if existing_job is None:
            return Err(JobNotFoundError())

        metric = await self._job_metric_repo.create_impression_metric(
            job_id=existing_job.id,
            organization_id=existing_job.organization.ref.id,
            event_type="view_end",
            account_id=account_id,
            fingerprint_id=request.state.fingerprint,
            impression_id=impression_id,
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
        is_salary_negotiable: bool = False,
        min_experience: int | None = None,
        max_experience: int | None = None,
        expires_at: datetime | None = None,
        job_type: JobKindType | None = None,
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
            is_salary_negotiable=is_salary_negotiable,
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
        is_salary_negotiable: bool = False,
        min_experience: int | None = None,
        max_experience: int | None = None,
        expires_at: datetime | None = None,
        job_type: JobKindType | None = None,
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

        is_active = existing_job.is_active
        if vacancies is not None and vacancies == 0:
            # unpublish job automatically if no vacancies are present
            is_active = False

        job = await self._job_repo.update(
            job=existing_job,
            title=title,
            description=description,
            vacancies=vacancies,
            location=location,
            geo=geo,
            min_salary=min_salary,
            max_salary=max_salary,
            is_salary_negotiable=is_salary_negotiable,
            min_experience=min_experience,
            max_experience=max_experience,
            expires_at=expires_at,
            job_type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
            is_active=is_active,
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
        | InsufficientActiveVacanciesError,
    ]:
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get(job_id=job_id)
        if existing_job is None:
            return Err(JobNotFoundError())

        if existing_job.vacancies is not None and existing_job.vacancies == 0:
            return Err(InsufficientActiveVacanciesError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.ref.id,
        ):
            return Err(OrganizationAuthorizationError())

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


class JobApplicantAnalysisService:
    def __init__(
        self,
        job_applicant_analyzer_agent: JobApplicantAnalyzerAgent,
        job_applicant_repo: JobApplicantRepo,
    ) -> None:
        self._job_applicant_analyzer_agent = job_applicant_analyzer_agent
        self._job_applicant_repo = job_applicant_repo

    async def analyse_job_applicant(
        self,
        job_application: JobApplicant,
        job: Job,
    ) -> None:
        analysis: JobApplicantAnalysisOutput | None = None
        try:
            result = await self._job_applicant_analyzer_agent.run(
                user_prompt=f"Job: {job!s}\nProfile: {job_application.profile_snapshot!s}\nApplicant Fields: {[str(field) for field in job_application.applicant_fields]}"
            )
            analysis = result.output
        except Exception as e:
            logging.exception("Job applicant analysis agent failed: %s", e)
            analysis = None
        await self._job_applicant_repo.update_analysis(
            job_applicant=job_application,
            analysis=analysis,
        )


class JobApplicantService:
    def __init__(
        self,
        job_repo: JobRepo,
        job_applicant_repo: JobApplicantRepo,
        job_metric_repo: JobMetricRepo,
        organization_member_service: OrganizationMemberService,
        job_applicant_analyzer_agent: JobApplicantAnalyzerAgent,
        s3_client: S3Client,
        sqs_client: SQSClient,
        aws_settings: AWSSettings,
        settings: AppSettings,
        job_applicant_analysis_service: JobApplicantAnalysisService,
    ) -> None:
        self._job_repo = job_repo
        self._organization_member_service = organization_member_service
        self._job_applicant_repo = job_applicant_repo
        self._job_metric_repo = job_metric_repo
        self._s3_client = s3_client
        self._sqs_client = sqs_client
        self._aws_settings = aws_settings
        self._settings = settings
        self._job_applicant_analyzer_agent = job_applicant_analyzer_agent
        self._job_applicant_analysis_service = job_applicant_analysis_service

    async def create(
        self,
        account: Account,
        job_id: str,
        applicant_fields: list[ApplicantField],
        request: Request,
    ) -> Result[
        JobApplicant,
        JobNotFoundError
        | JobNotPublishedError
        | JobApplicantAlreadyExistsError
        | JobIsExternalError
        | AccountProfileNotFoundError
        | AccountProfileIncompleteError,
    ]:
        """Create a job application."""
        try:
            job_id_obj = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get(job_id=job_id_obj)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not existing_job.is_active:
            return Err(JobNotPublishedError())

        if existing_job.external_application_url is not None:
            return Err(JobIsExternalError())

        await account.fetch_link(Account.profile)

        if account.profile is None:
            return Err(AccountProfileNotFoundError())

        if not account.profile.is_complete:
            return Err(AccountProfileIncompleteError())

        # check if user has already applied here
        existing_job_application = await self._job_applicant_repo.get(
            account_id=account.id, job_id=existing_job.id
        )

        if existing_job_application is not None:
            return Err(JobApplicantAlreadyExistsError())

        # TODO: validate applicant fields (screening questions here)
        # if the job doesn't have any, its okay to be an empty array.
        # otherwise, the questions must match that on the job (maybe tag each question with an ID??)

        job_application = await self._job_applicant_repo.create(
            job=existing_job,
            account=account,
            applicant_fields=applicant_fields,
        )
        # --- AGENT INTEGRATION ---
        if self._settings.is_production:
            await self._sqs_client.send_message(
                QueueUrl=self._aws_settings.sqs_queue_url,
                MessageBody=JobApplicantAnalysisEventBody(
                    account_id=str(account.id),
                    job_id=str(existing_job.id),
                ).model_dump_json(),
            )
        else:
            await self._job_applicant_analysis_service.analyse_job_applicant(
                job_application=job_application,
                job=existing_job,
            )
        # --- END AGENT INTEGRATION ---

        # log the job application metric
        await self._job_metric_repo.create_core_metric(
            job_id=existing_job.id,
            organization_id=existing_job.organization.ref.id,
            event_type="apply",
            account_id=account.id,
            fingerprint_id=request.state.fingerprint,
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
