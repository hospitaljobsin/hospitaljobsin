from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry import relay
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo
from app.geocoding.types import CoordinatesInputType

from .repositories import JobApplicantRepo, JobRepo, JobType, JobWorkMode, SavedJobRepo
from .types import (
    JobApplicantConnectionType,
    JobConnectionType,
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
        proximity_km: Annotated[
            float | None,
            strawberry.argument(
                description="The proximity in km to search for jobs",
            ),
        ] = None,
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
            ),
        ] = None,
        coordinates: Annotated[
            CoordinatesInputType | None,
            strawberry.argument(
                description="The location coordinates to search for jobs",
            ),
        ] = None,
        speciality: Annotated[
            str | None,
            strawberry.argument(
                description="The speciality to filter jobs by (full-text search)",
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
        work_mode: Annotated[
            JobWorkModeFilterEnum,
            strawberry.argument(
                description="The work mode to filter jobs by.",
            ),
        ] = JobWorkModeFilterEnum.ANY,
        job_type: Annotated[
            JobTypeFilterEnum,
            strawberry.argument(
                description="The type of job to filter jobs by.",
            ),
        ] = JobTypeFilterEnum.ANY,
    ) -> JobConnectionType:
        paginated_result = await job_repo.get_all_active(
            search_term=search_term,
            coordinates=CoordinatesInputType.to_document(coordinates)
            if coordinates
            else None,
            proximity_km=proximity_km,
            speciality=speciality,
            min_experience=min_experience,
            max_experience=max_experience,
            min_salary=min_salary,
            max_salary=max_salary,
            first=first,
            last=last,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            work_mode=JobWorkMode(work_mode.value.lower()),
            job_type=JobType(job_type.value.lower()),
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
