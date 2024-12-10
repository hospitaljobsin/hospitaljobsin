import datetime
from collections.abc import Iterable
from typing import Annotated, Self

import strawberry

from app.accounts.documents import Account
from app.base.types import BaseErrorType, BaseNodeType


@strawberry.type(name="Viewer")
class ViewerType(BaseNodeType[Account]):
    email: str
    has_onboarded: bool
    updated_at: datetime | None

    @classmethod
    def marshal(cls, account: Account) -> Self:
        """Marshal into a node instance."""
        return cls(
            id=str(account.id),
            email=account.email,
            updated_at=account.updated_at,
            has_onboarded=account.has_onboarded,
        )

    @classmethod
    async def resolve_nodes(  # type: ignore[no-untyped-def] # noqa: ANN206
        cls,
        *,
        info: strawberry.Info,
        node_ids: Iterable[str],
        required: bool = False,  # noqa: ARG003
    ):
        # TODO: call admin list users or admin get user one by one (based on usernames)
        pass


@strawberry.type
class NotAuthenticatedError(BaseErrorType):
    message: str = "Not authenticated."


@strawberry.type(name="EmailInUseError")
class EmailInUseErrorType(BaseErrorType):
    message: str = "Email address is already in use."


@strawberry.type(name="InvalidCredentialsError")
class InvalidCredentialsErrorType(BaseErrorType):
    message: str = "Invalid credentials provided."


RegisterPayload = Annotated[
    ViewerType | EmailInUseErrorType,
    strawberry.union(name="RegisterPayload"),
]

LoginPayload = Annotated[
    ViewerType | InvalidCredentialsErrorType,
    strawberry.union(name="LoginPayload"),
]

ViewerPayload = Annotated[
    ViewerType | NotAuthenticatedError,
    strawberry.union(
        name="ViewerPayload",
    ),
]
