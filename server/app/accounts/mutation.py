from datetime import date
from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err
from strawberry.permission import PermissionExtension

from app.accounts.exceptions import AccountNotFoundError
from app.accounts.services import AccountService, ProfileService
from app.auth.permissions import IsAuthenticated
from app.base.types import AddressInputType
from app.context import AuthInfo

from .types import (
    AccountNotFoundErrorType,
    AccountType,
    GenderTypeEnum,
    LanguageInputType,
    MaritalStatusTypeEnum,
    UpdateAccountPayload,
    UpdateProfilePayload,
)


@strawberry.type
class AccountMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile personal details.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_personal_details(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        address: AddressInputType,
        gender: GenderTypeEnum | None = None,
        date_of_birth: date | None = None,
        marital_status: MaritalStatusTypeEnum | None = None,
        category: str | None = None,
    ) -> UpdateProfilePayload:
        """Update the current user's profile personal details."""
        account = await profile_service.update_personal_details(
            account_id=info.context["current_user_id"],
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            address=address.to_document(),
        )

        return AccountType.marshal_with_profile(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile languages.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_languages(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        languages: list[LanguageInputType],
    ) -> UpdateProfilePayload:
        """Update the current user's profile languages."""
        account = await profile_service.update_languages(
            account_id=info.context["current_user_id"],
            languages=[language.to_document() for language in languages],
        )

        return AccountType.marshal_with_profile(account)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateAccountPayload,
        description="Update the current user's account.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_account(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
        full_name: str,
    ) -> UpdateAccountPayload:
        """Update the current user's account."""
        result = await account_service.update(
            account_id=info.context["current_user_id"],
            full_name=full_name,
        )

        if isinstance(result, Err):
            match result.err_value:
                case AccountNotFoundError():
                    return AccountNotFoundErrorType()

        return AccountType.marshal(result.ok_value)
