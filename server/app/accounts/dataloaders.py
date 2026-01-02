from strawberry.dataloader import DataLoader

from app.accounts.repositories import AccountRepo
from app.core.dataloaders import (
    create_dataloader,
    transform_valid_object_id,
)

from .documents import Account

type AccountByIdLoader = DataLoader[str, Account | None]


async def create_account_by_id_dataloader(
    account_repo: AccountRepo,
) -> AccountByIdLoader:
    """Create a dataloader to load accounts by their IDs."""
    return create_dataloader(
        repo_method=account_repo.get_many_by_ids,
        key_transform=transform_valid_object_id,
    )
