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


RegisterPayload = Annotated[
    AccountType | EmailInUseErrorType,
    strawberry.union(name="RegisterPayload"),
]

LoginPayload = Annotated[
    AccountType | InvalidCredentialsErrorType,
    strawberry.union(name="LoginPayload"),
]
