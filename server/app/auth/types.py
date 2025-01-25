from typing import Annotated

import strawberry

from app.accounts.types import AccountType
from app.base.types import BaseErrorType


@strawberry.type(name="EmailInUseError")
class EmailInUseErrorType(BaseErrorType):
    message: str = "Email address is already in use."


@strawberry.type(name="InvalidCredentialsError")
class InvalidCredentialsErrorType(BaseErrorType):
    message: str = "Invalid credentials provided."


@strawberry.type(name="InvalidPasswordResetTokenError")
class InvalidPasswordResetTokenErrorType(BaseErrorType):
    message: str = "Invalid password reset token provided."


RegisterPayload = Annotated[
    AccountType | EmailInUseErrorType,
    strawberry.union(name="RegisterPayload"),
]

LoginPayload = Annotated[
    AccountType | InvalidCredentialsErrorType,
    strawberry.union(name="LoginPayload"),
]


@strawberry.type(name="LogoutPayload")
class LogoutPayloadType:
    message: str = "Successfully logged out."


@strawberry.type(name="RequestPasswordResetPayload")
class RequestPasswordResetPayloadType:
    message: str = "Password reset requested."


ResetPasswordPayload = Annotated[
    AccountType | InvalidPasswordResetTokenErrorType,
    strawberry.union(name="ResetPasswordPayload"),
]
