from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.core.dataloaders import load_many_entities, transform_valid_object_id

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
    return await load_many_entities(
        keys=organization_ids,
        repo_method=organization_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


@inject
async def load_organization_by_slug(
    organization_slugs: list[str],
    organization_repo: Annotated[
        OrganizationRepo,
        Inject,
    ],
) -> list[Organization | None]:
    """Load multiple organizations by their slugs."""
    return await load_many_entities(
        keys=organization_slugs,
        repo_method=organization_repo.get_many_by_slugs,
    )
