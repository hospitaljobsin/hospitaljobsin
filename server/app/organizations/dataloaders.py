from typing import Annotated

from aioinject import Inject
from strawberry.dataloader import DataLoader

from app.core.dataloaders import (
    create_dataloader,
    transform_default,
    transform_valid_object_id,
)

from .documents import Organization
from .repositories import OrganizationRepo

type OrganizationByIdLoader = DataLoader[str, Organization | None]


async def create_organization_by_id_dataloader(
    organization_repo: Annotated[OrganizationRepo, Inject],
) -> OrganizationByIdLoader:
    """Create a dataloader to load oganizations by their IDs."""
    return create_dataloader(
        repo_method=organization_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type OrganizationBySlugLoader = DataLoader[str, Organization | None]


async def create_organization_by_slug_dataloader(
    organization_repo: Annotated[OrganizationRepo, Inject],
) -> OrganizationBySlugLoader:
    """Create a dataloader to load oganizations by their slugs."""
    return create_dataloader(
        repo_method=organization_repo.get_many_by_slugs,
        key_transform=transform_default,
    )
