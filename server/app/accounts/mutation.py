from typing import Annotated, assert_never

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err, Ok
from strawberry.permission import PermissionExtension

from app.accounts.exceptions import (
    InvalidPhoneNumberError,
    InvalidPhoneNumberVerificationTokenError,
    PhoneNumberAlreadyExistsError,
    PhoneNumberDoesNotExistError,
    PhoneNumberVerificationTokenCooldownError,
)
from app.accounts.repositories import AccountRepo
from app.accounts.services import AccountService
from app.auth.permissions import IsAuthenticated, RequiresSudoMode
from app.context import AuthInfo, Info

from .types import (
    AccountType,
    AnalyticsPreferenceInputTypeEnum,
    InvalidPhoneNumberErrorType,
    InvalidPhoneNumberVerificationTokenErrorType,
    PhoneNumberAlreadyExistsErrorType,
    PhoneNumberDoesNotExistErrorType,
    PhoneNumberVerificationTokenCooldownErrorType,
    RemoveAccountPhoneNumberPayload,
    RequestPhoneNumberVerificationTokenPayload,
    RequestPhoneNumberVerificationTokenSuccessType,
    UpdateAccountAnalyticsPreferencePayload,
    UpdateAccountPayload,
    UpdateAccountPhoneNumberPayload,
)


@strawberry.type
class AccountMutation:
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
        avatar_url: Annotated[
            str | None,
            strawberry.argument(
                description="The URL of the profile picture.",
            ),
        ],
    ) -> UpdateAccountPayload:
        """Update the current user's account."""
        match await account_service.update(
            account=info.context["current_user"],
            full_name=full_name,
            avatar_url=avatar_url,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestPhoneNumberVerificationTokenPayload,
        description="Create a phone number verification token.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def request_phone_number_verification_token(
        self,
        account_service: Annotated[AccountService, Inject],
        phone_number: Annotated[
            str,
            strawberry.argument(
                description="The phone of the user account.",
            ),
        ],
    ) -> RequestPhoneNumberVerificationTokenPayload:
        """Create a phone number verification token."""
        match await account_service.request_phone_number_verification_token(
            phone_number=phone_number,
        ):
            case Ok(cooldown_remaining_seconds):
                return RequestPhoneNumberVerificationTokenSuccessType(
                    cooldown_remaining_seconds=cooldown_remaining_seconds,
                )
            case Err(error):
                match error:
                    case InvalidPhoneNumberError():
                        return InvalidPhoneNumberErrorType()
                    case PhoneNumberAlreadyExistsError():
                        return PhoneNumberAlreadyExistsErrorType()
                    case PhoneNumberVerificationTokenCooldownError() as err:
                        return PhoneNumberVerificationTokenCooldownErrorType(
                            remaining_seconds=err.remaining_seconds,
                        )
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateAccountPhoneNumberPayload,
        description="Update the current user's phone number.",
        extensions=[
            PermissionExtension(
                permissions=[IsAuthenticated(), RequiresSudoMode()],
            )
        ],
    )
    @inject
    async def update_account_phone_number(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
        phone_number: Annotated[
            str,
            strawberry.argument(
                description="The phone of the user account.",
            ),
        ],
        phone_number_verification_token: Annotated[
            str,
            strawberry.argument(
                description="The phone number verification token.",
            ),
        ],
    ) -> UpdateAccountPhoneNumberPayload:
        """Update the current user's phone number."""
        match await account_service.update_phone_number(
            account=info.context["current_user"],
            phone_number=phone_number,
            phone_number_verification_token=phone_number_verification_token,
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case Err(error):
                match error:
                    case InvalidPhoneNumberVerificationTokenError():
                        return InvalidPhoneNumberVerificationTokenErrorType()
                    case InvalidPhoneNumberError():
                        return InvalidPhoneNumberErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RemoveAccountPhoneNumberPayload,
        description="Remove the current user's phone number.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    RequiresSudoMode(),
                ],
            )
        ],
    )
    @inject
    async def remove_account_phone_number(
        self,
        info: AuthInfo,
        account_service: Annotated[AccountService, Inject],
    ) -> RemoveAccountPhoneNumberPayload:
        """Remove the current user's phone number."""
        match await account_service.remove_phone_number(
            account=info.context["current_user"],
        ):
            case Ok(account):
                return AccountType.marshal(account)
            case Err(error):
                match error:
                    case PhoneNumberDoesNotExistError():
                        return PhoneNumberDoesNotExistErrorType()
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=UpdateAccountAnalyticsPreferencePayload,
        description="Update the current user's analytics preference.",
    )
    @inject
    async def update_account_analytics_preference(
        self,
        info: Info,
        account_service: Annotated[AccountService, Inject],
        analytics_preference: Annotated[
            AnalyticsPreferenceInputTypeEnum,
            strawberry.argument(
                description="The analytics preference of the user account."
            ),
        ],
    ) -> UpdateAccountAnalyticsPreferencePayload:
        """Update the current user's analytics preference."""
        match await account_service.update_analytics_preference(
            account=info.context["current_user"],
            preference_type=analytics_preference.value.lower(),
            response=info.context["response"],
        ):
            case Ok(account):
                return AccountType.marshal(account) if account is not None else None
            case _ as unreachable:
                assert_never(unreachable)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=AccountType,
        description="Remove the avatar from the current user account.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def remove_account_avatar(
        self,
        info: AuthInfo,
        account_repo: Annotated[AccountRepo, Inject],
    ) -> AccountType:
        """Remove the avatar from the current user account."""
        match await account_repo.delete_avatar(account=info.context["current_user"]):
            case result:
                return AccountType.marshal(result)
