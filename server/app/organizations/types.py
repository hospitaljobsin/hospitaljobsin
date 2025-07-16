from collections.abc import Iterable
from datetime import datetime
from enum import Enum
from typing import Annotated, Self, assert_never

import strawberry
from aioinject import Inject, Injected
from aioinject.ext.strawberry import inject
from bson import ObjectId
from result import Err, Ok
from strawberry import relay
from strawberry.permission import PermissionExtension
from strawberry.types import Info

from app.accounts.types import AccountType
from app.auth.permissions import IsAuthenticated
from app.auth.types import InvalidEmailErrorType
from app.base.types import (
    BaseConnectionType,
    BaseEdgeType,
    BaseErrorType,
    BaseNodeType,
)
from app.context import AuthInfo
from app.jobs.repositories import JobApplicantRepo, JobRepo, JobSortBy
from app.jobs.services import JobMetricService
from app.jobs.types import (
    JobApplicantConnectionType,
    JobConnectionType,
    JobMetricPointType,
    JobPayload,
    JobSortByEnum,
)
from app.organizations.documents import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from app.organizations.exceptions import OrganizationAuthorizationError
from app.organizations.repositories import (
    OrganizationInviteRepo,
    OrganizationMemberRepo,
)
from app.organizations.services import OrganizationMemberService


@strawberry.enum(
    name="InviteStatus",
    description="Invite status type.",
)
class InviteStatusTypeEnum(Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"


@strawberry.type(
    name="TotalViewCountSuccess",
    description="The total view count success.",
)
class TotalViewCountSuccessType:
    total_view_count: int = strawberry.field(
        description="The total view count for the organization.",
    )


TotalViewCountPayload = Annotated[
    "TotalViewCountSuccessType | OrganizationAuthorizationErrorType",
    strawberry.union(
        name="TotalViewCountPayload",
        description="The total view count payload.",
    ),
]


@strawberry.type(
    name="TotalViewMetricPointsSuccess",
    description="The total view metric points success.",
)
class TotalViewMetricPointsSuccessType:
    metric_points: list[JobMetricPointType] = strawberry.field(
        description="The metric points for the organization.",
    )


TotalViewMetricPointsPayload = Annotated[
    "TotalViewMetricPointsSuccessType | OrganizationAuthorizationErrorType",
    strawberry.union(
        name="TotalViewMetricPointsPayload",
        description="The total view metric points payload.",
    ),
]


@strawberry.type(
    name="OrganizationInvite",
    description="An invite to an organization.",
)
class OrganizationInviteType(BaseNodeType[OrganizationInvite]):
    email: str = strawberry.field(
        description="The email address of the invite.",
    )
    created_by: AccountType = strawberry.field(
        description="The account that created this invite.",
    )
    organization: "OrganizationType" = strawberry.field(
        description="The organization that the invite is for."
    )
    status: InviteStatusTypeEnum = strawberry.field(
        description="The status of the invite.",
    )
    created_at: datetime = strawberry.field(
        description="When the invite was created.",
    )
    expires_at: datetime | None = strawberry.field(
        description="When the invite expires.",
    )

    @classmethod
    def marshal(cls, invite: OrganizationInvite) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(invite.id),
            created_at=invite.id.generation_time,
            created_by=AccountType.marshal(invite.created_by),
            organization=OrganizationType.marshal(invite.organization),
            email=invite.email,
            status=InviteStatusTypeEnum[invite.status.upper()],
            expires_at=invite.expires_at,
        )


@strawberry.type(name="OrganizationInviteEdge")
class OrganizationInviteEdgeType(
    BaseEdgeType[OrganizationInviteType, OrganizationInvite]
):
    @classmethod
    def marshal(cls, invite: OrganizationInvite) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=OrganizationInviteType.marshal(invite),
            cursor=relay.to_base64(AccountType, invite.id),
        )


@strawberry.type(name="InviteConnection")
class InviteConnectionType(
    BaseConnectionType[OrganizationInviteType, OrganizationInviteEdgeType]
):
    pass


@strawberry.type(name="OrganizationMemberEdge")
class OrganizationMemberEdgeType(BaseEdgeType[AccountType, OrganizationMember]):
    role: str = strawberry.field(
        description="The role of the user in the organization.",
    )
    created_at: datetime = strawberry.field(
        description="When the user joined the organization.",
    )

    @classmethod
    def marshal(cls, organization_member: OrganizationMember) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=AccountType.marshal(organization_member.account),
            cursor=relay.to_base64(AccountType, organization_member.account.id),
            created_at=organization_member.id.generation_time,
            role=organization_member.role,
        )


@strawberry.type(name="OrganizationMemberConnection")
class OrganizationMemberConnectionType(
    BaseConnectionType[AccountType, OrganizationMemberEdgeType]
):
    pass


@strawberry.type(
    name="Organization",
    description="An organization owned by an account.",
)
class OrganizationType(BaseNodeType[Organization]):
    name: str = strawberry.field(
        description="The name of the organization.",
    )
    slug: str = strawberry.field(
        description="The slug of the organization.",
    )
    description: str | None = strawberry.field(
        description="The description of the organization.",
    )
    location: str | None = strawberry.field(
        description="The location of the organization.",
    )
    email: str | None = strawberry.field(
        description="The contact email of the organization.",
    )
    website: str | None = strawberry.field(
        description="The website of the organization.",
    )
    logo_url: str = strawberry.field(
        description="The logo URL of the organization.",
    )

    @strawberry.field(
        description="The job applicants for jobs in this organization.",
    )
    @inject
    async def applicants(
        self,
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
        result = await job_applicant_repo.get_all_by_organization_id_paginated(
            organization_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )
        return JobApplicantConnectionType.marshal(result)

    @classmethod
    def marshal(cls, organization: Organization) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(organization.id),
            slug=organization.slug,
            name=organization.name,
            description=organization.description,
            location=organization.location,
            email=organization.email,
            website=organization.website,
            logo_url=organization.logo_url,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        organizations = await info.context["loaders"].organization_by_id.load_many(
            node_ids
        )
        return [
            cls.marshal(organization) if organization is not None else organization
            for organization in organizations
        ]

    @strawberry.field(  # type: ignore[misc]
        description="Get job by slug.",
    )
    @inject
    async def job(
        self,
        info: Info,
        slug: Annotated[
            str,
            strawberry.argument(
                description="Slug of the job",
            ),
        ],
    ) -> JobPayload:
        from app.jobs.types import JobNotFoundErrorType, JobType

        result = await info.context["loaders"].job_by_slug.load((self.id, slug))

        if result is None:
            # if the job is not found or the job does not belong to this organization, return an error
            return JobNotFoundErrorType()

        return JobType.marshal(result)

    @strawberry.field(  # type: ignore[misc]
        description="Total viewer count for the organization's jobs, filtered by time.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ]
            )
        ],
    )
    @inject
    async def total_view_count(
        self,
        info: AuthInfo,
        job_metric_service: Injected[JobMetricService],
        start_date: Annotated[
            datetime | None,
            strawberry.argument(
                description="Start date for filtering the view count.",
            ),
        ] = None,
        end_date: Annotated[
            datetime | None,
            strawberry.argument(
                description="End date for filtering the view count.",
            ),
        ] = None,
    ) -> TotalViewCountPayload:
        result = await job_metric_service.get_organization_impression_count(
            account=info.context["current_user"],
            organization_id=ObjectId(self.id),
            event_type="view_start",
            start_date=start_date,
            end_date=end_date,
        )

        match result:
            case Ok(total_view_count):
                return TotalViewCountSuccessType(total_view_count=total_view_count)
            case Err(error):
                match error:
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.field(  # type: ignore[misc]
        description="Total view metric points for the organization's jobs, filtered by time.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ]
            )
        ],
    )
    @inject
    async def total_view_metric_points(
        self,
        info: AuthInfo,
        job_metric_service: Injected[JobMetricService],
    ) -> TotalViewMetricPointsPayload:
        match await job_metric_service.get_organization_impression_metric_points(
            account=info.context["current_user"],
            organization_id=ObjectId(self.id),
            event_type="view_start",
        ):
            case Ok(metric_points):
                return TotalViewMetricPointsSuccessType(
                    metric_points=[
                        JobMetricPointType.marshal(point) for point in metric_points
                    ],
                )
            case Err(error):
                match error:
                    case OrganizationAuthorizationError():
                        return OrganizationAuthorizationErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.field(  # type: ignore[misc]
        description="The number of admin members in the organization.",
    )
    @inject
    async def admin_count(
        self,
        organization_member_repo: Annotated[OrganizationMemberRepo, Inject],
    ) -> int:
        """Return the number of admin members in the organization."""
        return await organization_member_repo.get_admin_count(
            organization_id=ObjectId(self.id),
        )

    @strawberry.field(  # type: ignore[misc]
        description="Whether the current user is an admin in this organization.",
    )
    @inject
    async def is_admin(
        self,
        info: Info,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
    ) -> bool:
        """Return whether the current user is an admin in this organization."""
        if info.context["current_user"] is None:
            return False
        return await organization_member_service.is_admin(
            account_id=info.context["current_user"].id,
            organization_id=ObjectId(self.id),
        )

    @strawberry.field(  # type: ignore[misc]
        description="Whether the current user is an member in this organization.",
    )
    @inject
    async def is_member(
        self,
        info: Info,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
    ) -> bool:
        """Return whether the current user is an member in this organization."""
        if info.context["current_user"] is None:
            return False
        return await organization_member_service.is_member(
            account_id=info.context["current_user"].id,
            organization_id=ObjectId(self.id),
        )

    @strawberry.field(  # type: ignore[misc]
        description="The invites created for the organization.",
    )
    @inject
    async def invites(
        self,
        invite_repo: Annotated[
            OrganizationInviteRepo,
            Inject,
        ],
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
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
    ) -> InviteConnectionType:
        """Return a paginated connection of invites for the organization."""
        paginated_invites = await invite_repo.get_all_by_organization_id(
            organization_id=ObjectId(self.id),
            search_term=search_term,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return InviteConnectionType.marshal(paginated_invites)

    @strawberry.field(  # type: ignore[misc]
        description="The jobs posted in the organization.",
    )
    @inject
    async def jobs(
        self,
        job_repo: Annotated[
            JobRepo,
            Inject,
        ],
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
            ),
        ] = None,
        is_active: Annotated[
            bool | None,
            strawberry.argument(
                description="Whether only active jobs must be returned.",
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
        sort_by: Annotated[
            JobSortByEnum,
            strawberry.argument(
                description="The field to sort jobs by.",
            ),
        ] = JobSortByEnum.CREATED_AT,
    ) -> JobConnectionType:
        """Return a paginated connection of jobs for the organization."""
        paginated_jobs = await job_repo.get_all_by_organization_id(
            organization_id=ObjectId(self.id),
            search_term=search_term,
            is_active=is_active,
            sort_by=JobSortBy(sort_by.value) if sort_by else None,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return JobConnectionType.marshal(paginated_jobs)

    @strawberry.field(  # type: ignore[misc]
        description="The members of the organization.",
    )
    @inject
    async def members(
        self,
        organization_member_repo: Annotated[
            OrganizationMemberRepo,
            Inject,
        ],
        search_term: Annotated[
            str | None,
            strawberry.argument(
                description="The search (query) term",
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
    ) -> OrganizationMemberConnectionType:
        """Return a paginated connection of members for the organization."""
        paginated_members = await organization_member_repo.get_all_by_organization_id(
            organization_id=ObjectId(self.id),
            search_term=search_term,
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        return OrganizationMemberConnectionType.marshal(paginated_members)


@strawberry.type(name="OrganizationEdge")
class OrganizationEdgeType(BaseEdgeType[OrganizationType, Organization]):
    @classmethod
    def marshal(cls, organization: Organization) -> Self:
        """Marshal into a edge instance."""
        return cls(
            node=OrganizationType.marshal(organization),
            cursor=relay.to_base64(OrganizationType, organization.id),
        )


@strawberry.type(name="OrganizationConnection")
class OrganizationConnectionType(
    BaseConnectionType[OrganizationType, OrganizationEdgeType]
):
    pass


@strawberry.type(
    name="OrganizationNotFoundError",
    description="Used when the organization is not found.",
)
class OrganizationNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Organization not found!",
    )


@strawberry.type(
    name="OrganizationSlugInUseError",
    description="Used when a organization with the slug already exists.",
)
class OrganizationSlugInUseErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Organization with slug already exists!",
    )


@strawberry.type(
    name="MemberAlreadyExistsError",
    description="Used when the user is already a member of the organization.",
)
class MemberAlreadyExistsErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="User is already a member of the organization!",
    )


@strawberry.type(
    name="OrganizationAuthorizationError",
    description="Used when the user is not authorized to perform the action in the organization.",
)
class OrganizationAuthorizationErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="You do not have sufficient role privileges to perform this action!",
    )


CreateOrganizationPayload = Annotated[
    OrganizationType | OrganizationSlugInUseErrorType,
    strawberry.union(
        name="CreateOrganizationPayload",
        description="The create organization payload.",
    ),
]


@strawberry.type(
    name="CheckOrganizationSlugAvailabilityPayload",
    description="The payload for checking if a slug is available.",
)
class CheckOrganizationSlugAvailabilityPayloadType:
    is_available: bool = strawberry.field(
        description="Whether the slug is available.",
    )


UpdateOrganizationPayload = Annotated[
    OrganizationType
    | OrganizationSlugInUseErrorType
    | OrganizationNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="UpdateOrganizationPayload",
        description="The update organization payload.",
    ),
]


DeleteOrganizationPayload = Annotated[
    OrganizationType
    | OrganizationNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="DeleteOrganizationPayload",
        description="The delete organization payload.",
    ),
]

OrganizationPayload = Annotated[
    OrganizationType | OrganizationNotFoundErrorType,
    strawberry.union(
        name="OrganizationPayload",
        description="The organization payload.",
    ),
]


@strawberry.type(
    name="CreateOrganizationLogoPresignedURLPayload",
    description="The payload for creating a presigned URL for uploading the organization logo.",
)
class CreateOrganizationLogoPresignedURLPayloadType:
    presigned_url: str = strawberry.field(
        description="The presigned URL for uploading the organization logo.",
    )


CreateOrganizationInvitePayload = Annotated[
    OrganizationInviteType
    | InvalidEmailErrorType
    | OrganizationNotFoundErrorType
    | MemberAlreadyExistsErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="CreateOrganizationInvitePayload",
        description="The create organization invite payload.",
    ),
]


@strawberry.type(
    name="OrganizationInviteNotFoundError",
    description="Used when the organization invite is not found.",
)
class OrganizationInviteNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Organization invite not found!",
    )


DeleteOrganizationInvitePayload = Annotated[
    OrganizationInviteEdgeType
    | OrganizationNotFoundErrorType
    | OrganizationInviteNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="DeleteOrganizationInvitePayload",
        description="The delete organization invite payload.",
    ),
]


AcceptOrganizationInvitePayload = Annotated[
    OrganizationInviteEdgeType | OrganizationInviteNotFoundErrorType,
    strawberry.union(
        name="AcceptOrganizationInvitePayload",
        description="The accept organization invite payload.",
    ),
]


DeclineOrganizationInvitePayload = Annotated[
    OrganizationInviteEdgeType | OrganizationInviteNotFoundErrorType,
    strawberry.union(
        name="DeclineOrganizationInvitePayload",
        description="The decline organization invite payload.",
    ),
]

OrganizationInvitePayload = Annotated[
    OrganizationInviteType | OrganizationInviteNotFoundErrorType,
    strawberry.union(
        name="OrganizationInvitePayload",
        description="The organization invite payload.",
    ),
]


@strawberry.type(
    name="OrganizationMemberNotFoundError",
    description="Used when the organization member is not found.",
)
class OrganizationMemberNotFoundErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="Organization member not found!",
    )


@strawberry.type(
    name="InsufficientOrganizationAdminsError",
    description="Used when there are not enough organization admins to remove an admin.",
)
class InsufficientOrganizationAdminsErrorType(BaseErrorType):
    message: str = strawberry.field(
        description="Human readable error message.",
        default="There are not enough organization admins to remove this admin!",
    )


@strawberry.type(
    name="RemoveOrganizationMemberSuccess",
    description="Remove organization member success.",
)
class RemoveOrganizationMemberSuccessType:
    organization_member_edge: OrganizationMemberEdgeType = strawberry.field(
        description="The organization member edge.",
    )
    organization: OrganizationType = strawberry.field(
        description="The updated organization.",
    )


RemoveOrganizationMemberPayload = Annotated[
    RemoveOrganizationMemberSuccessType
    | OrganizationNotFoundErrorType
    | OrganizationMemberNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="RemoveOrganizationMemberPayload",
        description="The remove organization member payload.",
    ),
]


@strawberry.type(
    name="PromoteOrganizationMemberSuccess",
    description="Promote organization member success.",
)
class PromoteOrganizationMemberSuccessType:
    organization_member_edge: OrganizationMemberEdgeType = strawberry.field(
        description="The organization member edge.",
    )
    organization: OrganizationType = strawberry.field(
        description="The updated organization.",
    )


PromoteOrganizationMemberPayload = Annotated[
    PromoteOrganizationMemberSuccessType
    | OrganizationNotFoundErrorType
    | OrganizationMemberNotFoundErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="PromoteOrganizationMemberPayload",
        description="The promote organization member payload.",
    ),
]


@strawberry.type(
    name="DemoteOrganizationMemberSuccess",
    description="Demote organization member success.",
)
class DemoteOrganizationMemberSuccessType:
    organization_member_edge: OrganizationMemberEdgeType = strawberry.field(
        description="The organization member edge.",
    )
    organization: OrganizationType = strawberry.field(
        description="The updated organization.",
    )


DemoteOrganizationMemberPayload = Annotated[
    DemoteOrganizationMemberSuccessType
    | OrganizationNotFoundErrorType
    | OrganizationMemberNotFoundErrorType
    | InsufficientOrganizationAdminsErrorType
    | OrganizationAuthorizationErrorType,
    strawberry.union(
        name="DemoteOrganizationMemberPayload",
        description="The demote organization member payload.",
    ),
]
