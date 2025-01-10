from datetime import date
from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from strawberry.permission import PermissionExtension

from app.accounts.services import ProfileService
from app.auth.permissions import IsAuthenticated
from app.base.types import AddressInputType
from app.context import AuthInfo

from .types import (
    AccountType,
    GenderTypeEnum,
    LanguageInputType,
    MaritalStatusTypeEnum,
    UpdateProfilePayload,
)


@strawberry.type
class AccountMutation:
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
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        address: AddressInputType,
        gender: GenderTypeEnum | None = None,
        date_of_birth: date | None = None,
        marital_status: MaritalStatusTypeEnum | None = None,
        category: str | None = None,
        languages: list[LanguageInputType] | None = None,
    ) -> UpdateProfilePayload:
        """Update the current user's profile."""
        account = await profile_service.update(
            account_id=info.context["current_user_id"],
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            languages=[language.to_document() for language in languages]
            if languages is not None
            else [],
            address=address.to_document(),
        )

        # TODO: fix profile loading here: profile is already loaded
        # (maybe pass as an additional param to marshal?)
        return AccountType.marshal_with_profile(account)
