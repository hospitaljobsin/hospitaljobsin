import dataclasses

from app.accounts.dataloaders import AccountByIdLoader


@dataclasses.dataclass(slots=True, kw_only=True)
class Dataloaders:
    account_by_id: AccountByIdLoader


def create_dataloaders(
    account_by_id: AccountByIdLoader,
) -> Dataloaders:
    """Create dataloaders for the current context."""
    return Dataloaders(
        account_by_id=account_by_id,
    )
