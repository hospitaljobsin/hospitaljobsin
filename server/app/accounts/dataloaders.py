from typing import Annotated

from aioinject import Inject
from strawberry.dataloader import DataLoader

from app.accounts.repositories import AccountRepo, ProfileRepo
from app.core.dataloaders import (
    create_dataloader,
    transform_valid_object_id,
)

from .documents import Account, Profile

type AccountByIdLoader = DataLoader[str, Account | None]


async def create_account_by_id_dataloader(
    account_repo: Annotated[AccountRepo, Inject],
) -> AccountByIdLoader:
    """Create a dataloader to load accounts by their IDs."""
    return create_dataloader(
        repo_method=account_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


type ProfileByIdLoader = DataLoader[str, Profile | None]


async def create_profile_by_id_dataloader(
    profile_repo: Annotated[ProfileRepo, Inject],
) -> ProfileByIdLoader:
    """Create a dataloader to load profiles by their IDs."""
    return create_dataloader(
        repo_method=profile_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )
