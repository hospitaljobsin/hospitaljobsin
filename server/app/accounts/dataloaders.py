from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.accounts.repositories import AccountRepo, ProfileRepo
from app.core.dataloaders import load_many_entities, transform_valid_object_id

from .documents import Account, Profile


@inject
async def load_account_by_id(
    account_ids: list[str],
    account_repo: Annotated[AccountRepo, Inject],
) -> list[Account | None]:
    """Load multiple accounts by their IDs."""
    return await load_many_entities(
        keys=account_ids,
        repo_method=account_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )


@inject
async def load_profile_by_id(
    profile_ids: list[str],
    profile_repo: Annotated[ProfileRepo, Inject],
) -> list[Profile | None]:
    """Load multiple profiles by their IDs."""
    return await load_many_entities(
        keys=profile_ids,
        repo_method=profile_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )
