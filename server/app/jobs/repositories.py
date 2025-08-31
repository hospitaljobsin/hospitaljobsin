import hashlib
import secrets
import uuid
from collections import defaultdict
from datetime import UTC, datetime, time, timedelta
from enum import Enum
from typing import Any, Literal, get_args

import pymongo
from beanie import DeleteRules, PydanticObjectId, WriteRules
from beanie.odm.queries.aggregation import AggregationQuery
from beanie.operators import And, In, Or, Set
from bson import ObjectId
from pydantic import ValidationError
from redis.asyncio import Redis

from app.accounts.documents import Account, BaseProfile, SalaryExpectations
from app.base.models import Address, GeoObject
from app.core.constants import (
    DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT,
    JOB_APPLICANT_EMBEDDING_DIMENSIONS,
    JOB_APPLICANT_EMBEDDING_INDEX_NAME,
    JOB_EMBEDDING_DIMENSIONS,
    JOB_SEARCH_INDEX_NAME,
    RELATED_JOB_APPLICANTS_SIMILARITY_THRESHOLD,
    RELATED_JOBS_SIMILARITY_THRESHOLD,
    TRENDING_JOBS_LIMIT,
    CoreJobMetricEventType,
    ImpressionJobMetricEventType,
    JobApplicantStatus,
    JobKindType,
)
from app.core.formatting import clean_markdown_text, markdown_to_clean_html, slugify
from app.database.paginator import PaginatedResult, Paginator, SearchPaginator
from app.embeddings.services import EmbeddingsService
from app.geocoding.repositories import RegionRepo
from app.jobs.agents.applicant_analysis import JobApplicantAnalysisOutput
from app.jobs.agents.applicant_query_parser import (
    ApplicantQueryFilters,
    ApplicantQueryParserAgent,
    LocationWithRadius,
)
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
    JobApplicantAnalysis,
    JobApplicationForm,
    SavedJob,
    SearchableJob,
)


class JobSearchSortBy(Enum):
    RELEVANCE = "relevance"
    UPDATED_AT = "updated_at"


class JobSortBy(Enum):
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    ALPHABETICAL = "alphabetical"
    LAST_APPLICANT_APPLIED_AT = "last_applicant_applied_at"


class JobWorkMode(Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    OFFICE = "office"


class JobType(Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"
    LOCUM = "locum"


class JobRepo:
    def __init__(
        self, embeddings_service: EmbeddingsService, region_repo: RegionRepo
    ) -> None:
        self._embeddings_service = embeddings_service
        self._region_repo = region_repo

    async def generate_slug(self, title: str, organization_id: ObjectId) -> str:
        """Generate a slug from the job title."""
        slug = slugify(title)
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

    async def get_for_whatsapp_message_generation(self) -> list[Job]:
        """Get all jobs that are active and haven't been posted already, for whatsapp message generation."""
        return await Job.find(
            Job.is_active == True,
            Job.whatsapp_channel_posted_at == None,
            Or(Job.expires_at == None, Job.expires_at > datetime.now(UTC)),
            fetch_links=True,
            nesting_depth=2,
        ).to_list()

    async def mark_as_posted_on_whatsapp(self, job_ids: list[ObjectId]) -> None:
        """Mark a job as posted on whatsapp."""
        await Job.find(In(Job.id, job_ids)).set(
            {Job.whatsapp_channel_posted_at: datetime.now(UTC)}
        )

    async def create(
        self,
        *,
        organization: Organization,
        title: str,
        description: str,
        location: str | None = None,
        geo: GeoObject | None = None,
        address: Address | None = None,
        applicant_locations: list[str] = [],
        external_application_url: str | None = None,
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
            ),
            dimensions=JOB_EMBEDDING_DIMENSIONS,
        )
        job = Job(
            title=title,
            description=description,
            description_cleaned=clean_markdown_text(description),
            description_html=markdown_to_clean_html(description),
            embedding=embedding,
            vacancies=vacancies,
            location=location,
            applicant_locations=applicant_locations,
            geo=geo,
            address=address,
            min_salary=min_salary,
            max_salary=max_salary,
            is_salary_negotiable=is_salary_negotiable,
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
        is_active: bool,
        location: str | None = None,
        address: Address | None = None,
        geo: GeoObject | None = None,
        applicant_locations: list[str] = [],
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
        if job.title != title:
            job.slug = await self.generate_slug(title, job.organization.ref.id)
        job.title = title
        job.description = description
        job.description_cleaned = clean_markdown_text(description)
        job.description_html = markdown_to_clean_html(description)
        job.vacancies = vacancies
        job.location = location
        job.applicant_locations = applicant_locations
        job.geo = geo
        job.address = address
        job.min_salary = min_salary
        job.max_salary = max_salary
        job.is_salary_negotiable = is_salary_negotiable
        job.min_experience = min_experience
        job.max_experience = max_experience
        job.expires_at = expires_at
        job.type = job_type
        job.work_mode = work_mode
        job.skills = skills
        job.currency = currency
        job.is_active = is_active
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
                ),
                dimensions=JOB_EMBEDDING_DIMENSIONS,
            )
        # else: keep the existing embedding
        job.updated_at = datetime.now(UTC)

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

    async def get_autocomplete_suggestions(self, search_term: str) -> list[str]:
        """Get autocomplete suggestions for a search term."""
        pipeline = [
            {
                "$search": {
                    "index": JOB_SEARCH_INDEX_NAME,
                    "autocomplete": {
                        "query": search_term,
                        "path": "title",
                    },
                }
            },
            {"$limit": DEFAULT_AUTOCOMPLETE_SUGGESTIONS_LIMIT},
        ]

        results = await Job.aggregate(pipeline, projection_model=None).to_list()
        return [result["title"] for result in results]

    async def get_all_active(
        self,
        work_mode: list[JobWorkMode],
        job_type: list[JobType],
        search_term: str | None = None,
        location: str | None = None,
        proximity_km: float | None = None,
        min_experience: int | None = None,
        max_experience: int | None = None,
        min_salary: int | None = None,
        max_salary: int | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
        sort_by: JobSearchSortBy = JobSearchSortBy.RELEVANCE,
    ) -> PaginatedResult[SearchableJob, str]:
        """Get a paginated result of active jobs with advanced search capabilities."""
        paginator: SearchPaginator[Job, SearchableJob] = SearchPaginator(
            document_cls=Job,
            projection_model=SearchableJob,
            search_index_name=JOB_SEARCH_INDEX_NAME,
            calculate_total_count=True,  # Disable for now to debug
        )

        # Build Atlas Search query
        search_query = {
            "compound": {
                "must": [
                    # Always filter for active jobs
                    {"equals": {"value": True, "path": "is_active"}},
                    # Filter for non-expired jobs (either null or greater than current date)
                    {
                        "compound": {
                            "should": [
                                {"equals": {"value": None, "path": "expires_at"}},
                                {
                                    "range": {
                                        "path": "expires_at",
                                        "gt": datetime.now(UTC),
                                    }
                                },
                            ],
                            "minimumShouldMatch": 1,
                        }
                    },
                ],
                "should": [],
                "filter": [],
            },
        }

        match sort_by:
            case JobSearchSortBy.RELEVANCE:
                search_query["sort"] = {"score": {"order": -1}}
            case JobSearchSortBy.UPDATED_AT:
                search_query["sort"] = {"updated_at": {"order": -1}}

        # Add geospatial search if coordinates provided
        if location:
            region = await self._region_repo.get_by_name(location)
            if region is None:
                return paginator.empty()

            proximity_km = proximity_km or 1.0
            max_distance_meters = proximity_km * 1000.0

            if region.geometry is not None:
                print("region.geometry: ", region.geometry)
                search_query["compound"]["must"].append(
                    {
                        "geoWithin": {
                            "path": "geo",
                            "geometry": region.geometry,
                        }
                    }
                )
            else:
                # Use geoWithin for strict distance filtering
                search_query["compound"]["must"].append(
                    {
                        "geoWithin": {
                            "circle": {
                                "center": {
                                    "type": "Point",
                                    "coordinates": [
                                        region.coordinates.coordinates[0],
                                        region.coordinates.coordinates[1],
                                    ],
                                },
                                "radius": max_distance_meters,
                            },
                            "path": "geo",
                        }
                    }
                )

        # Add text search if provided
        if search_term:
            search_query["compound"]["must"].append(
                {
                    "compound": {
                        "should": [
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "title",
                                    "score": {"boost": {"value": 10}},
                                }
                            },
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "description_cleaned",
                                    "score": {"boost": {"value": 5}},
                                }
                            },
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "skills",
                                    "score": {"boost": {"value": 8}},
                                }
                            },
                            {
                                "text": {
                                    "query": search_term,
                                    "path": "location",
                                    "score": {"boost": {"value": 3}},
                                }
                            },
                        ]
                    }
                }
            )

        # Add experience filters
        if min_experience is not None:
            # Job should either:
            # 1. Have max_experience >= min_experience, OR
            # 2. Have min_experience >= min_experience (if max_experience is not set)
            search_query["compound"]["must"].append(
                {
                    "compound": {
                        "should": [
                            {
                                "range": {
                                    "path": "max_experience",
                                    "gte": min_experience,
                                }
                            },
                            {
                                "range": {
                                    "path": "min_experience",
                                    "gte": min_experience,
                                }
                            },
                        ]
                    }
                }
            )

        if max_experience is not None:
            # Job should either:
            # 1. Have min_experience <= max_experience, OR
            # 2. Have max_experience <= max_experience (if min_experience is not set)
            search_query["compound"]["must"].append(
                {
                    "compound": {
                        "should": [
                            {
                                "range": {
                                    "path": "min_experience",
                                    "lte": max_experience,
                                }
                            },
                            {
                                "range": {
                                    "path": "max_experience",
                                    "lte": max_experience,
                                }
                            },
                        ]
                    }
                }
            )

        # Add salary filters
        if min_salary is not None:
            # Job should either:
            # 1. Have max_salary >= min_salary, OR
            # 2. Have min_salary >= min_salary (if max_salary is not set)
            search_query["compound"]["must"].append(
                {
                    "compound": {
                        "should": [
                            {"range": {"path": "max_salary", "gte": min_salary}},
                            {"range": {"path": "min_salary", "gte": min_salary}},
                        ]
                    }
                }
            )

        if max_salary is not None:
            # Job should either:
            # 1. Have min_salary <= max_salary, OR
            # 2. Have max_salary <= max_salary (if min_salary is not set)
            search_query["compound"]["must"].append(
                {
                    "compound": {
                        "should": [
                            {"range": {"path": "min_salary", "lte": max_salary}},
                            {"range": {"path": "max_salary", "lte": max_salary}},
                        ]
                    }
                }
            )

        # Add work mode filter
        if work_mode and len(work_mode) > 0:
            # Use multiple values
            search_query["compound"]["filter"].append(
                {
                    "compound": {
                        "should": [
                            {"text": {"query": mode.value, "path": "work_mode"}}
                            for mode in work_mode
                        ],
                        "minimumShouldMatch": 1,
                    }
                }
            )

        # Add job type filter
        if job_type and len(job_type) > 0:
            search_query["compound"]["filter"].append(
                {
                    "compound": {
                        "should": [
                            {"text": {"query": given_type.value, "path": "type"}}
                            for given_type in job_type
                        ],
                        "minimumShouldMatch": 1,
                    }
                }
            )

        return await paginator.paginate(
            search_query=search_query,
            first=first,
            last=last,
            before=before if before else None,
            after=after if after else None,
        )

    async def get_all_trending(
        self,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
    ) -> PaginatedResult[Job, ObjectId]:
        """Get a paginated result of the trending jobs."""
        paginator: Paginator[ImpressionJobMetric, ObjectId, Job] = Paginator(
            reverse=True,
            document_cls=ImpressionJobMetric,
            paginate_by="id",
            apply_ordering=False,
        )

        seven_days_ago = datetime.now(UTC) - timedelta(days=7)

        pipeline = [
            {
                "$match": {
                    "metadata.event_type": "view_start",
                    "timestamp": {"$gte": seven_days_ago},
                }
            },
            {"$group": {"_id": "$metadata.job_id", "views": {"$sum": 1}}},
            {"$sort": {"views": -1}},
            {
                "$lookup": {
                    "from": "jobs",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "job",
                }
            },
            {"$unwind": "$job"},
            {
                "$match": {
                    "job.is_active": True,
                    "$or": [
                        {"job.expires_at": {"$gt": datetime.now(UTC)}},
                        {"job.expires_at": None},
                    ],
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": {"$mergeObjects": ["$job", {"views": "$views"}]}
                }
            },
            {"$limit": TRENDING_JOBS_LIMIT},
        ]

        search_criteria = ImpressionJobMetric.aggregate(
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

    async def get_all_by_organization_id(
        self,
        *,
        organization_id: ObjectId,
        sort_by: JobSortBy,
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
            # we apply our own ordering in the query, so this isn't needed!
            apply_ordering=False,
        )

        search_criteria = Job.find(Job.organization.id == organization_id)

        if is_active is not None:
            search_criteria = search_criteria.find(Job.is_active == is_active)

        if search_term:
            search_criteria = search_criteria.find({"$text": {"$search": search_term}})

        # Apply sorting
        match sort_by:
            case JobSortBy.CREATED_AT:
                search_criteria = search_criteria.sort(-Job.id)
            case JobSortBy.UPDATED_AT:
                search_criteria = search_criteria.sort(-Job.updated_at)
            case JobSortBy.ALPHABETICAL:
                search_criteria = search_criteria.sort(+Job.title)
            case JobSortBy.LAST_APPLICANT_APPLIED_AT:
                search_criteria = search_criteria.sort(
                    [-Job.last_applicant_applied_at, -Job.is_active, -Job.id]
                )

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
    ) -> PaginatedResult[SearchableJob, str]:
        """Get a paginated result of all jobs related to a given job."""
        paginator: SearchPaginator[Job, SearchableJob] = SearchPaginator(
            document_cls=Job,
            projection_model=SearchableJob,
            search_index_name=JOB_SEARCH_INDEX_NAME,
            minimum_score=RELATED_JOBS_SIMILARITY_THRESHOLD,
        )

        search_query = {
            "knnBeta": {
                "vector": job_embedding,
                "path": "embedding",
                "k": 50,
                "filter": {
                    "compound": {
                        "mustNot": [
                            {"equals": {"value": job_id, "path": "_id"}},
                        ],
                        "must": [
                            {"equals": {"value": True, "path": "is_active"}},
                            {
                                "compound": {
                                    "should": [
                                        {
                                            "equals": {
                                                "value": None,
                                                "path": "expires_at",
                                            }
                                        },
                                        {
                                            "range": {
                                                "path": "expires_at",
                                                "gt": datetime.now(UTC),
                                            }
                                        },
                                    ],
                                    "minimumShouldMatch": 1,
                                }
                            },
                        ],
                    }
                },
            }
        }

        return await paginator.paginate(
            search_query=search_query,
            first=first,
            last=last,
            before=before if before else None,
            after=after if after else None,
        )

    async def delete(self, job: Job) -> None:
        """Delete a job."""
        await SavedJob.find(SavedJob.job.id == job.id).delete()
        await JobApplicant.find(JobApplicant.job.id == job.id).delete()
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
            saved_job = await SavedJob(
                account=account_id,
                job=job,
                organization=job.organization,
            ).save()
        return saved_job

    async def delete(self, saved_job: SavedJob) -> None:
        """Unsave the given job under the given account."""
        await saved_job.delete(link_rule=DeleteRules.DO_NOTHING)


class JobApplicantsSortBy(Enum):
    OVERALL_SCORE = "overall_score"
    CREATED_AT = "created_at"


class JobApplicantRepo:
    def __init__(
        self,
        embeddings_service: EmbeddingsService,
        applicant_query_parser_agent: ApplicantQueryParserAgent,
        region_repo: RegionRepo,
        redis_client: Redis,
    ) -> None:
        self._embeddings_service = embeddings_service
        self._applicant_query_parser_agent = applicant_query_parser_agent
        self._region_repo = region_repo
        self._redis_client = redis_client

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
        locations_str = ", ".join([loc.name for loc in profile.locations_open_to_work])
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
        job.last_applicant_applied_at = datetime.now(UTC)
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
                total_work_experience_years=account.profile.total_work_experience_years,
                salary_expectations=account.profile.salary_expectations,
                certifications=account.profile.certifications,
                professional_summary=account.profile.professional_summary,
                headline=account.profile.headline,
            ),
            profile_embedding=await self._embeddings_service.generate_embeddings(
                text=self.format_profile_snapshot_for_embedding(account.profile),
                task_type="RETRIEVAL_DOCUMENT",
                dimensions=JOB_APPLICANT_EMBEDDING_DIMENSIONS,
            ),
            status="applied",
            applicant_fields=applicant_fields,
            slug=self.generate_slug(),
            analysis_status="pending",
        )
        return await application.insert(link_rule=WriteRules.WRITE)

    async def update_analysis(
        self,
        job_applicant: JobApplicant,
        analysis: JobApplicantAnalysisOutput | None,
    ) -> JobApplicant:
        """Update the analysis for a job applicant."""
        if analysis is not None:
            job_applicant.analysis = JobApplicantAnalysis(
                analysed_fields=analysis.analysed_fields,
                overall_summary=analysis.overall_summary,
                strengths=analysis.strengths,
                risk_flags=analysis.risk_flags,
                created_at=datetime.now(UTC),
            )
            job_applicant.overall_score = analysis.overall_score
            job_applicant.analysis_status = "complete"
        else:
            job_applicant.analysis_status = "failed"
        await job_applicant.save()
        return job_applicant

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

    def _generate_natural_language_query_cache_key(
        self,
        natural_language_query: str,
    ) -> str:
        return f"applicant_nlq:{hashlib.sha256(natural_language_query.encode('utf-8')).hexdigest()}"

    async def _get_natural_language_query_filters(
        self,
        natural_language_query: str,
    ) -> ApplicantQueryFilters:
        # remove leading and trailing whitespace
        natural_language_query = natural_language_query.strip()
        cache_key = self._generate_natural_language_query_cache_key(
            natural_language_query
        )
        cached_result = await self._redis_client.get(cache_key)
        if cached_result is not None:
            try:
                return ApplicantQueryFilters.model_validate_json(cached_result)
            except ValidationError:
                # invalid/ outdated query filters were cached, run agent again
                pass
        result = await self._applicant_query_parser_agent.run(
            user_prompt=natural_language_query
        )
        await self._redis_client.set(
            cache_key,
            result.output.model_dump_json(),
        )
        return result.output

    async def _build_natural_language_query_pipeline(
        self,
        natural_language_query: str,
        job_id: ObjectId,
        status: JobApplicantStatus | None,
        limit: int,
        sort_by: JobApplicantsSortBy,
    ) -> list[dict]:
        filters = await self._get_natural_language_query_filters(natural_language_query)

        pipeline: list[dict] = []

        if filters.query is not None:
            query_embedding = await self._embeddings_service.generate_embeddings(
                text=filters.query,
                task_type="RETRIEVAL_QUERY",
                use_cache=True,
                dimensions=JOB_APPLICANT_EMBEDDING_DIMENSIONS,
            )

            pipeline.append(
                {
                    "$vectorSearch": {
                        "index": JOB_APPLICANT_EMBEDDING_INDEX_NAME,
                        "path": "profile_embedding",
                        "queryVector": query_embedding,
                        "numCandidates": limit * 4,
                        "limit": limit,
                    }
                }
            )

        # 1. min_total_work_experience_years / max_total_work_experience_years
        if (
            filters.min_total_work_experience_years is not None
            or filters.max_total_work_experience_years is not None
        ):
            experience_query = {}
            if filters.min_total_work_experience_years is not None:
                experience_query["$gte"] = filters.min_total_work_experience_years
            if filters.max_total_work_experience_years is not None:
                experience_query["$lte"] = filters.max_total_work_experience_years
            pipeline.append(
                {
                    "$match": {
                        "profile_snapshot.total_work_experience_years": experience_query
                    }
                }
            )

        # 2. location
        if filters.location is not None:
            geocoded_points: list[tuple[GeoObject, int]] = []
            location_names: list[LocationWithRadius] = []
            # Geocode if needed
            if isinstance(filters.location, LocationWithRadius):
                location_names.append(filters.location)
            elif isinstance(filters.location, list) and all(
                isinstance(loc, LocationWithRadius) for loc in filters.location
            ):
                location_names.extend(filters.location)
            if location_names:
                for name in location_names:
                    geo_result = await self._region_repo.get_by_name(name.location)
                    if geo_result is not None:
                        geocoded_points.append(
                            (
                                GeoObject(
                                    type="Point",
                                    coordinates=(
                                        geo_result.coordinates.coordinates[0],
                                        geo_result.coordinates.coordinates[1],
                                    ),
                                ),
                                name.radius,
                            )
                        )
            # Apply geo query if we have geocoded points
            if geocoded_points:
                if len(geocoded_points) == 1:
                    geo, radius = geocoded_points[0]
                    pipeline.append(
                        {
                            "$match": {
                                "profile_snapshot.locations_open_to_work.geo": {
                                    "$geoWithin": {
                                        "$centerSphere": [
                                            geo.coordinates,
                                            radius / 6378137,  # meters to radians
                                        ]
                                    }
                                }
                            }
                        }
                    )
                else:
                    pipeline.append(
                        {
                            "$match": {
                                "$or": [
                                    {
                                        "profile_snapshot.locations_open_to_work.geo": {
                                            "$geoWithin": {
                                                "$centerSphere": [
                                                    geo.coordinates,
                                                    radius
                                                    / 6378137,  # meters to radians
                                                ]
                                            }
                                        }
                                    }
                                    for (geo, radius) in geocoded_points
                                ]
                            }
                        }
                    )

        # 3. open_to_relocation_anywhere
        if filters.open_to_relocation_anywhere is not None:
            pipeline.append(
                {
                    "$match": {
                        "profile_snapshot.open_to_relocation_anywhere": filters.open_to_relocation_anywhere
                    }
                }
            )

        # 4. gender
        if filters.gender is not None:
            pipeline.append({"$match": {"profile_snapshot.gender": filters.gender}})

        # 5. min_age / max_age (convert to date_of_birth range)
        today = datetime.now(tz=UTC).date()
        dob_query = {}
        if filters.min_age is not None:
            max_dob = today.replace(year=today.year - filters.min_age)
            max_dob_dt = datetime.combine(max_dob, time.min, tzinfo=UTC)
            dob_query["$lte"] = max_dob_dt
        if filters.max_age is not None:
            min_dob = today.replace(year=today.year - filters.max_age - 1)
            min_dob_dt = datetime.combine(min_dob, time.min, tzinfo=UTC)
            dob_query["$gte"] = min_dob_dt
        if dob_query:
            pipeline.append({"$match": {"profile_snapshot.date_of_birth": dob_query}})

        # 6. marital_status
        if filters.marital_status is not None:
            pipeline.append(
                {"$match": {"profile_snapshot.marital_status": filters.marital_status}}
            )

        # 7. category
        if filters.category is not None:
            pipeline.append({"$match": {"profile_snapshot.category": filters.category}})

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

        # Add sorting to the pipeline based on sort_by
        match sort_by:
            case JobApplicantsSortBy.OVERALL_SCORE:
                pipeline.append({"$sort": {"overall_score": -1}})
            case JobApplicantsSortBy.CREATED_AT:
                pipeline.append({"$sort": {"_id": -1}})

        return pipeline

    async def get_all_by_job_id(
        self,
        job_id: ObjectId,
        natural_language_query: str | None = None,
        search_session_id: str | None = None,
        status: JobApplicantStatus | None = None,
        first: int | None = None,
        last: int | None = None,
        before: str | None = None,
        after: str | None = None,
        sort_by: JobApplicantsSortBy = JobApplicantsSortBy.OVERALL_SCORE,
    ) -> PaginatedResult[JobApplicant, ObjectId]:
        """Return all applicants for a job."""
        paginator: Paginator[JobApplicant, ObjectId] = Paginator(
            reverse=True,
            document_cls=JobApplicant,
            paginate_by="id",
            # we add ordering in the pipeline/ search criteria, so we don't need to apply ordering here
            apply_ordering=False,
        )

        if search_session_id is not None:
            # TODO: retrieve cached results and paginate on it
            # get the IDs from the cache and fetch from MongoDB directly
            pass

        if natural_language_query is not None:

            async def get_search_criteria(
                pagination_limit: int,
            ) -> AggregationQuery[JobApplicant]:
                pipeline = await self._build_natural_language_query_pipeline(
                    natural_language_query=natural_language_query,
                    job_id=job_id,
                    status=status,
                    limit=pagination_limit,
                    sort_by=sort_by,
                )

                # TODO: execute the pipeline here itself, cache the result in redis
                # then pass the entire cache here.
                # we need a different kind of paginator- an in memory paginator here
                # or this could be done more efficiently by storing the keys in redis itself?
                return JobApplicant.aggregate(pipeline, projection_model=JobApplicant)

            # TODO: store the results in the cache before paginating initially, maybe via a hook?
            # but anyways, we need to load upper-limit documents in memory (like 100 worst case)

            return await paginator.paginate(
                search_criteria=get_search_criteria,
                first=first,
                last=last,
                before=ObjectId(before) if before else None,
                after=ObjectId(after) if after else None,
            )
        search_criteria = JobApplicant.find(
            JobApplicant.job.id == job_id,
            fetch_links=True,
            nesting_depth=1,
        )

        if status:
            search_criteria = search_criteria.find(JobApplicant.status == status)

        match sort_by:
            case JobApplicantsSortBy.OVERALL_SCORE:
                search_criteria = search_criteria.sort(-JobApplicant.overall_score)
            case JobApplicantsSortBy.CREATED_AT:
                search_criteria = search_criteria.sort(-JobApplicant.id)

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

    async def get_impression_count(
        self,
        job_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:
        """Get the count of job metrics for a given job ID and event type."""
        expressions = [
            ImpressionJobMetric.metadata.job_id == job_id,
            ImpressionJobMetric.metadata.event_type == event_type,
        ]

        if start_date:
            expressions.append(ImpressionJobMetric.timestamp >= start_date)
        if end_date:
            expressions.append(ImpressionJobMetric.timestamp <= end_date)

        return await ImpressionJobMetric.find(And(*expressions)).count()

    async def get_organization_impression_count(
        self,
        organization_id: ObjectId,
        event_type: ImpressionJobMetricEventType,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> int:
        """Get the count of job metrics for a given organization ID and event type."""
        expressions = [
            ImpressionJobMetric.metadata.organization_id == organization_id,
            ImpressionJobMetric.metadata.event_type == event_type,
        ]

        if start_date:
            expressions.append(ImpressionJobMetric.timestamp >= start_date)
        if end_date:
            expressions.append(ImpressionJobMetric.timestamp <= end_date)

        return await ImpressionJobMetric.find(And(*expressions)).count()

    async def get_organization_impression_metric_points(
        self, organization_id: ObjectId, event_type: ImpressionJobMetricEventType
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

        return await ImpressionJobMetric.aggregate(pipeline).to_list()

    async def get_impression_metric_points(
        self, job_id: ObjectId, event_type: ImpressionJobMetricEventType
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

        return await ImpressionJobMetric.aggregate(pipeline).to_list()
