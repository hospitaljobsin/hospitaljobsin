from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry.permission import PermissionExtension

from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo

from .types import (
    UpdateProfilePayload,
)


@strawberry.type
class CompanyMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile(
        self, info: AuthInfo, profile_service: Annotated[ProfileService, Inject]
    ) -> UpdateProfilePayload:
        """Update the current user's profile."""
        pass
