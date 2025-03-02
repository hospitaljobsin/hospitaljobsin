from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from .documents import Organization
from .repositories import OrganizationRepo


@inject
async def load_organization_by_id(
    organization_ids: list[str],
    organization_repo: Annotated[
        OrganizationRepo,
        Inject,
    ],
) -> list[Organization | None]:
    """Load multiple organizations by their IDs."""
    valid_ids = [
        ObjectId(organization_id)
        for organization_id in organization_ids
        if ObjectId.is_valid(organization_id)
    ]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_organization_map = {
        str(organization_id): organization
        for organization_id, organization in zip(
            valid_ids,
            await organization_repo.get_many_by_ids(valid_ids),
            strict=False,
        )
    }

    return [
        id_to_organization_map.get(organization_id)
        for organization_id in organization_ids
    ]


@inject
async def load_organization_by_slug(
    organization_slugs: list[str],
    organization_repo: Annotated[
        OrganizationRepo,
        Inject,
    ],
) -> list[Organization | None]:
    """Load multiple organizations by their slugs."""
    # Map invalid IDs to `None` for a consistent response structure
    slug_to_organization_map = dict(
        zip(
            organization_slugs,
            await organization_repo.get_many_by_slugs(organization_slugs),
            strict=False,
        )
    )

    return [slug_to_organization_map.get(slug) for slug in organization_slugs]
