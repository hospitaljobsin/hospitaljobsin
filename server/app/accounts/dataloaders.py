from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.accounts.repositories import AccountRepo, ProfileRepo

from .documents import Account, Profile


@inject
async def load_account_by_id(
    account_ids: list[str],
    account_repo: Annotated[AccountRepo, Inject],
) -> list[Account | None]:
    """Load multiple accounts by their IDs."""
    valid_ids = [
        ObjectId(account_id)
        for account_id in account_ids
        if ObjectId.is_valid(account_id)
    ]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_account_map = {
        account_id: account
        for account_id, account in zip(
            valid_ids, await account_repo.get_many_by_ids(valid_ids)
        )
    }
    return [id_to_account_map.get(account_id, None) for account_id in account_ids]


@inject
async def load_profile_by_id(
    profile_ids: list[str],
    profile_repo: Annotated[ProfileRepo, Inject],
) -> list[Profile | None]:
    """Load multiple profiles by their IDs."""
    valid_ids = [
        ObjectId(profile_id)
        for profile_id in profile_ids
        if ObjectId.is_valid(profile_id)
    ]
    # Map invalid IDs to `None` for a consistent response structure
    id_to_profile_map = {
        profile_id: profile
        for profile_id, profile in zip(
            valid_ids, await profile_repo.get_many_by_ids(valid_ids)
        )
    }
    return [id_to_profile_map.get(profile_id, None) for profile_id in profile_ids]
