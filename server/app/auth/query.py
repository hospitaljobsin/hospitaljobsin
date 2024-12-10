from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject

from app.auth.services import AuthService
from app.context import Info

from .types import NotAuthenticatedError, ViewerPayload, ViewerType


@strawberry.type
class JobQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=ViewerType,
        description="Get the current user.",
    )
    @inject
    async def viewer(
        self,
        info: Info,
        auth_service: Annotated[
            AuthService,
            Inject,
        ],
    ) -> ViewerPayload:
        access_token = info.context["access_token"]
        if access_token is None:
            return NotAuthenticatedError()
        result = await auth_service.get_user(access_token=access_token)
        return ViewerType.marshal(result)
