from typing import Annotated

import strawberry
from aioinject import Inject
from aioinject.ext.strawberry import inject
from result import Err

from app.auth.exceptions import PasswordResetTokenNotFoundError
from app.auth.services import AuthService

from .types import (
    PasswordResetTokenNotFoundErrorType,
    PasswordResetTokenPayload,
    PasswordResetTokenType,
)


@strawberry.type
class AuthQuery:
    @strawberry.field(  # type: ignore[misc]
        graphql_type=PasswordResetTokenPayload,
        description="Get a password reset token.",
    )
    @inject
    async def password_reset_token(
        self,
        auth_service: Annotated[AuthService, Inject],
        reset_token: Annotated[
            str,
            strawberry.argument(
                description="Generated password reset token",
            ),
        ],
        email: Annotated[
            str,
            strawberry.argument(
                description="The email the password reset token belongs to."
            ),
        ],
    ) -> PasswordResetTokenPayload:
        result = await auth_service.get_password_reset_token(
            password_reset_token=reset_token,
            email=email,
        )

        if isinstance(result, Err):
            match result.err_value:
                case PasswordResetTokenNotFoundError():
                    return PasswordResetTokenNotFoundErrorType()

        return PasswordResetTokenType.marshal(result.ok_value)
