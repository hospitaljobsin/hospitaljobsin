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
    role: str
    created_at: datetime

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
    node_type = AccountType
    edge_type = OrganizationMemberEdgeType


@strawberry.type(name="Organization")
class OrganizationType(BaseNodeType[Organization]):
    name: str
    slug: str
    description: str | None
    address: AddressType
    email: str | None
    website: str | None

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

    @strawberry.field
    async def logo_url(self) -> str:
        """Return the organization's logo URL, or a placeholder."""
        if self.assigned_logo_url is not None:
            return self.assigned_logo_url
        slug_hash = hashlib.sha256(self.slug.encode("utf-8")).hexdigest()
        return f"https://api.dicebear.com/9.x/identicon/png?seed={slug_hash}"

    @strawberry.field
    @inject
    async def is_admin(
        self,
        info: Info,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
    ) -> bool:
        """Return whether the current user is an admin in this organization."""
        if info.context["current_user_id"] is None:
            return False
        return await organization_member_service.is_admin(
            account_id=info.context["current_user_id"],
            organization_id=ObjectId(self.id),
        )

    @strawberry.field
    @inject
    async def is_member(
        self,
        info: Info,
        organization_member_service: Annotated[OrganizationMemberService, Inject],
    ) -> bool:
        """Return whether the current user is an member in this organization."""
        if info.context["current_user_id"] is None:
            return False
        return await organization_member_service.is_member(
            account_id=info.context["current_user_id"],
            organization_id=ObjectId(self.id),
        )

    @strawberry.field
    @inject
    async def jobs(
        self,
        job_repo: Annotated[
            JobRepo,
            Inject,
        ],
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
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

    @strawberry.field
    @inject
    async def members(
        self,
        organization_member_repo: Annotated[
            OrganizationMemberRepo,
            Inject,
        ],
        before: relay.GlobalID | None = None,
        after: relay.GlobalID | None = None,
        first: int | None = None,
        last: int | None = None,
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
    node_type = OrganizationType
    edge_type = OrganizationEdgeType


@strawberry.type(name="OrganizationNotFoundError")
class OrganizationNotFoundErrorType(BaseErrorType):
    message: str = "Organization not found!"


@strawberry.type(name="OrganizationSlugInUseError")
class OrganizationSlugInUseErrorType(BaseErrorType):
    message: str = "Organization with slug already exists!"


CreateOrganizationPayload = Annotated[
    OrganizationType | OrganizationSlugInUseErrorType,
    strawberry.union(name="CreateOrganizationPayload"),
]


OrganizationPayload = Annotated[
    OrganizationType | OrganizationNotFoundErrorType,
    strawberry.union(name="OrganizationPayload"),
]


@strawberry.type(name="CreateOrganizationLogoPresignedURLPayload")
class CreateOrganizationLogoPresignedURLPayloadType:
    presigned_url: str
