import hashlib
from collections.abc import Iterable
from datetime import datetime
from typing import TYPE_CHECKING, Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import Private, relay

from app.accounts.types import AccountType
from app.base.types import (
    AddressType,
    BaseConnectionType,
    BaseEdgeType,
    BaseErrorType,
    BaseNodeType,
)
from app.context import Info
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization, OrganizationMember
from app.organizations.repositories import OrganizationMemberRepo
from app.organizations.services import OrganizationMemberService

if TYPE_CHECKING:
    from app.jobs.types import JobConnectionType


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
    address: AddressType = strawberry.field(
        description="The address of the organization.",
    )
    email: str | None = strawberry.field(
        description="The contact email of the organization.",
    )
    website: str | None = strawberry.field(
        description="The website of the organization.",
    )

    assigned_logo_url: Private[str | None]

    @classmethod
    def marshal(cls, organization: Organization) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(organization.id),
            slug=organization.slug,
            name=organization.name,
            description=organization.description,
            address=AddressType.marshal(organization.address),
            email=organization.email,
            website=organization.website,
            assigned_logo_url=organization.logo_url,
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
        description="The logo URL of the organization.",
    )
    async def logo_url(self) -> str:
        """Return the organization's logo URL, or a placeholder."""
        if self.assigned_logo_url is not None:
            return self.assigned_logo_url
        slug_hash = hashlib.sha256(self.slug.encode("utf-8")).hexdigest()
        return f"https://api.dicebear.com/9.x/identicon/png?seed={slug_hash}"

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
        description="The jobs posted in the organization.",
    )
    @inject
    async def jobs(
        self,
        job_repo: Annotated[
            JobRepo,
            Inject,
        ],
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
    ) -> Annotated["JobConnectionType", strawberry.lazy("app.jobs.types")]:
        """Return a paginated connection of jobs for the organization."""
        from app.jobs.types import JobConnectionType

        paginated_jobs = await job_repo.get_all_by_organization_id(
            organization_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        # Convert to JobConnectionType
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


CreateOrganizationPayload = Annotated[
    OrganizationType | OrganizationSlugInUseErrorType,
    strawberry.union(
        name="CreateOrganizationPayload",
        description="The create organization payload.",
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
