import secrets
import uuid
from collections import defaultdict
from datetime import UTC, datetime
from typing import Any, Literal, get_args

import pymongo
from beanie import DeleteRules, PydanticObjectId, WriteRules
from beanie.operators import And, In, NearSphere, Set
from bson import ObjectId

from app.accounts.documents import Account, BaseProfile, SalaryExpectations
from app.base.models import GeoObject
from app.core.constants import (
    RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD,
    RELATED_JOBS_SIMILARITY_THRESHOLD,
    CoreJobMetricEventType,
    ImpressionJobMetricEventType,
    JobApplicantStatus,
)
from app.database.paginator import PaginatedResult, Paginator
from app.embeddings.services import EmbeddingsService
from app.geocoding.models import Coordinates
from app.organizations.documents import Organization

from .documents import (
    ApplicantField,
    ApplicationField,
    CoreJobMetric,
    CoreJobMetricMetadata,
    ImpressionJobMetric,
    ImpressionJobMetricMetadata,
    Job,
    JobApplicant,
    JobApplicationForm,
    SavedJob,
)


class JobRepo:
    def __init__(self, embeddings_service: EmbeddingsService) -> None:
        self._embeddings_service = embeddings_service

    async def generate_slug(self, title: str, organization_id: ObjectId) -> str:
        """Generate a slug from the job title."""
        slug = title.lower().replace(" ", "-")
        if await self.get_by_slug(slug, organization_id):
            suffix = secrets.token_urlsafe(8)
            while await self.get_by_slug(f"{slug}-{suffix}", organization_id):
                suffix = secrets.token_urlsafe(8)
            slug = f"{slug}-{suffix}"
        return slug

    @staticmethod
    def format_job_for_embedding(
        title: str,
        description: str,
        skills: list[str],
        location: str | None,
        geo: GeoObject | None,
        min_salary: int | None,
        max_salary: int | None,
        min_experience: int | None,
        max_experience: int | None,
        job_type: str | None,
        work_mode: str | None,
        currency: str,
    ) -> str:
        return (
            f"Title: {title}\n"
            f"Description: {description}\n"
            f"Skills: {', '.join(skills) if skills else 'N/A'}\n"
            f"Location: {location or 'N/A'}\n"
            f"Geo: {geo if geo else 'N/A'}\n"
            f"Salary: {min_salary or 'N/A'} - {max_salary or 'N/A'} {currency}\n"
            f"Experience: {min_experience or 'N/A'} - {max_experience or 'N/A'} years\n"
            f"Type: {job_type or 'N/A'}\n"
            f"Work Mode: {work_mode or 'N/A'}"
        )

    async def create(
        self,
        *,
        organization: Organization,
        title: str,
        description: str,
        external_application_url: str | None = None,
        location: str | None = None,
        geo: GeoObject | None = None,
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
        embedding = await self._embeddings_service.generate_embeddings(
            text=self.format_job_for_embedding(
                title=title,
                description=description,
                skills=skills,
                location=location,
                geo=geo,
                min_salary=min_salary,
                max_salary=max_salary,
                min_experience=min_experience,
                max_experience=max_experience,
                job_type=job_type,
                work_mode=work_mode,
                currency=currency,
            )
        )
        job = Job(
            title=title,
            description=description,
            embedding=embedding,
            vacancies=vacancies,
            location=location,
            geo=geo,
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
            external_application_url=external_application_url,
            slug=await self.generate_slug(title, organization.id),
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
        location: str | None = None,
        geo: GeoObject | None = None,
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
        # Store original values for embedding-relevant fields
        orig = {
            "title": job.title,
            "description": job.description,
            "skills": list(job.skills) if job.skills else [],
            "location": job.location,
            "geo": job.geo,
            "min_salary": job.min_salary,
            "max_salary": job.max_salary,
            "min_experience": job.min_experience,
            "max_experience": job.max_experience,
            "job_type": job.type,
            "work_mode": job.work_mode,
            "currency": job.currency,
        }

        # Update fields
        job.title = title
        job.description = description
        job.vacancies = vacancies
        job.location = location
        job.geo = geo
        job.min_salary = min_salary
        job.max_salary = max_salary
        job.min_experience = min_experience
        job.max_experience = max_experience
        job.expires_at = expires_at
        job.type = job_type
        job.work_mode = work_mode
        job.skills = skills
        job.currency = currency
        job.slug = await self.generate_slug(title, job.organization.ref.id)

        # Check if any embedding-relevant field has changed
        changed = (
            orig["title"] != title
            or orig["description"] != description
            or orig["skills"] != skills
            or orig["location"] != location
            or orig["geo"] != geo
            or orig["min_salary"] != min_salary
            or orig["max_salary"] != max_salary
            or orig["min_experience"] != min_experience
            or orig["max_experience"] != max_experience
            or orig["job_type"] != job_type
            or orig["work_mode"] != work_mode
            or orig["currency"] != currency
        )

        if changed:
            job.embedding = await self._embeddings_service.generate_embeddings(
                text=self.format_job_for_embedding(
                    title=title,
                    description=description,
                    skills=skills,
                    location=location,
                    geo=geo,
                    min_salary=min_salary,
                    max_salary=max_salary,
                    min_experience=min_experience,
                    max_experience=max_experience,
                    job_type=job_type,
                    work_mode=work_mode,
                    currency=currency,
                )
            )
        # else: keep the existing embedding

        return await job.save(link_rule=WriteRules.DO_NOTHING)

    async def get(self, job_id: ObjectId) -> Job | None:
        """Get job by ID."""
        return await Job.get(job_id)

    async def get_by_slug(self, slug: str, organization_id: ObjectId) -> Job | None:
        """Get job by slug and organization ID."""
        return await Job.find_one(
            Job.slug == slug, Job.organization.id == organization_id
        )

    async def update_active(self, job: Job, *, is_active: bool) -> Job:
        """Update the given job."""
        job.is_active = is_active
        return await job.save()

    async def get_many_by_ids(self, job_ids: list[ObjectId]) -> list[Job | None]:
        """Get multiple jobs by IDs."""
        jobs = await Job.find(In(Job.id, job_ids)).to_list()
        job_by_id = {job.id: job for job in jobs}

        return [job_by_id.get(PydanticObjectId(job_id)) for job_id in job_ids]

    async def get_many_by_slugs(
        self, slugs: list[tuple[ObjectId, str]]
    ) -> list[Job | None]:
        """Get multiple jobs by slugs and organization IDs."""
        filters = [
            And({"organization.$id": org_id}, {"slug": job_slug})
            for org_id, job_slug in slugs
        ]

        # Use the Or operator to combine all conditions
        jobs = await Job.find({"$or": filters}).to_list()
        job_by_slug = {(job.organization.ref.id, job.slug): job for job in jobs}

        return [
            job_by_slug.get((organization_id, job_slug))
            for organization_id, job_slug in slugs
        ]

    async def get_all_active(
        self,
        search_term: str | None = None,
        coordinates: Coordinates | None = None,
        proximity_km: float | None = None,
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

        search_criteria = Job.find(
            Job.is_active == True,  # noqa: E712
            Job.expires_at > datetime.now(UTC),
        )

        if search_term:
            search_criteria = Job.find(
                Job.is_active == True,  # noqa: E712
                Job.expires_at > datetime.now(UTC),
                {"$text": {"$search": search_term}},
            )

        # Apply location proximity filter if both location and proximity are provided
        if coordinates:
            proximity_km = proximity_km or 1.0  # Default to 1 km if not provided

            # The max_distance parameter expects meters, so convert km to meters
            max_distance_meters = proximity_km * 1000.0

            # Combine existing search criteria with geo query using NearSphere
            if search_term:
                search_criteria = Job.find(
                    Job.is_active == True,  # noqa: E712
                    {"$text": {"$search": search_term}},
                    NearSphere(
                        Job.geo,
                        coordinates.longitude,
                        coordinates.latitude,
                        max_distance=max_distance_meters,
                        min_distance=0.0,
                    ),
                )
            else:
                search_criteria = Job.find(
                    Job.is_active == True,  # noqa: E712
                    NearSphere(
                        Job.geo,
                        coordinates.longitude,
                        coordinates.latitude,
                        max_distance=max_distance_meters,
                        min_distance=0.0,
                    ),
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
        is_active: bool | None = None,
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

        if is_active is not None:
            search_criteria = search_criteria.find(Job.is_active == is_active)

        if search_term:
            search_criteria = search_criteria.find({"$text": {"$search": search_term}})

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_related(
        self,
        job_id: ObjectId,
        job_embedding: list[float],
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of all jobs related to a given job."""
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "job_embedding_vector_index",
                    "path": "embedding",
                    "queryVector": job_embedding,
                    "numCandidates": 100,  # higher is better for quality filtering
                    "limit": 50,
                }
            },
            {
                "$match": {
                    "_id": {"$ne": job_id},
                    "is_active": True,  # also exclude inactive jobs here
                    "expires_at": {"$gt": datetime.now(UTC)},
                }
            },
            {"$addFields": {"search_score": {"$meta": "vectorSearchScore"}}},
            {"$match": {"search_score": {"$gte": RELATED_JOBS_SIMILARITY_THRESHOLD}}},
            {"$sort": {"search_score": -1}},
        ]
        paginator: Paginator[Job, ObjectId] = Paginator(
            reverse=True,
            document_cls=Job,
            paginate_by="id",
        )

        search_criteria = Job.aggregate(
            aggregation_pipeline=pipeline,
            projection_model=Job,
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def delete(self, job: Job) -> None:
        """Delete a job."""
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


class JobApplicantRepo:
    def __init__(
        self,
        embeddings_service: EmbeddingsService,
    ) -> None:
        self._embeddings_service = embeddings_service

    async def update_all(self, account: Account, full_name: str) -> None:
        """Update all job applicants for the given account."""
        await JobApplicant.find(JobApplicant.account.id == account.id).update(
            Set({JobApplicant.account_full_name: full_name})
        )

    async def get(self, account_id: ObjectId, job_id: ObjectId) -> JobApplicant | None:
        """Get job applicant by account ID and job ID."""
        return await JobApplicant.find_one(
            JobApplicant.account.id == account_id,
            JobApplicant.job.id == job_id,
            fetch_links=True,
            nesting_depth=1,
        )

    async def get_many_counts_by_job_id(
        self,
        job_ids: list[ObjectId],
    ) -> list[dict[str, int] | None]:
        """
        Get many applicant counts by job ID.

        For each job ID:
        - Return a dict with all statuses and counts (0 if no applicants for that status).
        - Return {} if the job exists but has no applicants.
        - Return None if job does not exist.
        """
        pipeline = [
            {"$match": {"job.$id": {"$in": job_ids}}},
            {
                "$group": {
                    "_id": {"job_id": "$job.$id", "status": "$status"},
                    "count": {"$sum": 1},
                }
            },
        ]

        result = await JobApplicant.aggregate(pipeline).to_list()

        # job_id -> {status: count}
        job_status_counts: dict[ObjectId, dict[str, int]] = defaultdict(dict)
        for entry in result:
            job_id = entry["_id"]["job_id"]
            status = entry["_id"]["status"].lower()
            count = entry["count"]
            job_status_counts[job_id][status] = count

        # Final output list
        output: list[dict[str, int] | None] = []

        for job_id in job_ids:
            if job_id in job_status_counts:
                counts = {
                    status: job_status_counts[job_id].get(status, 0)
                    for status in get_args(JobApplicantStatus)
                }
                output.append(counts)
            else:
                exists = await Job.find_one(Job.id == job_id)
                output.append(
                    dict.fromkeys(get_args(JobApplicantStatus), 0) if exists else None
                )

        return output

    @staticmethod
    def generate_slug() -> str:
        """Generate a unique slug for the job applicant."""
        return uuid.uuid4().hex

    @staticmethod
    def format_profile_salary_expectations(
        salary_expectations: SalaryExpectations,
    ) -> str:
        return f"Preferred Monthly Salary: {salary_expectations.preferred_monthly_salary_inr} INR, Negotiable: {'Yes' if salary_expectations.negotiable else 'No'}"

    @staticmethod
    def format_profile_snapshot_for_embedding(profile: BaseProfile) -> str:
        education_str = ", ".join(
            [f"{edu.degree} at {edu.institution}" for edu in profile.education]
        )
        work_experience_str = ", ".join(
            [f"{exp.title} at {exp.organization}" for exp in profile.work_experience]
        )
        skills_str = ", ".join(profile.job_preferences)
        languages_str = ", ".join([lang.name for lang in profile.languages])
        locations_str = ", ".join(profile.locations_open_to_work)
        certifications_str = ", ".join([cert.name for cert in profile.certifications])
        return (
            f"Gender: {profile.gender or 'N/A'}\\n"
            f"Date of Birth: {profile.date_of_birth or 'N/A'}\\n"
            f"Address: {profile.address or 'N/A'}\\n"
            f"Marital Status: {profile.marital_status or 'N/A'}\\n"
            f"Category: {profile.category or 'N/A'}\\n"
            f"Open to work in: {locations_str or 'N/A'}\\n"
            f"Open to relocate anywhere: {'Yes' if profile.open_to_relocation_anywhere else 'No'}\\n"
            f"Education: {education_str or 'N/A'}\\n"
            f"Work Experience: {work_experience_str or 'N/A'}\\n"
            f"Job Preferences: {skills_str or 'N/A'}\\n"
            f"Languages: {languages_str or 'N/A'}\\n"
            f"Salary Expectations: {JobApplicantRepo.format_profile_salary_expectations(profile.salary_expectations) if profile.salary_expectations else 'N/A'}\\n"
            f"Certifications: {certifications_str or 'N/A'}"
        )

    async def create(
        self,
        account: Account,
        job: Job,
        applicant_fields: list[ApplicantField],
    ) -> JobApplicant:
        """Create a new job applicant."""
        application = JobApplicant(
            job=job,
            organization=job.organization,
            account=account,
            account_full_name=account.full_name,
            profile_snapshot=BaseProfile(
                address=account.profile.address,
                date_of_birth=account.profile.date_of_birth,
                gender=account.profile.gender,
                marital_status=account.profile.marital_status,
                category=account.profile.category,
                locations_open_to_work=account.profile.locations_open_to_work,
                open_to_relocation_anywhere=account.profile.open_to_relocation_anywhere,
                education=account.profile.education,
                licenses=account.profile.licenses,
                languages=account.profile.languages,
                job_preferences=account.profile.job_preferences,
                work_experience=account.profile.work_experience,
                salary_expectations=account.profile.salary_expectations,
                certifications=account.profile.certifications,
            ),
            profile_embedding=await self._embeddings_service.generate_embeddings(
                text=self.format_profile_snapshot_for_embedding(account.profile),
                task_type="RETRIEVAL_DOCUMENT",
            ),
            status="applied",
            applicant_fields=applicant_fields,
            slug=self.generate_slug(),
        )
        return await application.insert(link_rule=WriteRules.DO_NOTHING)

    async def bulk_update(
        self,
        job_applicant_ids: list[ObjectId],
        status: JobApplicantStatus,
    ) -> list[JobApplicant]:
        """Bulk update the status of job applicants and return updated documents."""
        await JobApplicant.find(In(JobApplicant.id, job_applicant_ids)).update(
            Set({JobApplicant.status: status})
        )
        return await JobApplicant.find(
            In(JobApplicant.id, job_applicant_ids),
            fetch_links=True,
            nesting_depth=1,
        ).to_list()

    async def get_all_by_job_id(
        self,
        job_id: ObjectId,
        status: JobApplicantStatus | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Return all applicants for a job."""
        search_criteria = JobApplicant.find(
            JobApplicant.job.id == job_id,
            fetch_links=True,
            nesting_depth=1,
        ).sort(-JobApplicant.id)
        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="id",
        )

        search_criteria = JobApplicant.find(JobApplicant.job.id == job_id)

        if status:
            search_criteria = search_criteria.find(JobApplicant.status == status)

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_by_slug(
        self, job_id: PydanticObjectId, slug: str
    ) -> JobApplicant | None:
        """Return a job applicant by slug."""
        return await JobApplicant.find_one(
            JobApplicant.slug == slug,
            JobApplicant.id == job_id,
        )

    async def get_many_by_ids(
        self, job_applicant_ids: list[ObjectId]
    ) -> list[JobApplicant | None]:
        """Get multiple job applicants by IDs."""
        job_applicants = await JobApplicant.find(
            In(JobApplicant.id, job_applicant_ids)
        ).to_list()
        job_applicant_by_id = {
            job_applicant.id: job_applicant for job_applicant in job_applicants
        }

        return [
            job_applicant_by_id.get(PydanticObjectId(job_id))
            for job_id in job_applicant_ids
        ]

    async def get_many_by_slugs(
        self, job_applicant_slugs: list[str]
    ) -> list[JobApplicant | None]:
        """Get multiple job applicants by slugs."""
        job_applicants = await JobApplicant.find(
            In(JobApplicant.slug, job_applicant_slugs)
        ).to_list()
        job_applicant_by_slug = {
            job_applicant.slug: job_applicant for job_applicant in job_applicants
        }

        return [job_applicant_by_slug.get(job_slug) for job_slug in job_applicant_slugs]

    async def get_all_by_account_id(
        self,
        account_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Get a paginated result of job applicants for the given account."""
        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="job.id",
        )

        search_criteria = JobApplicant.find(
            JobApplicant.account.id == account_id,
            fetch_links=True,
            nesting_depth=1,
        ).sort(-JobApplicant.id)

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_by_job_ids_paginated(
        self,
        job_ids: list[ObjectId],
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Get a paginated result of job applicants for the given job IDs."""
        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="id",
        )

        search_criteria = JobApplicant.find(
            In(JobApplicant.job.id, job_ids),
            fetch_links=True,
            nesting_depth=1,
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def get_all_by_organization_id_paginated(
        self,
        organization_id: ObjectId,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Get a paginated result of job applicants for the given organization IDs."""
        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="id",
        )

        search_criteria = JobApplicant.find(
            JobApplicant.organization.id == organization_id,
            fetch_links=True,
            nesting_depth=1,
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=first,
            last=last,
            before=ObjectId(before) if before else None,
            after=ObjectId(after) if after else None,
        )

    async def vector_search(
        self,
        job_id: ObjectId,
        query: str,
        top_k: int,
        status: JobApplicantStatus | None = None,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        query_embedding = await self._embeddings_service.generate_embeddings(
            text=query,
            task_type="RETRIEVAL_QUERY",
        )
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "job_applicant_embedding_vector_index",
                    "path": "profile_embedding",
                    "queryVector": query_embedding,
                    "numCandidates": top_k * 4,
                    "limit": top_k,
                }
            },
        ]

        if status is not None:
            pipeline.append({"$match": {"job.$id": ObjectId(job_id), "status": status}})
        else:
            pipeline.append({"$match": {"job.$id": ObjectId(job_id)}})
        pipeline.extend(
            [
                {"$addFields": {"search_score": {"$meta": "vectorSearchScore"}}},
                {
                    "$match": {
                        "search_score": {
                            "$gte": RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD
                        }
                    }
                },
                {"$sort": {"search_score": -1}},
            ]
        )

        search_criteria = JobApplicant.aggregate(
            pipeline, projection_model=JobApplicant
        )

        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="id",
        )

        return await paginator.paginate(
            search_criteria=search_criteria,
            first=top_k,
            last=None,
        )


class JobApplicationFormRepo:
    async def get_by_job_id(self, job_id: ObjectId) -> JobApplicationForm | None:
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


class JobMetricRepo:
    async def create_core_metric(
        self,
        job_id: ObjectId,
        organization_id: ObjectId,
        event_type: CoreJobMetricEventType,
        account_id: ObjectId,
        fingerprint_id: str,
    ) -> CoreJobMetric:
        """Create a new core job metric."""
        job_metric = CoreJobMetric(
            timestamp=datetime.now(UTC),
            metadata=CoreJobMetricMetadata(
                job_id=job_id,
                organization_id=organization_id,
                event_type=event_type,
                account_id=account_id,
                fingerprint_id=fingerprint_id,
            ),
        )
        return await job_metric.insert(link_rule=WriteRules.DO_NOTHING)

    async def create_impression_metric(
        self,
        job_id: ObjectId,
        organization_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
        fingerprint_id: str,
        impression_id: str,
        account_id: ObjectId | None = None,
    ) -> ImpressionJobMetric:
        """Create a new impression job metric."""
        job_metric = ImpressionJobMetric(
            timestamp=datetime.now(UTC),
            metadata=ImpressionJobMetricMetadata(
                job_id=job_id,
                organization_id=organization_id,
                event_type=event_type,
                account_id=account_id,
                fingerprint_id=fingerprint_id,
                impression_id=impression_id,
            ),
        )

        return await job_metric.insert(link_rule=WriteRules.DO_NOTHING)

    async def get_count(
        self,
        job_id: ObjectId,
        event_type: CoreJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:
        """Get the count of job metrics for a given job ID and event type."""
        expressions = [
            CoreJobMetric.metadata.job_id == job_id,
            CoreJobMetric.metadata.event_type == event_type,
        ]

        if start_date:
            expressions.append(CoreJobMetric.timestamp >= start_date)
        if end_date:
            expressions.append(CoreJobMetric.timestamp <= end_date)

        return await CoreJobMetric.find(And(*expressions)).count()

    async def get_organization_count(
        self,
        organization_id: ObjectId,
        event_type: CoreJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:
        """Get the count of job metrics for a given organization ID and event type."""
        expressions = [
            CoreJobMetric.metadata.organization_id == organization_id,
            CoreJobMetric.metadata.event_type == event_type,
        ]

        if start_date:
            expressions.append(CoreJobMetric.timestamp >= start_date)
        if end_date:
            expressions.append(CoreJobMetric.timestamp <= end_date)

        return await CoreJobMetric.find(And(*expressions)).count()

    async def get_organization_metric_points(
        self, organization_id: ObjectId, event_type: CoreJobMetricEventType
    ) -> list[dict[str, Any]]:
        pipeline = [
            {
                "$match": {
                    "metadata.organization_id": organization_id,
                    "metadata.event_type": event_type,
                }
            },
            {
                "$group": {
                    "_id": {"$dateTrunc": {"date": "$timestamp", "unit": "minute"}},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"_id": pymongo.ASCENDING}},
            {"$project": {"timestamp": "$_id", "count": 1, "_id": 0}},
        ]

        return await CoreJobMetric.aggregate(pipeline).to_list()

    async def get_metric_points(
        self, job_id: ObjectId, event_type: CoreJobMetricEventType
    ) -> list[dict[str, Any]]:
        pipeline = [
            {"$match": {"metadata.job_id": job_id, "metadata.event_type": event_type}},
            {
                "$group": {
                    "_id": {"$dateTrunc": {"date": "$timestamp", "unit": "minute"}},
                    "count": {"$sum": 1},
                }
            },
            {"$sort": {"_id": pymongo.ASCENDING}},
            {"$project": {"timestamp": "$_id", "count": 1, "_id": 0}},
        ]

        return await CoreJobMetric.aggregate(pipeline).to_list()
