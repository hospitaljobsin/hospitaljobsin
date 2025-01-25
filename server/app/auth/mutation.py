from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err
from strawberry.permission import PermissionExtension

from app.accounts.repositories import AccountRepo
from app.accounts.types import AccountType
from app.auth.exceptions import EmailInUseError, InvalidCredentialsError
from app.auth.permissions import IsAuthenticated
from app.context import AuthInfo, Info

from .services import AuthService
from .types import (
    EmailInUseErrorType,
    InvalidCredentialsErrorType,
    LoginPayload,
    LogoutPayloadType,
    RegisterPayload,
    RequestPasswordResetPayloadType,
    ResetPasswordPayloadType,
)


@strawberry.type
class AuthMutation:
    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RegisterPayload,
        description="Register a new user.",
    )
    @inject
    async def register(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the new user.",
            ),
        ],
        password: Annotated[
            str,
            strawberry.argument(
                description="The password of the new user.",
            ),
        ],
        full_name: Annotated[
            str,
            strawberry.argument(
                description="The full name of the new user.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RegisterPayload:
        """Register a new user."""
        result = await auth_service.register(
            email=email,
            password=password,
            full_name=full_name,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case EmailInUseError():
                    return EmailInUseErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LoginPayload,
        description="Log in a user.",
    )
    @inject
    async def login(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the user.",
            ),
        ],
        password: Annotated[
            str,
            strawberry.argument(
                description="The password of the user.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> LoginPayload:
        """Login a user."""
        result = await auth_service.login(
            email=email,
            password=password,
            user_agent=info.context["user_agent"],
            request=info.context["request"],
            response=info.context["response"],
        )

        if isinstance(result, Err):
            match result.err_value:
                case InvalidCredentialsError():
                    return InvalidCredentialsErrorType()

        return AccountType.marshal(result.ok_value)

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=LogoutPayloadType,
        description="Log out the current user.",
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                ],
            )
        ],
    )
    @inject
    async def logout(
        self,
        info: AuthInfo,
        auth_service: Annotated[AuthService, Inject],
        account_repo: Annotated[AccountRepo, Inject],
    ) -> LogoutPayloadType:
        """Log out the current user."""
        await auth_service.logout(
            request=info.context["request"],
            response=info.context["response"],
            session_token=info.context["session_token"],
        )

        return LogoutPayloadType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=RequestPasswordResetPayloadType,
        description="Request a password reset.",
    )
    @inject
    async def request_password_reset(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the existing user.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> RequestPasswordResetPayloadType:
        """Request a password reset."""
        await auth_service.request_password_reset(
            email=email,
            user_agent=info.context["user_agent"],
            background_tasks=info.context["background_tasks"],
        )

        return RequestPasswordResetPayloadType()

    @strawberry.mutation(  # type: ignore[misc]
        graphql_type=ResetPasswordPayloadType,
        description="Reset a user's password.",
    )
    @inject
    async def reset_password(
        self,
        info: Info,
        email: Annotated[
            str,
            strawberry.argument(
                description="The email of the existing user.",
            ),
        ],
        password_reset_token: Annotated[
            str,
            strawberry.argument(
                description="The password reset token.",
            ),
        ],
        new_password: Annotated[
            str,
            strawberry.argument(
                description="The new password.",
            ),
        ],
        auth_service: Annotated[AuthService, Inject],
    ) -> ResetPasswordPayloadType:
        """Reset a user's password."""
        await auth_service.reset_password(
            email=email,
            password_reset_token=password_reset_token,
            new_password=new_password,
        )

        return ResetPasswordPayloadType()
