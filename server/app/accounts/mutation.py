from datetime import date
from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Ok
from strawberry.permission import PermissionExtension

from app.accounts.services import AccountService, ProfileService
from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo

from .types import (
    AccountType,
    ContactInputType,
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
        contact: Annotated[
            ContactInputType,
            strawberry.argument(
                description="The contact details of the user profile.",
            ),
        ],
        address: Annotated[
            str,
            strawberry.argument(
                description="The address of the user profile.",
            ),
        ],
        gender: Annotated[
            GenderTypeEnum | None,
            strawberry.argument(
                description="The gender of the user profile.",
            ),
        ] = None,
        date_of_birth: Annotated[
            date | None,
            strawberry.argument(
                description="The date of birth of the user profile.",
            ),
        ] = None,
        marital_status: Annotated[
            MaritalStatusTypeEnum | None,
            strawberry.argument(
                description="The marital status of the user profile.",
            ),
        ] = None,
        category: Annotated[
            str | None,
            strawberry.argument(
                description="The category of the user profile.",
            ),
        ] = None,
    ) -> UpdateProfilePayload:
        """Update the current user's profile personal details."""
        match await profile_service.update_personal_details(
            account=info.context["current_user"],
            contact=contact.to_document(),
            gender=gender,
            date_of_birth=date_of_birth,
            marital_status=marital_status,
            category=category,
            address=address,
        ):
            case Ok(account):
                return AccountType.marshal_with_profile(account)
            case _ as unreachable:
                assert_never(unreachable)

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
        languages: Annotated[
            list[LanguageInputType],
            strawberry.argument(
                description="The languages of the user profile.",
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile languages."""
        match await profile_service.update_languages(
            account=info.context["current_user"],
            languages=[language.to_document() for language in languages],
        ):
            case Ok(account):
                return AccountType.marshal_with_profile(account)
            case _ as unreachable:
                assert_never(unreachable)

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
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the user account.",
            ),
        ],
    ) -> UpdateAccountPayload:
        """Update the current user's account."""
        match await account_service.update(
            account=info.context["current_user"],
            full_name=full_name,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateProfilePayload,
        description="Update the current user's profile location preferences.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def update_profile_location_preferences(
        self,
        info: AuthInfo,
        profile_service: Annotated[ProfileService, Inject],
        locations_open_to_work: Annotated[
            list[str],
            strawberry.argument(description="Locations the user is open to work in."),
        ],
        open_to_relocation_anywhere: Annotated[
            bool,
            strawberry.argument(
                description="Whether the user is open to relocation anywhere."
            ),
        ],
    ) -> UpdateProfilePayload:
        """Update the current user's profile location preferences."""
        match await profile_service.update_location_preferences(
            account=info.context["current_user"],
            locations_open_to_work=locations_open_to_work,
            open_to_relocation_anywhere=open_to_relocation_anywhere,
        ):
            case Ok(account):
                return AccountType.marshal_with_profile(account)
            case _ as unreachable:
                assert_never(unreachable)
