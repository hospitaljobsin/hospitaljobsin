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
        )

        return LogoutPayloadType()
