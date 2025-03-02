import strawberry
from aioinject.ext.strawberry import inject

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
    async def viewer(self, info: Info) -> ViewerPayload:
        current_user = info.context["current_user"]
        if current_user is None:
            return NotAuthenticatedErrorType()
        return AccountType.marshal(current_user)
