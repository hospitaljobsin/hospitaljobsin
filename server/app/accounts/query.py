from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.accounts.repositories import AccountRepo
from app.accounts.types import AccountType
from app.base.types import NotAuthenticatedErrorType
from app.context import Info

from .types import ViewerPayload


@strawberry.type
class AccountQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=ViewerPayload,
        description="Get the current user.",
    )
    @inject
    async def viewer(
        self,
        info: Info,
        account_repo: Annotated[
            AccountRepo,
            Inject,
        ],
    ) -> ViewerPayload:
        current_user = info.context["current_user"]
        if current_user is None:
            return NotAuthenticatedErrorType()
        return AccountType.marshal(current_user)
