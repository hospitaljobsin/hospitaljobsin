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
        current_user_id = info.context["current_user_id"]
        if current_user_id is None:
            return NotAuthenticatedErrorType()
        result = await account_repo.get(account_id=current_user_id)
        if result is None:
            return NotAuthenticatedErrorType()
        return AccountType.marshal(result)
