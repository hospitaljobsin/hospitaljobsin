import logging
import math
import uuid
from datetime import UTC, datetime
from typing import Annotated, Any, Literal

import h3
from beanie import Link
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Request
from posthog import Posthog
from pydantic import (
    Field,
    HttpUrl,
    StringConstraints,
    TypeAdapter,
    ValidationError,
    validate_call,
)
from pydantic_extra_types.country import CountryAlpha2
from result import Err, Ok, Result
from strawberry import relay
from types_aiobotocore_s3 import S3Client
from types_aiobotocore_sqs import SQSClient

from app.accounts.documents import Account
from app.accounts.exceptions import AccountProfileIncompleteError
from app.accounts.repositories import ProfileRepo
from app.base.exceptions import InvalidLocationError
from app.base.models import Address, BoundingBox, GeoObject
from app.config import AppSettings, AWSSettings, EnvironmentSettings
from app.core.constants import (
    ImpressionJobMetricEventType,
    JobApplicantStatus,
    JobKindType,
    WorkModeType,
)
from app.database.paginator import PaginatedResult
from app.dataloaders import Dataloaders
from app.geocoding.repositories import RegionRepo
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
    InvalidApplicantFieldsError,
    InvalidApplicantLocationsError,
    JobApplicantAlreadyExistsError,
    JobApplicantCountNotFoundError,
    JobApplicantNotFoundError,
    JobApplicantsNotFoundError,
    JobIsExternalError,
    JobNotFoundError,
    JobNotPublishedError,
    OrganizationNotFoundError,
    SavedJobNotFoundError,
)
from app.jobs.models import (
    JobApplicantAnalysisEventBody,
    JobCluster,
    JobClusterFilters,
    JobExperienceRange,
    JobSalaryRange,
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
from app.revalidation.services import BaseRevalidationService

# Map clustering utilities


def get_h3_resolution_from_zoom(zoom_level: int, job_density: float) -> int:
    """
    Map Leaflet zoom level to H3 resolution, adjustable by density.

    Based on PRD specifications and test expectations:
    - Zoom 1-4: Resolution 5 (minimum practical resolution for clustering)
    - Zoom 5-9: Resolution 6
    - Zoom 10-11: Resolution 7
    - Zoom 12-13: Resolution 9
    - Zoom 14: Resolution 10
    - Zoom 15+: Resolution 11

    Note: Resolutions 1-4 don't work well for city-level bounding boxes,
    so we use resolution 5 as the minimum for practical clustering.
    """
    # Base resolution mapping - using minimum resolution 5 for practical clustering
    if zoom_level <= 4:
        base_res = 5
    elif zoom_level <= 9:
        base_res = 6
    elif zoom_level <= 11:
        base_res = 7
    elif zoom_level <= 13:
        base_res = 9
    elif zoom_level == 14:
        base_res = 10
    else:  # zoom_level >= 15
        base_res = 11

    # Adjust for density (jobs per km²)
    if job_density > 100:  # High density: finer resolution
        return min(11, base_res + 1)
    if job_density < 10:  # Low density: coarser resolution
        return max(5, base_res - 1)  # Never go below resolution 5

    return base_res


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
        region_repo: RegionRepo,
        revalidation_service: BaseRevalidationService,
    ) -> None:
        self._job_repo = job_repo
        self._organization_repo = organization_repo
        self._organization_member_service = organization_member_service
        self._job_application_form_repo = job_application_form_repo
        self._job_metric_repo = job_metric_repo
        self._region_repo = region_repo
        self._revalidation_service = revalidation_service

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

    @validate_call()
    async def create(
        self,
        *,
        account: Annotated[Account, Field(exclude=True)],
        organization_id: Annotated[str, Field(exclude=True)],
        title: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=3,
                max_length=200,
            ),
        ],
        description: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=10,
                max_length=5000,
            ),
        ],
        location: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=1,
                max_length=500,
            ),
        ],
        applicant_locations: Annotated[list[str], Field(default_factory=list)],
        external_application_url: HttpUrl | None = None,
        vacancies: Annotated[int | None, Field(ge=0, le=10000)] = None,
        is_salary_negotiable: bool = False,
        experience_range: JobExperienceRange,
        salary_range: JobSalaryRange,
        expires_at: datetime | None = None,
        job_type: JobKindType | None = None,
        work_mode: WorkModeType | None = None,
        skills: Annotated[
            list[
                Annotated[
                    str,
                    StringConstraints(
                        strip_whitespace=True,
                        min_length=2,
                        max_length=200,
                    ),
                ]
            ],
            Field(default_factory=list),
        ],
        currency: Literal["INR"] = "INR",
    ) -> Result[
        Job,
        OrganizationNotFoundError
        | OrganizationAuthorizationError
        | InvalidLocationError
        | InvalidApplicantLocationsError,
    ]:
        """Create a new job."""
        try:
            organization_id = ObjectId(organization_id)
        except InvalidId:
            return Err(OrganizationNotFoundError())
        existing_organization = await self._organization_repo.get(organization_id)
        if existing_organization is None:
            return Err(OrganizationNotFoundError())

        if not await self._organization_member_service.is_member(
            account_id=account.ref.id if isinstance(account, Link) else account.id,
            organization_id=existing_organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        if work_mode == "remote" and len(applicant_locations) == 0:
            return Err(InvalidApplicantLocationsError())
        if work_mode != "remote" and len(applicant_locations) > 0:
            return Err(InvalidApplicantLocationsError())

        country_validator = TypeAdapter(list[CountryAlpha2])
        # check alpha2 country codes alone here
        try:
            country_validator.validate_python(applicant_locations)
        except ValidationError:
            return Err(InvalidApplicantLocationsError())

        result = await self._region_repo.get_by_name(location)
        if result is None:
            return Err(InvalidLocationError())
        geo = GeoObject(
            coordinates=(
                result.coordinates.coordinates[0],
                result.coordinates.coordinates[1],
            ),
        )

        address = Address(
            display_name=location,
            street_address=result.address.street_address,
            address_locality=result.address.address_locality,
            address_region=result.address.address_region,
            postal_code=result.address.postal_code,
            country=result.address.country,
        )

        job = await self._job_repo.create(
            organization=existing_organization,
            title=title,
            description=description,
            vacancies=vacancies,
            location=location,
            applicant_locations=applicant_locations,
            min_salary=salary_range.min_salary,
            max_salary=salary_range.max_salary,
            is_salary_negotiable=is_salary_negotiable,
            min_experience=experience_range.min_experience,
            max_experience=experience_range.max_experience,
            expires_at=expires_at,
            job_type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
            external_application_url=str(external_application_url)
            if external_application_url
            else None,
            geo=geo,
            address=address,
        )

        return Ok(job)

    @validate_call()
    async def update(
        self,
        *,
        account: Annotated[Account, Field(exclude=True)],
        job_id: Annotated[str, Field(exclude=True)],
        title: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=3,
                max_length=200,
            ),
        ],
        description: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=10,
                max_length=5000,
            ),
        ],
        location: Annotated[
            str,
            StringConstraints(
                strip_whitespace=True,
                min_length=1,
                max_length=500,
            ),
        ],
        applicant_locations: Annotated[list[str], Field(default_factory=list)],
        vacancies: Annotated[int | None, Field(ge=0, le=10000)] = None,
        is_salary_negotiable: bool = False,
        experience_range: JobExperienceRange,
        salary_range: JobSalaryRange,
        expires_at: datetime | None = None,
        job_type: JobKindType | None = None,
        work_mode: WorkModeType | None = None,
        skills: Annotated[
            list[
                Annotated[
                    str,
                    StringConstraints(
                        strip_whitespace=True,
                        min_length=2,
                        max_length=200,
                    ),
                ]
            ],
            Field(default_factory=list),
        ],
        currency: Literal["INR"] = "INR",
    ) -> Result[
        Job,
        JobNotFoundError
        | OrganizationAuthorizationError
        | InvalidLocationError
        | InvalidApplicantLocationsError,
    ]:
        """Update a job."""
        try:
            job_id = ObjectId(job_id)
        except InvalidId:
            return Err(JobNotFoundError())
        existing_job = await self._job_repo.get(job_id, fetch_links=True)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=existing_job.organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        if work_mode == "remote" and len(applicant_locations) == 0:
            return Err(InvalidApplicantLocationsError())

        if location != existing_job.location:
            result = await self._region_repo.get_by_name(location)
            if result is None:
                return Err(InvalidLocationError())
            geo = GeoObject(
                coordinates=(
                    result.coordinates.coordinates[0],
                    result.coordinates.coordinates[1],
                ),
            )
            address = Address(
                display_name=location,
                street_address=result.address.street_address,
                address_locality=result.address.address_locality,
                address_region=result.address.address_region,
                postal_code=result.address.postal_code,
                country=result.address.country,
            )
        else:
            geo = existing_job.geo
            address = existing_job.address

        country_validator = TypeAdapter(list[CountryAlpha2])
        try:
            country_validator.validate_python(applicant_locations)
        except ValidationError:
            return Err(InvalidApplicantLocationsError())

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
            applicant_locations=applicant_locations,
            geo=geo,
            address=address,
            min_salary=salary_range.min_salary,
            max_salary=salary_range.max_salary,
            is_salary_negotiable=is_salary_negotiable,
            min_experience=experience_range.min_experience,
            max_experience=experience_range.max_experience,
            expires_at=expires_at,
            job_type=job_type,
            work_mode=work_mode,
            skills=skills,
            currency=currency,
            is_active=is_active,
        )

        await self._revalidation_service.revalidate_tag(
            tag=f"job:{job.organization.slug}:{job.slug}"
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
        existing_job = await self._job_repo.get(job_id=job_id, fetch_links=True)
        if existing_job is None:
            return Err(JobNotFoundError())

        if existing_job.vacancies is not None and existing_job.vacancies == 0:
            return Err(InsufficientActiveVacanciesError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=True)

        await self._revalidation_service.revalidate_tag(
            tag=f"job:{existing_job.organization.slug}:{existing_job.slug}"
        )

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
        existing_job = await self._job_repo.get(job_id=job_id, fetch_links=True)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        if not existing_job.is_active:
            return Err(JobNotPublishedError())

        existing_job = await self._job_repo.update_active(existing_job, is_active=False)

        await self._revalidation_service.revalidate_tag(
            tag=f"job:{existing_job.organization.slug}:{existing_job.slug}"
        )

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
        existing_job = await self._job_repo.get(job_id=job_id, fetch_links=True)
        if existing_job is None:
            return Err(JobNotFoundError())

        if not await self._organization_member_service.is_admin(
            account_id=account.id,
            organization_id=existing_job.organization.id,
        ):
            return Err(OrganizationAuthorizationError())

        await self._job_repo.delete(existing_job)

        await self._revalidation_service.revalidate_tag(
            tag=f"job:{existing_job.organization.slug}:{existing_job.slug}"
        )

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

    @validate_call()
    async def update(
        self,
        *,
        account: Annotated[Account, Field(exclude=True)],
        job_id: Annotated[str, Field(exclude=True)],
        fields: list[ApplicationField],
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
    ) -> JobApplicant:
        analysis: JobApplicantAnalysisOutput | None = None
        try:
            result = await self._job_applicant_analyzer_agent.run(
                user_prompt=f"Job: {job!s}\nProfile: {job_application.profile_snapshot!s}\nApplicant Fields: {[str(field) for field in job_application.applicant_fields]}"
            )
            analysis = result.output
        except Exception as e:
            logging.exception("Job applicant analysis agent failed: %s", e)
            analysis = None
        job_applicant = await self._job_applicant_repo.update_analysis(
            job_applicant=job_application,
            analysis=analysis,
        )
        return job_applicant


class JobApplicantService:
    def __init__(
        self,
        job_repo: JobRepo,
        job_applicant_repo: JobApplicantRepo,
        job_application_form_repo: JobApplicationFormRepo,
        job_metric_repo: JobMetricRepo,
        profile_repo: ProfileRepo,
        organization_member_service: OrganizationMemberService,
        job_applicant_analyzer_agent: JobApplicantAnalyzerAgent,
        s3_client: S3Client,
        sqs_client: SQSClient,
        aws_settings: AWSSettings,
        settings: AppSettings,
        env_settings: EnvironmentSettings,
        job_applicant_analysis_service: JobApplicantAnalysisService,
        dataloaders: Dataloaders,
        posthog_client: Posthog,
    ) -> None:
        self._job_repo = job_repo
        self._organization_member_service = organization_member_service
        self._job_applicant_repo = job_applicant_repo
        self._job_application_form_repo = job_application_form_repo
        self._job_metric_repo = job_metric_repo
        self._s3_client = s3_client
        self._sqs_client = sqs_client
        self._aws_settings = aws_settings
        self._settings = settings
        self._env_settings = env_settings
        self._job_applicant_analyzer_agent = job_applicant_analyzer_agent
        self._job_applicant_analysis_service = job_applicant_analysis_service
        self._dataloaders = dataloaders
        self._posthog_client = posthog_client
        self._profile_repo = profile_repo

    @validate_call(config={"arbitrary_types_allowed": True})
    async def create(
        self,
        *,
        account: Annotated[Account, Field(exclude=True)],
        job_id: Annotated[str, Field(exclude=True)],
        applicant_fields: list[ApplicantField],
        request: Annotated[Request, Field(exclude=True)],
    ) -> Result[
        JobApplicant,
        JobNotFoundError
        | JobNotPublishedError
        | JobApplicantAlreadyExistsError
        | JobIsExternalError
        | AccountProfileNotFoundError
        | AccountProfileIncompleteError
        | InvalidApplicantFieldsError,
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

        profile = await self._profile_repo.get_by_account(account=account)
        if profile is None:
            return Err(AccountProfileNotFoundError())

        if not profile.is_complete:
            return Err(AccountProfileIncompleteError())

        # check if user has already applied here
        existing_job_application = await self._job_applicant_repo.get(
            account_id=account.id, job_id=existing_job.id
        )

        if existing_job_application is not None:
            return Err(JobApplicantAlreadyExistsError())

        # validate applicant fields against job application form
        job_application_form = await self._job_application_form_repo.get_by_job_id(
            existing_job.id
        )
        if job_application_form is not None:
            form_field_names = {
                field.field_name for field in job_application_form.fields
            }
            required_field_names = {
                field.field_name
                for field in job_application_form.fields
                if field.is_required
            }
            provided_field_names = [field.field_name for field in applicant_fields]
            provided_field_names_set = set(provided_field_names)

            if (
                len(provided_field_names) != len(provided_field_names_set)
                or not required_field_names.issubset(provided_field_names_set)
                or not provided_field_names_set.issubset(form_field_names)
            ):
                return Err(InvalidApplicantFieldsError())

        job_application = await self._job_applicant_repo.create(
            job=existing_job,
            account=account,
            applicant_fields=[
                ApplicantField(
                    field_name=field.field_name,
                    field_value=field.field_value,
                )
                for field in applicant_fields
            ],
        )
        # --- AGENT INTEGRATION ---
        if self._env_settings.is_production:
            await self._sqs_client.send_message(
                QueueUrl=self._aws_settings.sqs_queue_url,
                MessageBody=JobApplicantAnalysisEventBody(
                    account_id=str(account.id),
                    job_id=str(existing_job.id),
                ).model_dump_json(),
            )
        if self._env_settings.is_development:
            # do not run in test/ staging environments to save costs
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

        self._posthog_client.capture(
            event="job_applied",
            distinct_id=str(relay.GlobalID("Account", str(account.id))),
            properties={"job_id": str(existing_job.id)},
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

        if not await self._organization_member_service.is_member(
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
            applicant_object_ids,
            job_id=job_id_obj,
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

    async def get(
        self,
        job_id: ObjectId,
        account_id: ObjectId,
        organization_id: ObjectId,
        slug: str,
    ) -> Result[
        JobApplicant, OrganizationAuthorizationError | JobApplicantNotFoundError
    ]:
        if not await self._organization_member_service.is_member(
            account_id=account_id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

        result = await self._dataloaders.job_applicant_by_slug.load(slug)

        if result is None or result.job.ref.id != job_id:
            return Err(JobApplicantNotFoundError())
        return Ok(result)

    async def get_count_for_job(
        self, job_id: ObjectId, account_id: ObjectId, organization_id: ObjectId
    ) -> Result[
        dict[str, int], OrganizationAuthorizationError | JobApplicantCountNotFoundError
    ]:
        if not await self._organization_member_service.is_member(
            account_id=account_id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

        result = await self._dataloaders.applicant_count_by_job_id.load(str(job_id))

        if result is None:
            return Err(JobApplicantCountNotFoundError())
        return Ok(result)


class JobMetricService:
    def __init__(
        self,
        job_metric_repo: JobMetricRepo,
        organization_member_service: OrganizationMemberService,
    ) -> None:
        self._job_metric_repo = job_metric_repo
        self._organization_member_service = organization_member_service

    async def get_organization_impression_metric_points(
        self,
        account: Account,
        organization_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
    ) -> Result[list[dict[str, Any]], OrganizationAuthorizationError]:
        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())
        result = await self._job_metric_repo.get_organization_impression_metric_points(
            organization_id=organization_id,
            event_type=event_type,
        )
        return Ok(result)

    async def get_organization_impression_count(
        self,
        account: Account,
        organization_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> Result[int, OrganizationAuthorizationError]:
        """Get the count of job metrics for a given organization ID and event type."""
        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())

        result = await self._job_metric_repo.get_organization_impression_count(
            organization_id=organization_id,
            event_type=event_type,
            start_date=start_date,
            end_date=end_date,
        )
        return Ok(result)

    async def get_impression_count(
        self,
        job_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> Ok[int]:
        """Get the count of job metrics for a given job ID and event type."""
        result = await self._job_metric_repo.get_impression_count(
            job_id=job_id,
            event_type=event_type,
            start_date=start_date,
            end_date=end_date,
        )
        return Ok(result)

    async def get_impression_metric_points(
        self,
        account: Account,
        job_id: ObjectId,
        organization_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
    ) -> Result[list[dict[str, Any]], OrganizationAuthorizationError]:
        if not await self._organization_member_service.is_member(
            account_id=account.id,
            organization_id=organization_id,
        ):
            return Err(OrganizationAuthorizationError())
        result = await self._job_metric_repo.get_impression_metric_points(
            job_id=job_id,
            event_type=event_type,
        )
        return Ok(result)


class JobClusterService:
    """Service for managing job clustering on maps using H3 hexagonal indexing."""

    def __init__(self, job_repo: JobRepo) -> None:
        self._job_repo = job_repo

    async def get_job_clusters(
        self,
        bounds: dict[str, float],
        zoom_level: int,
        filters: JobClusterFilters,
    ) -> tuple[list[JobCluster], int]:
        """
        Get aggregated job clusters for a map viewport.

        Args:
            bounds: Bounding box with sw_lat, sw_lng, ne_lat, ne_lng
            zoom_level: Map zoom level (1-20)
            filters: Filter criteria for jobs

        Returns:
            Tuple of (list of job clusters, total job count)

        """
        # Calculate job density for viewport
        job_density = await self._calculate_job_density(bounds, filters)

        # Determine H3 resolution based on zoom level and density
        h3_resolution = get_h3_resolution_from_zoom(zoom_level, job_density)

        # Debug logging
        import logging

        logger = logging.getLogger(__name__)
        print(
            f"🚀 JobClusterService.get_job_clusters: zoom_level={zoom_level}, "
            f"job_density={job_density}, h3_resolution={h3_resolution}, bounds={bounds}"
        )
        logger.info(
            f"JobClusterService.get_job_clusters: zoom_level={zoom_level}, "
            f"job_density={job_density}, h3_resolution={h3_resolution}, bounds={bounds}"
        )

        # For very high zoom levels (15+), return individual jobs as clusters
        # This provides the most detail when zoomed in
        if zoom_level >= 15:  # noqa: PLR2004
            logger.info("Using individual job clusters for high zoom level")
            return await self._get_individual_job_clusters(bounds, filters)

        # For lower zoom levels, use H3 hexagonal aggregation
        print("🏠 Using H3 aggregated clusters for low zoom level")
        logger.info("Using H3 aggregated clusters for low zoom level")
        result = await self._get_aggregated_clusters(bounds, h3_resolution, filters)
        print(
            f"🏠 _get_aggregated_clusters returned: {len(result[0])} clusters, {result[1]} total_count"
        )
        return result

    async def get_cluster_jobs_paginated(
        self,
        h3_index: str,
        h3_resolution: int,
        filters: JobClusterFilters,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """
        Get paginated jobs within a specific H3 hexagon cluster.

        Args:
            h3_index: H3 hexagon index
            h3_resolution: H3 resolution level
            filters: Filter criteria for jobs
            first: Number of items after cursor
            last: Number of items before cursor
            before: Cursor for backward pagination
            after: Cursor for forward pagination

        Returns:
            Paginated result with jobs and page info

        """
        # Delegate to repository
        return await self._job_repo.get_jobs_in_h3_hexagon_paginated(
            h3_index=h3_index,
            h3_resolution=h3_resolution,
            filters=filters,
            first=first,
            last=last,
            before=before,
            after=after,
        )

    async def _calculate_job_density(
        self, bounds: dict[str, float], filters: JobClusterFilters
    ) -> float:
        """
        Calculate job density (jobs per km²) for a viewport.

        Args:
            bounds: Bounding box with sw_lat, sw_lng, ne_lat, ne_lng
            filters: Filter criteria for jobs

        Returns:
            Jobs per square kilometer

        """
        # Calculate viewport area using haversine formula
        sw_lat = bounds["sw_lat"]
        sw_lng = bounds["sw_lng"]
        ne_lat = bounds["ne_lat"]
        ne_lng = bounds["ne_lng"]

        # Earth radius in km
        r = 6371.0

        # Convert to radians
        lat1 = math.radians(sw_lat)
        lat2 = math.radians(ne_lat)
        lng1 = math.radians(sw_lng)
        lng2 = math.radians(ne_lng)

        # Calculate height (north-south distance)
        dlat = lat2 - lat1
        a = math.sin(dlat / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        height_km = r * c

        # Calculate width (east-west distance) at center latitude
        center_lat = (lat1 + lat2) / 2
        dlng = lng2 - lng1
        a = math.cos(center_lat) ** 2 * math.sin(dlng / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        width_km = r * c

        # Calculate area
        area_km2 = height_km * width_km

        # Avoid division by zero
        if area_km2 == 0:
            return 0.0

        # For large areas, use a simple heuristic based on area size
        # to avoid calling aggregation which might cause memory issues
        if area_km2 > 50000:  # Very large area (like entire countries)
            # Use low density assumption for very large areas
            return 0.1  # jobs per km²
        elif area_km2 > 5000:  # Large area (like states/provinces)
            return 1.0  # jobs per km²
        elif area_km2 > 500:  # Medium area (like cities)
            return 5.0  # jobs per km²
        else:
            # For smaller areas, do actual job counting
            # Use a simple MongoDB count query instead of full aggregation
            try:
                # Build a basic query without H3 aggregation
                query_conditions = {
                    "is_active": True,
                    "geo": {
                        "$geoWithin": {
                            "$box": [
                                [bounds["sw_lng"], bounds["sw_lat"]],
                                [bounds["ne_lng"], bounds["ne_lat"]],
                            ]
                        }
                    },
                }

                # Add basic filters without complex logic
                if filters.work_mode:
                    query_conditions["work_mode"] = {"$in": filters.work_mode}
                if filters.job_type:
                    query_conditions["type"] = {"$in": filters.job_type}

                from app.jobs.documents import Job

                total_count = await Job.count(query_conditions)

                return total_count / area_km2 if area_km2 > 0 else 0.0
            except Exception:
                # Fallback to medium density if query fails
                return 10.0  # jobs per km²

    async def _get_aggregated_clusters(
        self,
        bounds: dict[str, float],
        h3_resolution: int,
        filters: JobClusterFilters,
    ) -> tuple[list[JobCluster], int]:
        """
        Get aggregated clusters using H3 hexagonal binning.

        Args:
            bounds: Bounding box with sw_lat, sw_lng, ne_lat, ne_lng
            h3_resolution: H3 resolution level to use
            filters: Filter criteria for jobs

        Returns:
            Tuple of (list of job clusters, total job count)

        """
        # Delegate to repository's aggregation method
        clusters, total_count = await self._job_repo.get_aggregated_jobs_by_h3(
            bounds=BoundingBox(**bounds), h3_resolution=h3_resolution, filters=filters
        )

        return clusters, total_count

    async def _get_individual_job_clusters(
        self,
        bounds: dict[str, float],
        filters: JobClusterFilters,
    ) -> tuple[list[JobCluster], int]:
        """Get individual jobs as single-job clusters for high zoom levels.

        Args:
            bounds: Bounding box with sw_lat, sw_lng, ne_lat, ne_lng
            filters: Filter criteria for jobs

        Returns:
            Tuple of (list of single-job clusters, total job count)

        """
        # Build query for jobs within bounds and matching filters
        sw_lat = bounds["sw_lat"]
        sw_lng = bounds["sw_lng"]
        ne_lat = bounds["ne_lat"]
        ne_lng = bounds["ne_lng"]

        # Use $geoWithin to find jobs in bounding box
        query_conditions = [
            {
                "geo": {
                    "$geoWithin": {
                        "$box": [[sw_lng, sw_lat], [ne_lng, ne_lat]],
                    }
                }
            },
            {"is_active": True},
            {
                "$or": [
                    {"expires_at": None},
                    {"expires_at": {"$gt": datetime.now(UTC)}},
                ]
            },
        ]

        # Apply filters
        filter_conditions = []

        if filters.work_mode:
            filter_conditions.append({"work_mode": {"$in": filters.work_mode}})

        if filters.job_type:
            filter_conditions.append({"type": {"$in": filters.job_type}})

        if filters.min_experience is not None:
            filter_conditions.append(
                {
                    "$or": [
                        {"max_experience": {"$gte": filters.min_experience}},
                        {"min_experience": {"$gte": filters.min_experience}},
                    ]
                }
            )

        if filters.max_experience is not None:
            filter_conditions.append(
                {
                    "$or": [
                        {"min_experience": {"$lte": filters.max_experience}},
                        {"max_experience": {"$lte": filters.max_experience}},
                    ]
                }
            )

        if filters.min_salary is not None:
            filter_conditions.append(
                {
                    "$or": [
                        {"max_salary": {"$gte": filters.min_salary}},
                        {"min_salary": {"$gte": filters.min_salary}},
                    ]
                }
            )

        if filters.max_salary is not None:
            filter_conditions.append(
                {
                    "$or": [
                        {"min_salary": {"$lte": filters.max_salary}},
                        {"max_salary": {"$lte": filters.max_salary}},
                    ]
                }
            )

        # Combine all conditions
        final_query = {"$and": query_conditions + filter_conditions}

        # Fetch jobs (limit to 1000 for performance)
        jobs = await Job.find(final_query, fetch_links=False, limit=1000).to_list()

        # Wrap each job as a single-job cluster
        clusters = []
        for job in jobs:
            if not job.geo:
                continue

            # Get H3 index at resolution 11 for this job
            h3_index = h3.latlng_to_cell(
                job.geo.coordinates[1], job.geo.coordinates[0], 11
            )

            # Get boundary for this hexagon
            boundary_coords = h3.cell_to_boundary(h3_index)
            bounds_list = [
                [lng, lat] for lat, lng in boundary_coords
            ]  # Convert to [lng, lat] format

            # Create cluster
            cluster = JobCluster(
                h3_index=h3_index,
                count=1,
                center=GeoObject(
                    coordinates=(job.geo.coordinates[0], job.geo.coordinates[1])
                ),
                bounds=bounds_list,
                salary_range=None
                if job.min_salary is None and job.max_salary is None
                else {"min_salary": job.min_salary, "max_salary": job.max_salary},
                top_specialties=job.skills[:3] if job.skills else [],
            )
            clusters.append(cluster)

        return clusters, len(clusters)
