from collections.abc import Iterable
from typing import TYPE_CHECKING, Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import relay

from app.base.types import (
    AddressType,
    BaseConnectionType,
    BaseEdgeType,
    BaseErrorType,
    BaseNodeType,
)
from app.context import Info
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization

if TYPE_CHECKING:
    from app.jobs.types import JobConnectionType


@strawberry.type(name="Organization")
class OrganizationType(BaseNodeType[Organization]):
    name: str
    slug: str
    description: str
    address: AddressType
    phone: str
    website: str
    logo_url: str | None

    @classmethod
    def marshal(cls, organization: Organization) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(organization.id),
            slug=organization.slug,
            name=organization.name,
            description=organization.description,
            address=AddressType.marshal(organization.address),
            phone=organization.phone,
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


CreateOrganizationPayload = Annotated[
    OrganizationType,
    strawberry.union(name="CreateOrganizationPayload"),
]


OrganizationPayload = Annotated[
    OrganizationType | OrganizationNotFoundErrorType,
    strawberry.union(name="OrganizationPayload"),
]
