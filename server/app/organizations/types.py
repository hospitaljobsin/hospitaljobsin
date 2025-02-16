from collections.abc import Iterable
from typing import Annotated, Self

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId
from strawberry import relay

from app.base.types import (
    AddressType,
    BaseConnectionType,
    BaseEdgeType,
    BaseNodeType,
)
from app.companies.types import JobConnectionType
from app.context import Info
from app.organizations.documents import Organization
from app.organizations.repositories import JobRepo


@strawberry.type(name="Organization")
class OrganizationType(BaseNodeType[Organization]):
    name: str
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
    ) -> Annotated["JobConnectionType", strawberry.lazy("app.companies.types")]:
        """Return a paginated connection of jobs for the organization."""
        paginated_jobs = await job_repo.get_all_by_organization_id(
            organization_id=ObjectId(self.id),
            after=(after.node_id if after else None),
            before=(before.node_id if before else None),
            first=first,
            last=last,
        )

        # Convert to JobConnectionType
        return JobConnectionType.marshal_paginated_result(paginated_jobs)


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


CreateOrganizationPayload = Annotated[
    OrganizationType,
    strawberry.union(name="CreateOrganizationPayload"),
]
