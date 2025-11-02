from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.base.models import BoundingBox
from app.context import AuthInfo

from .models import JobClusterFilters
from .repositories import (
    JobApplicantRepo,
    JobRepo,
    JobSearchSortBy,
    JobType,
    JobWorkMode,
    SavedJobRepo,
)
from .services import JobClusterService
from .types import (
    AutocompleteJobsPayloadType,
    BoundingBoxInput,
    JobApplicantConnectionType,
    JobAutocompleteSuggestionType,
    JobClusterConnectionType,
    JobConnectionType,
    JobSearchSortByEnum,
    JobTypeFilterEnum,
    JobWorkModeFilterEnum,
    SavedJobConnectionType,
)


@strawberry.type
class JobQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=JobConnectionType,
        description="Get all active jobs available.",
    )
    @inject
    async def jobs(
        self,
        job_repo: Annotated[JobRepo, Inject],
        work_mode: Annotated[
            list[JobWorkModeFilterEnum],
            strawberry.argument(
                description="The work mode to filter jobs by.",
            ),
        ],
        job_type: Annotated[
            list[JobTypeFilterEnum],
            strawberry.argument(
                description="The type of job to filter jobs by.",
            ),
        ],
        sort_by: Annotated[
            JobSearchSortByEnum,
            strawberry.argument(
                description="The type of job search sort by.",
            ),
        ] = JobSearchSortByEnum.RELEVANCE,
        location: Annotated[
            str | None,
            strawberry.argument(
                description="The location to search for jobs",
            ),
        ] = None,
        proximity_km: Annotated[
            float | None,
            strawberry.argument(
                description="The proximity in km to search for jobs",
            ),
        ] = None,
        bounds: Annotated[
            BoundingBoxInput | None,
            strawberry.argument(
                description="Geographic bounding box to filter jobs by map viewport",
            ),
        ] = None,
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
            ),
        ] = None,
        min_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum years of experience required",
            ),
        ] = None,
        max_experience: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum years of experience required",
            ),
        ] = None,
        min_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The minimum salary for the job",
            ),
        ] = None,
        max_salary: Annotated[
            int | None,
            strawberry.argument(
                description="The maximum salary for the job",
            ),
        ] = None,
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> JobConnectionType:
        paginated_result = await job_repo.get_all_active(
            search_term=search_term,
            location=location,
            proximity_km=proximity_km,
            bounds=BoundingBox(**bounds.__dict__) if bounds else None,
            min_experience=min_experience,
            max_experience=max_experience,
            min_salary=min_salary,
            max_salary=max_salary,
            first=first,
            last=last,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            work_mode=[JobWorkMode(mode.value.lower()) for mode in work_mode],
            job_type=[JobType(given_type.value.lower()) for given_type in job_type],
            sort_by=JobSearchSortBy(sort_by.value.lower()),
        )

        return JobConnectionType.marshal(
            paginated_result=paginated_result,
        )

    @strawberry.field(  # type: ignore[misc]
        graphql_type=JobConnectionType,
        description="Get the trending jobs.",
    )
    @inject
    async def trending_jobs(
        self,
        job_repo: Annotated[JobRepo, Inject],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> JobConnectionType:
        paginated_result = await job_repo.get_all_trending(
            first=first,
            last=last,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
        )

        return JobConnectionType.marshal(
            paginated_result=paginated_result,
        )

    @strawberry.field(  # type: ignore[misc]
        description="Get all saved jobs for the current user.",
        graphql_type=SavedJobConnectionType,
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def saved_jobs(
        self,
        info: AuthInfo,
        saved_job_repo: Annotated[SavedJobRepo, Inject],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> SavedJobConnectionType:
        result = await saved_job_repo.get_all_saved(
            account_id=info.context["current_user"].id,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )
        return SavedJobConnectionType.marshal(result)

    @strawberry.field(  # type: ignore[misc]
        description="Get all applied jobs for the current user.",
        graphql_type=JobApplicantConnectionType,
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def applied_jobs(
        self,
        info: AuthInfo,
        job_applicant_repo: Annotated[JobApplicantRepo, Inject],
        before: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items before the given cursor.",
            ),
        ] = None,
        after: Annotated[
            relay.GlobalID | None,
            strawberry.argument(
                description="Returns items after the given cursor.",
            ),
        ] = None,
        first: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return after the cursor?",
            ),
        ] = None,
        last: Annotated[
            int | None,
            strawberry.argument(
                description="How many items to return before the cursor?",
            ),
        ] = None,
    ) -> JobApplicantConnectionType:
        result = await job_applicant_repo.get_all_by_account_id(
            account_id=info.context["current_user"].id,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )
        return JobApplicantConnectionType.marshal(result)

    @strawberry.field(  # type: ignore[misc]
        graphql_type=AutocompleteJobsPayloadType,
        description="Get available autocomplete locations for the given search term.",
    )
    @inject
    async def autocomplete_jobs(
        self,
        job_repo: Annotated[JobRepo, Inject],
        search_term: Annotated[
            str,
            strawberry.argument(
                description="The search (query) term",
            ),
        ],
    ) -> AutocompleteJobsPayloadType:
        results = await job_repo.get_autocomplete_suggestions(
            search_term=search_term,
        )

        return AutocompleteJobsPayloadType(
            jobs=[JobAutocompleteSuggestionType.marshal(job) for job in results],
        )

    @strawberry.field(  # type: ignore[misc]
        graphql_type=JobClusterConnectionType,
        description="Get aggregated job clusters for map visualization using H3 hexagonal indexing.",
    )
    @inject
    async def job_clusters(
        self,
        job_cluster_service: Annotated[JobClusterService, Inject],
        bounds: Annotated[
            BoundingBoxInput,
            strawberry.argument(
                description="Geographic bounding box for map viewport (required)",
            ),
        ],
        zoom_level: Annotated[
            int,
            strawberry.argument(
                description="Map zoom level (1-20) for determining clustering resolution",
            ),
        ],
        work_mode: Annotated[
            list[JobWorkModeFilterEnum] | None,
            strawberry.argument(
                description="Filter by work mode",
            ),
        ] = None,
        job_type: Annotated[
            list[JobTypeFilterEnum] | None,
            strawberry.argument(
                description="Filter by job type",
            ),
        ] = None,
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="Search term for full-text search",
            ),
        ] = None,
        location: Annotated[
            str | None,
            strawberry.argument(
                description="Location filter for proximity search",
            ),
        ] = None,
        proximity_km: Annotated[
            float | None,
            strawberry.argument(
                description="Proximity radius in kilometers",
            ),
        ] = None,
        min_experience: Annotated[
            int | None,
            strawberry.argument(
                description="Minimum years of experience required",
            ),
        ] = None,
        max_experience: Annotated[
            int | None,
            strawberry.argument(
                description="Maximum years of experience required",
            ),
        ] = None,
        min_salary: Annotated[
            int | None,
            strawberry.argument(
                description="Minimum salary for the job",
            ),
        ] = None,
        max_salary: Annotated[
            int | None,
            strawberry.argument(
                description="Maximum salary for the job",
            ),
        ] = None,
    ) -> JobClusterConnectionType:
        # Convert bounds input to dict
        bounds_dict = {
            "sw_lat": bounds.sw_lat,
            "sw_lng": bounds.sw_lng,
            "ne_lat": bounds.ne_lat,
            "ne_lng": bounds.ne_lng,
        }

        # Build filters
        filters = JobClusterFilters(
            search_term=search_term,
            location=location,
            work_mode=[mode.value.lower() for mode in work_mode] if work_mode else [],
            job_type=[given_type.value.lower() for given_type in job_type]
            if job_type
            else [],
            proximity_km=proximity_km,
            min_experience=min_experience,
            max_experience=max_experience,
            min_salary=min_salary,
            max_salary=max_salary,
        )

        # Get clustered jobs and location viewport
        (
            clusters,
            total_count,
            location_viewport,
        ) = await job_cluster_service.get_job_clusters(
            bounds=bounds_dict,
            zoom_level=zoom_level,
            filters=filters,
        )

        return JobClusterConnectionType.marshal(
            clusters=clusters,
            total_count=total_count,
            location_viewport=location_viewport,
        )
