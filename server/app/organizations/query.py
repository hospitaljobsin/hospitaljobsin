from typing import Annotated

import strawberry
from aioinject.ext.strawberry import inject

from app.context import Info

from .types import OrganizationNotFoundErrorType, OrganizationPayload, OrganizationType


@strawberry.type
class OrganizationQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=OrganizationPayload,
        description="Get organization by slug.",
    )
    @inject
    async def organization(
        self,
        info: Info,
        slug: Annotated[
            str,
            strawberry.argument(
                description="Slug of the organization",
            ),
        ],
    ) -> OrganizationPayload:
        result = await info.context["loaders"].organization_by_slug.load(slug)

        if result is None:
            return OrganizationNotFoundErrorType()

        return OrganizationType.marshal(result)
