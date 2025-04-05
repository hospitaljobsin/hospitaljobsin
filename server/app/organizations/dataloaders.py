from strawberry.dataloader import DataLoader

from app.core.dataloaders import (
    create_dataloader,
    transform_default,
    transform_valid_object_id,
)

from .documents import Organization, OrganizationInvite
from .repositories import OrganizationInviteRepo, OrganizationRepo

type OrganizationByIdLoader = DataLoader[str, Organization | None]


async def create_organization_by_id_dataloader(
    organization_repo: OrganizationRepo,
) -> OrganizationByIdLoader:
    """Create a dataloader to load oganizations by their IDs."""
    return create_dataloader(
        repo_method=organization_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type OrganizationBySlugLoader = DataLoader[str, Organization | None]


async def create_organization_by_slug_dataloader(
    organization_repo: OrganizationRepo,
) -> OrganizationBySlugLoader:
    """Create a dataloader to load oganizations by their slugs."""
    return create_dataloader(
        repo_method=organization_repo.get_many_by_slugs,
        key_transform=transform_default,
    )


type OrganizationInviteByTokenLoader = DataLoader[
    tuple[str, str], OrganizationInvite | None
]


def transform_email_token(key: tuple[str, str]) -> tuple[str, str] | None:
    """Return the key as is."""
    return key


async def create_organization_invite_by_token_dataloader(
    organization_invite_repo: OrganizationInviteRepo,
) -> OrganizationInviteByTokenLoader:
    """Create a dataloader to load oganization invites by their tokens."""
    return create_dataloader(
        repo_method=organization_invite_repo.get_many_active_invites,
        key_transform=transform_email_token,
    )
