from collections.abc import Iterable
from datetime import datetime
from typing import Annotated, Self

import strawberry

from app.accounts.documents import Account
from app.base.types import BaseNodeType, NotAuthenticatedErrorType
from app.context import Info


@strawberry.type(name="Account")
class AccountType(BaseNodeType[Account]):
    email: str
    has_onboarded: bool
    updated_at: datetime | None

    @classmethod
    def marshal(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            email=account.email,
            updated_at=account.updated_at,
            has_onboarded=account.has_onboarded,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        accounts = await info.context["loaders"].account_by_id.load_many(node_ids)
        return [
            cls.marshal(account) if account is not None else account
            for account in accounts
        ]


ViewerPayload = Annotated[
    AccountType | NotAuthenticatedErrorType,
    strawberry.union(
        name="ViewerPayload",
    ),
]
