from typing import Annotated

from aioinject import Inject
from aioinject.ext.strawberry import inject
from bson import ObjectId

from app.accounts.repositories import AccountRepo

from .documents import Account


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
        str(account_id): account
        for account_id, account in zip(
            valid_ids, await account_repo.get_many_by_ids(valid_ids)
        )
    }
    return [id_to_account_map.get(account_id, None) for account_id in account_ids]
