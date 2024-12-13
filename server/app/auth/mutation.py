from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err

from app.accounts.repositories import AccountRepo
from app.accounts.types import AccountType
from app.auth.exceptions import EmailInUseError, InvalidCredentialsError
from app.base.types import NotAuthenticatedErrorType
from app.context import Info

from .services import AuthService
from .types import (
    EmailInUseErrorType,
    InvalidCredentialsErrorType,
    LoginPayload,
    LogoutPayload,
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
        auth_service: Annotated[AuthService, Inject],
    ) -> RegisterPayload:
        """Register a new user."""
        result = await auth_service.register(
            email=email,
            password=password,
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
        graphql_type=LogoutPayload,
        description="Log out the current user.",
    )
    @inject
    async def logout(
        self,
        info: Info,
        auth_service: Annotated[AuthService, Inject],
        account_repo: Annotated[AccountRepo, Inject],
    ) -> LogoutPayload:
        """Log out the current user."""
        current_user_id = info.context["current_user_id"]
        if current_user_id is None:
            return NotAuthenticatedErrorType()
        result = await account_repo.get(account_id=current_user_id)
        if result is None:
            return NotAuthenticatedErrorType()
        await auth_service.logout(
            request=info.context["request"],
            response=info.context["response"],
        )

        return AccountType.marshal(result)
