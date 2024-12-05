from collections.abc import Iterable
from typing import Annotated, Self

import strawberry

from app.auth.models import User
from app.base.types import BaseErrorType, BaseNodeType


@strawberry.type
class NotAuthenticatedError(BaseErrorType):
    message: str = "Not authenticated."


@strawberry.type(name="Viewer")
class ViewerType(BaseNodeType[User]):
    username: str

    @classmethod
    def marshal(cls, user: User) -> Self:
        """Marshal into a node instance."""
        return cls(
            # we can get users by their username only, from the admin API
            id=user.username,
            username=user.username,
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


ViewerResult = Annotated[
    ViewerType | NotAuthenticatedError,
    strawberry.union(
        name="ViewerResult",
    ),
]
